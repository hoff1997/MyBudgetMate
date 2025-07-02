import { Transaction } from "@shared/schema";
import { storage } from "./storage";

// Normalize merchant names for better matching
function normalizeMerchant(merchant: string): string {
  return merchant
    .toLowerCase()
    .trim()
    // Remove common bank transaction prefixes/suffixes
    .replace(/^(eftpos|online|internet|auto|direct debit|dd|visa|mastercard|paywave)\s+/i, '')
    .replace(/\s+(eftpos|online|internet|auto|visa|mastercard|paywave)$/i, '')
    // Remove location indicators common in NZ
    .replace(/\s+(auckland|wellington|christchurch|hamilton|tauranga|dunedin|palmerston north|hastings|rotorua|napier|new plymouth|whangarei|invercargill|nelson|whanganui|gisborne)\s+/i, ' ')
    // Remove numbers at the end (store numbers, etc)
    .replace(/\s+\d+$/, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate a hash for transaction matching
export function generateTransactionHash(amount: string, date: string, merchant: string): string {
  const normalizedMerchant = normalizeMerchant(merchant);
  const hashString = `${amount}|${date}|${normalizedMerchant}`;
  // Simple hash function (in production, use a proper crypto hash)
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Check for potential duplicates when a bank transaction comes in
export async function detectDuplicates(
  bankTransaction: {
    amount: string;
    date: string;
    merchant: string;
    bankTransactionId: string;
  },
  userId: number,
  accountId: number
): Promise<{
  exactMatch?: Transaction;
  potentialDuplicates: Transaction[];
  confidence: 'high' | 'medium' | 'low';
}> {
  
  const hash = generateTransactionHash(bankTransaction.amount, bankTransaction.date, bankTransaction.merchant);
  const existingTransactions = await storage.getTransactionsByUserId(userId);
  
  // Filter to same account and similar date range (±3 days)
  const bankDate = new Date(bankTransaction.date);
  const threeDaysBefore = new Date(bankDate);
  threeDaysBefore.setDate(bankDate.getDate() - 3);
  const threeDaysAfter = new Date(bankDate);
  threeDaysAfter.setDate(bankDate.getDate() + 3);
  
  const candidateTransactions = existingTransactions.filter(tx => {
    const txDate = new Date(tx.date);
    return tx.accountId === accountId && 
           txDate >= threeDaysBefore && 
           txDate <= threeDaysAfter &&
           tx.sourceType !== 'bank_sync'; // Don't match against other bank transactions
  });
  
  // Check for exact hash match first
  const exactMatch = candidateTransactions.find(tx => tx.bankHash === hash);
  if (exactMatch) {
    return {
      exactMatch,
      potentialDuplicates: [],
      confidence: 'high'
    };
  }
  
  // Look for potential duplicates based on various criteria
  const potentialDuplicates: Array<{ transaction: Transaction; score: number }> = [];
  
  for (const tx of candidateTransactions) {
    let score = 0;
    
    // Amount match (most important)
    if (tx.amount === bankTransaction.amount) {
      score += 40;
    } else {
      // Allow small differences for rounding, fees, etc.
      const amountDiff = Math.abs(parseFloat(tx.amount) - parseFloat(bankTransaction.amount));
      if (amountDiff <= 0.05) { // 5 cents tolerance
        score += 35;
      } else if (amountDiff <= 1.00) { // $1 tolerance for fees
        score += 20;
      }
    }
    
    // Date match
    const txDate = new Date(tx.date);
    const daysDiff = Math.abs((txDate.getTime() - bankDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
      score += 30;
    } else if (daysDiff === 1) {
      score += 25;
    } else if (daysDiff === 2) {
      score += 15;
    } else if (daysDiff === 3) {
      score += 10;
    }
    
    // Merchant match
    const normalizedBankMerchant = normalizeMerchant(bankTransaction.merchant);
    const normalizedTxMerchant = normalizeMerchant(tx.merchant);
    
    if (normalizedBankMerchant === normalizedTxMerchant) {
      score += 25;
    } else {
      // Fuzzy matching for partial matches
      const similarity = calculateStringSimilarity(normalizedBankMerchant, normalizedTxMerchant);
      if (similarity > 0.8) {
        score += 20;
      } else if (similarity > 0.6) {
        score += 15;
      } else if (similarity > 0.4) {
        score += 10;
      }
    }
    
    // Boost score if transaction is pending approval (more likely to be manual entry)
    if (!tx.isApproved) {
      score += 5;
    }
    
    if (score >= 50) { // Threshold for potential duplicate
      potentialDuplicates.push({ transaction: tx, score });
    }
  }
  
  // Sort by score descending
  potentialDuplicates.sort((a, b) => b.score - a.score);
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (potentialDuplicates.length > 0) {
    const topScore = potentialDuplicates[0].score;
    if (topScore >= 85) {
      confidence = 'high';
    } else if (topScore >= 70) {
      confidence = 'medium';
    }
  }
  
  return {
    potentialDuplicates: potentialDuplicates.map(pd => pd.transaction),
    confidence
  };
}

// Calculate string similarity using Levenshtein distance
function calculateStringSimilarity(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
}

// Check if a bank transaction matches a recurring income entry
export async function checkRecurringIncomeMatch(
  userId: number,
  bankTransaction: any
): Promise<any | null> {
  const recurringTransactions = await storage.getRecurringTransactionsByUserId(userId);
  
  for (const recurring of recurringTransactions) {
    // Check if this is an income transaction (positive amount)
    const bankAmount = parseFloat(bankTransaction.amount);
    const recurringAmount = parseFloat(recurring.amount);
    
    if (bankAmount <= 0) continue; // Only check positive amounts for income
    
    // Amount matching with 5% tolerance for tax variations, fees, etc.
    const amountDiff = Math.abs(bankAmount - recurringAmount);
    const tolerance = recurringAmount * 0.05; // 5% tolerance
    
    if (amountDiff <= Math.max(tolerance, 5)) { // At least $5 tolerance
      // Check if merchant/description contains recurring income name
      const bankMerchant = (bankTransaction.merchant || '').toLowerCase();
      const bankMemo = (bankTransaction.memo || '').toLowerCase();
      const recurringName = recurring.name.toLowerCase();
      
      // Simple keyword matching
      const keywords = recurringName.split(' ').filter(word => word.length > 2);
      const matchingKeywords = keywords.filter(keyword => 
        bankMerchant.includes(keyword) || bankMemo.includes(keyword)
      );
      
      // If we have amount match and at least one keyword match, consider it a match
      if (matchingKeywords.length > 0 || amountDiff <= 1) {
        console.log(`Found recurring income match: ${recurring.name} for transaction ${bankTransaction.merchant}`);
        return recurring;
      }
    }
  }
  
  return null;
}

// Process bank transaction and handle duplicates automatically
export async function processBankTransaction(
  bankTransaction: {
    amount: string;
    date: string;
    merchant: string;
    description?: string;
    bankTransactionId: string;
  },
  userId: number,
  accountId: number
): Promise<{
  action: 'created' | 'merged' | 'flagged';
  transaction: Transaction;
  mergedWith?: Transaction;
  message: string;
}> {
  
  const duplicateResult = await detectDuplicates(bankTransaction, userId, accountId);
  
  // If exact match found, merge transactions
  if (duplicateResult.exactMatch) {
    // Update the existing transaction with bank information
    await storage.updateTransaction(duplicateResult.exactMatch.id, {
      bankTransactionId: bankTransaction.bankTransactionId,
      sourceType: 'manual', // Keep as manual since it was entered first
      duplicateStatus: 'confirmed',
      isApproved: true, // Auto-approve since it matches bank
      bankHash: generateTransactionHash(bankTransaction.amount, bankTransaction.date, bankTransaction.merchant)
    });
    
    const updatedTransaction = await storage.getTransaction(duplicateResult.exactMatch.id);
    
    return {
      action: 'merged',
      transaction: updatedTransaction!,
      mergedWith: duplicateResult.exactMatch,
      message: `Matched with existing manual entry for ${bankTransaction.merchant}`
    };
  }
  
  // If high confidence duplicate, flag for review
  if (duplicateResult.confidence === 'high' && duplicateResult.potentialDuplicates.length > 0) {
    const potentialDupe = duplicateResult.potentialDuplicates[0];
    
    // Create the bank transaction but mark as potential duplicate
    const newTransaction = await storage.createTransaction({
      userId,
      accountId,
      merchant: bankTransaction.merchant,
      description: bankTransaction.description,
      amount: bankTransaction.amount,
      date: bankTransaction.date,
      isApproved: false, // Require manual review
      sourceType: 'bank_sync',
      duplicateStatus: 'potential',
      duplicateOfId: potentialDupe.id,
      bankTransactionId: bankTransaction.bankTransactionId,
      bankHash: generateTransactionHash(bankTransaction.amount, bankTransaction.date, bankTransaction.merchant)
    });
    
    return {
      action: 'flagged',
      transaction: newTransaction,
      message: `Potential duplicate of manual entry - requires review`
    };
  }
  
  // Check for recurring income match before creating transaction
  const recurringMatch = await checkRecurringIncomeMatch(userId, bankTransaction);
  
  // No duplicates found, create new transaction
  const newTransaction = await storage.createTransaction({
    userId,
    accountId,
    merchant: bankTransaction.merchant,
    description: recurringMatch ? `Auto-matched: ${recurringMatch.name}` : bankTransaction.description,
    amount: bankTransaction.amount,
    date: bankTransaction.date,
    isApproved: recurringMatch ? false : true, // Keep recurring income for review to apply splits
    sourceType: 'bank_sync',
    duplicateStatus: 'none',
    bankTransactionId: bankTransaction.bankTransactionId,
    bankHash: generateTransactionHash(bankTransaction.amount, bankTransaction.date, bankTransaction.merchant)
  });

  // If we found a recurring income match, apply the envelope splits
  if (recurringMatch && recurringMatch.splits && recurringMatch.splits.length > 0) {
    console.log(`Applying recurring income splits for ${recurringMatch.name}`);
    
    // Create transaction envelopes based on the recurring income splits
    for (const split of recurringMatch.splits) {
      await storage.createTransactionEnvelope(
        newTransaction.id!,
        split.envelopeId,
        split.amount
      );
    }
    
    // Handle surplus if there's any
    const totalSplits = recurringMatch.splits.reduce((sum: number, split: any) => 
      sum + parseFloat(split.amount), 0);
    const surplus = parseFloat(bankTransaction.amount) - totalSplits;
    
    if (surplus > 0.01 && recurringMatch.surplusEnvelopeId) {
      await storage.createTransactionEnvelope(
        newTransaction.id!,
        recurringMatch.surplusEnvelopeId,
        surplus.toFixed(2)
      );
    }
    
    return {
      action: 'created',
      transaction: newTransaction,
      message: `Imported and matched with recurring income: ${recurringMatch.name}`
    };
  }
  
  return {
    action: 'created',
    transaction: newTransaction,
    message: `New transaction imported from ${bankTransaction.merchant}`
  };
}

// Update existing manual transactions to include hash for future matching
export async function updateExistingTransactionsWithHashes(userId: number): Promise<void> {
  const transactions = await storage.getTransactionsByUserId(userId);
  
  for (const tx of transactions) {
    if (!tx.bankHash) {
      const hash = generateTransactionHash(tx.amount, tx.date, tx.merchant);
      await storage.updateTransaction(tx.id, {
        bankHash: hash,
        sourceType: tx.sourceType || 'manual'
      });
    }
  }
}