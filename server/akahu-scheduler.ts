import { storage } from "./storage";

// Store Akahu credentials for automatic sync
interface AkahuCredentials {
  baseUrl: string;
  appToken: string;
  userToken: string;
}

let akahuCredentials: AkahuCredentials | null = null;
let syncInterval: NodeJS.Timeout | null = null;

export function setAkahuCredentials(credentials: AkahuCredentials) {
  akahuCredentials = credentials;
  console.log('✅ Akahu credentials set for automatic sync');
}

export function clearAkahuCredentials() {
  akahuCredentials = null;
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  console.log('🔄 Akahu automatic sync disabled');
}

async function syncAkahuTransactions() {
  if (!akahuCredentials) {
    return;
  }

  try {
    console.log('🔄 Starting automatic Akahu transaction sync...');
    
    const { baseUrl, appToken, userToken } = akahuCredentials;
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    
    // Get all connected accounts
    const accountsUrl = `${cleanBaseUrl}/v1/accounts`;
    const accountsResponse = await fetch(accountsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'X-Akahu-ID': appToken,
        'Content-Type': 'application/json',
        'User-Agent': 'MyBudgetMate/1.0'
      }
    });
    
    if (!accountsResponse.ok) {
      console.log('⚠️ Failed to fetch accounts from Akahu for automatic sync');
      return;
    }

    const accountsData = await accountsResponse.json();
    const akahuAccounts = accountsData.items || [];
    
    let totalImported = 0;
    
    // Get transactions for each account
    for (const akahuAccount of akahuAccounts) {
      const transactionsUrl = `${cleanBaseUrl}/v1/accounts/${akahuAccount._id}/transactions`;
      
      try {
        const transactionsResponse = await fetch(transactionsUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'X-Akahu-ID': appToken,
            'Content-Type': 'application/json',
            'User-Agent': 'MyBudgetMate/1.0'
          }
        });
        
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          const transactions = transactionsData.items || [];
          
          // Find local account that matches this Akahu account
          const localAccounts = await storage.getAccountsByUserId(1);
          const localAccount = localAccounts.find(acc => 
            (acc as any).akahuId === akahuAccount._id
          );
          
          if (localAccount && transactions.length > 0) {
            // Import transactions
            for (const akahuTx of transactions.slice(0, 20)) { // Limit to recent 20 transactions
              try {
                // Check if transaction already exists
                const existingTransactions = await storage.getTransactionsByUserId(1);
                const exists = existingTransactions.some(tx => 
                  tx.bankTransactionId === akahuTx._id
                );
                
                if (!exists) {
                  const transactionData = {
                    userId: 1,
                    accountId: localAccount.id,
                    merchant: akahuTx.merchant?.name || 'Unknown Merchant',
                    description: akahuTx.description || akahuTx.merchant?.name || 'Bank Transaction',
                    amount: akahuTx.amount.toString(),
                    date: new Date(akahuTx.date),
                    isApproved: false,
                    isTransfer: false,
                    sourceType: 'akahu_auto_sync',
                    bankTransactionId: akahuTx._id,
                    bankReference: akahuTx.reference || null,
                    bankMemo: akahuTx.memo || null
                  };
                  
                  await storage.createTransaction(transactionData);
                  totalImported++;
                }
              } catch (txError) {
                console.error('Error importing transaction during auto-sync:', txError);
              }
            }
          }
        }
      } catch (accountError) {
        console.error(`Error fetching transactions for account ${akahuAccount.name} during auto-sync:`, accountError);
      }
    }
    
    if (totalImported > 0) {
      console.log(`✅ Automatic sync complete: imported ${totalImported} new transactions`);
    } else {
      console.log('✅ Automatic sync complete: no new transactions found');
    }
    
  } catch (error) {
    console.error('Error during automatic Akahu sync:', error);
  }
}

export function startAkahuScheduler() {
  // Run sync every 4 hours (4 * 60 * 60 * 1000 milliseconds)
  const SYNC_INTERVAL = 4 * 60 * 60 * 1000;
  
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  syncInterval = setInterval(async () => {
    if (akahuCredentials) {
      await syncAkahuTransactions();
    }
  }, SYNC_INTERVAL);
  
  console.log('🔄 Akahu automatic sync scheduler started (every 4 hours)');
}

export function stopAkahuScheduler() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  console.log('⏹️ Akahu automatic sync scheduler stopped');
}