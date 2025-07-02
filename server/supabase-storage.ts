import { supabase } from './supabase';

// Helper function to check if Supabase is available
function checkSupabase() {
  if (!supabase) {
    throw new Error('Supabase not configured. Please add SUPABASE_URL and SUPABASE_KEY to your environment variables.');
  }
  return supabase;
}
import type { IStorage } from './storage';
import type {
  User, InsertUser,
  Account, InsertAccount,
  Envelope, InsertEnvelope,
  EnvelopeCategory, InsertEnvelopeCategory,
  Transaction, InsertTransaction,
  TransactionEnvelope,
  CategoryRule, InsertCategoryRule,
  MerchantMemory, InsertMerchantMemory,
  Asset, InsertAsset,
  Liability, InsertLiability,
  NetWorthSnapshot, InsertNetWorthSnapshot,
  RecurringTransaction, InsertRecurringTransaction,
  RecurringTransactionSplit, InsertRecurringTransactionSplit,
  BankConnection, InsertBankConnection,
  Label, InsertLabel,
  TransactionLabel
} from '../shared/schema';

/**
 * Supabase Storage Implementation
 * 
 * This class implements all database operations using Supabase PostgreSQL.
 * All data is persisted to Supabase and automatically loaded on app startup.
 * 
 * Key features:
 * - Real-time data persistence to Supabase
 * - Automatic data loading from database
 * - No local storage - everything in cloud database
 * - Transactional operations for data integrity
 */
export class SupabaseStorage implements IStorage {
  
  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  async getAllUsers(): Promise<User[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
    
    return data as User[];
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // No rows found
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    return data as User;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // ============================================================================
  // ACCOUNT OPERATIONS
  // ============================================================================

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching accounts:', error);
      throw new Error(`Failed to fetch accounts: ${error.message}`);
    }
    
    return data as Account[];
  }

  async getAccount(id: number): Promise<Account | undefined> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching account:', error);
      return undefined;
    }
    
    return data as Account;
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating account:', error);
      throw new Error(`Failed to create account: ${error.message}`);
    }
    
    return data as Account;
  }

  async updateAccount(id: number, updates: Partial<Account>): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating account:', error);
      throw new Error(`Failed to update account: ${error.message}`);
    }
  }

  async updateAccountBalance(id: number, balance: string): Promise<void> {
    await this.updateAccount(id, { balance });
  }

  async deleteAccount(id: number): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting account:', error);
      throw new Error(`Failed to delete account: ${error.message}`);
    }
  }

  // ============================================================================
  // ENVELOPE OPERATIONS
  // ============================================================================

  async getEnvelopesByUserId(userId: number): Promise<Envelope[]> {
    const { data, error } = await supabase
      .from('envelopes')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching envelopes:', error);
      throw new Error(`Failed to fetch envelopes: ${error.message}`);
    }
    
    return data as Envelope[];
  }

  async getEnvelope(id: number): Promise<Envelope | undefined> {
    const { data, error } = await supabase
      .from('envelopes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching envelope:', error);
      return undefined;
    }
    
    return data as Envelope;
  }

  async createEnvelope(envelope: InsertEnvelope): Promise<Envelope> {
    const { data, error } = await supabase
      .from('envelopes')
      .insert(envelope)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating envelope:', error);
      throw new Error(`Failed to create envelope: ${error.message}`);
    }
    
    return data as Envelope;
  }

  async updateEnvelope(id: number, updates: Partial<Envelope>): Promise<void> {
    const { error } = await supabase
      .from('envelopes')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating envelope:', error);
      throw new Error(`Failed to update envelope: ${error.message}`);
    }
  }

  async updateEnvelopeBalance(id: number, balance: string): Promise<void> {
    await this.updateEnvelope(id, { currentBalance: balance });
  }

  async updateEnvelopeCategory(id: number, categoryId: number | null, sortOrder: number): Promise<void> {
    await this.updateEnvelope(id, { categoryId, sortOrder });
  }

  async deleteEnvelope(id: number): Promise<void> {
    const { error } = await supabase
      .from('envelopes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting envelope:', error);
      throw new Error(`Failed to delete envelope: ${error.message}`);
    }
  }

  // ============================================================================
  // ENVELOPE CATEGORY OPERATIONS
  // ============================================================================

  async getEnvelopeCategoriesByUserId(userId: number): Promise<EnvelopeCategory[]> {
    const { data, error } = await supabase
      .from('envelope_categories')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching envelope categories:', error);
      throw new Error(`Failed to fetch envelope categories: ${error.message}`);
    }
    
    return data as EnvelopeCategory[];
  }

  async getEnvelopeCategory(id: number): Promise<EnvelopeCategory | undefined> {
    const { data, error } = await supabase
      .from('envelope_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching envelope category:', error);
      return undefined;
    }
    
    return data as EnvelopeCategory;
  }

  async createEnvelopeCategory(category: InsertEnvelopeCategory): Promise<EnvelopeCategory> {
    const { data, error } = await supabase
      .from('envelope_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating envelope category:', error);
      throw new Error(`Failed to create envelope category: ${error.message}`);
    }
    
    return data as EnvelopeCategory;
  }

  async updateEnvelopeCategory(id: number, updates: Partial<EnvelopeCategory>): Promise<void> {
    const { error } = await supabase
      .from('envelope_categories')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating envelope category:', error);
      throw new Error(`Failed to update envelope category: ${error.message}`);
    }
  }

  async deleteEnvelopeCategory(id: number): Promise<void> {
    const { error } = await supabase
      .from('envelope_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting envelope category:', error);
      throw new Error(`Failed to delete envelope category: ${error.message}`);
    }
  }

  // ============================================================================
  // TRANSACTION OPERATIONS
  // ============================================================================

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
    
    return data as Transaction[];
  }

  async getPendingTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('approved', false)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending transactions:', error);
      throw new Error(`Failed to fetch pending transactions: ${error.message}`);
    }
    
    return data as Transaction[];
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching transaction:', error);
      return undefined;
    }
    
    return data as Transaction;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
    
    return data as Transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating transaction:', error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async approveTransaction(id: number): Promise<void> {
    await this.updateTransaction(id, { approved: true });
  }

  async deleteTransaction(id: number): Promise<void> {
    // First delete related transaction envelopes
    await this.deleteTransactionEnvelopes(id);
    
    // Then delete the transaction
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }
  }

  // ============================================================================
  // TRANSACTION ENVELOPE OPERATIONS
  // ============================================================================

  async getTransactionEnvelopes(transactionId: number): Promise<TransactionEnvelope[]> {
    const { data, error } = await supabase
      .from('transaction_envelopes')
      .select('*')
      .eq('transaction_id', transactionId);
    
    if (error) {
      console.error('Error fetching transaction envelopes:', error);
      throw new Error(`Failed to fetch transaction envelopes: ${error.message}`);
    }
    
    return data as TransactionEnvelope[];
  }

  async createTransactionEnvelope(transactionId: number, envelopeId: number, amount: string): Promise<void> {
    const { error } = await supabase
      .from('transaction_envelopes')
      .insert({
        transaction_id: transactionId,
        envelope_id: envelopeId,
        amount
      });
    
    if (error) {
      console.error('Error creating transaction envelope:', error);
      throw new Error(`Failed to create transaction envelope: ${error.message}`);
    }
  }

  async deleteTransactionEnvelopes(transactionId: number): Promise<void> {
    const { error } = await supabase
      .from('transaction_envelopes')
      .delete()
      .eq('transaction_id', transactionId);
    
    if (error) {
      console.error('Error deleting transaction envelopes:', error);
      throw new Error(`Failed to delete transaction envelopes: ${error.message}`);
    }
  }

  // ============================================================================
  // CATEGORY RULE OPERATIONS
  // ============================================================================

  async getCategoryRulesByUserId(userId: number): Promise<CategoryRule[]> {
    const { data, error } = await supabase
      .from('category_rules')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching category rules:', error);
      throw new Error(`Failed to fetch category rules: ${error.message}`);
    }
    
    return data as CategoryRule[];
  }

  async createCategoryRule(rule: InsertCategoryRule): Promise<CategoryRule> {
    const { data, error } = await supabase
      .from('category_rules')
      .insert(rule)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category rule:', error);
      throw new Error(`Failed to create category rule: ${error.message}`);
    }
    
    return data as CategoryRule;
  }

  async deleteCategoryRule(id: number): Promise<void> {
    const { error } = await supabase
      .from('category_rules')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category rule:', error);
      throw new Error(`Failed to delete category rule: ${error.message}`);
    }
  }

  // ============================================================================
  // MERCHANT MEMORY OPERATIONS
  // ============================================================================

  async getMerchantMemoryByUserId(userId: number): Promise<MerchantMemory[]> {
    const { data, error } = await supabase
      .from('merchant_memory')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching merchant memory:', error);
      throw new Error(`Failed to fetch merchant memory: ${error.message}`);
    }
    
    return data as MerchantMemory[];
  }

  async getMerchantSuggestion(userId: number, merchant: string): Promise<MerchantMemory | undefined> {
    const { data, error } = await supabase
      .from('merchant_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('merchant', merchant)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching merchant suggestion:', error);
      return undefined;
    }
    
    return data as MerchantMemory;
  }

  async upsertMerchantMemory(memory: InsertMerchantMemory): Promise<MerchantMemory> {
    const { data, error } = await supabase
      .from('merchant_memory')
      .upsert(memory, { 
        onConflict: 'user_id,merchant',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting merchant memory:', error);
      throw new Error(`Failed to upsert merchant memory: ${error.message}`);
    }
    
    return data as MerchantMemory;
  }

  // ============================================================================
  // LABEL OPERATIONS
  // ============================================================================

  async getLabelsByUserId(userId: number): Promise<Label[]> {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching labels:', error);
      throw new Error(`Failed to fetch labels: ${error.message}`);
    }
    
    return data as Label[];
  }

  async getLabel(id: number): Promise<Label | undefined> {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching label:', error);
      return undefined;
    }
    
    return data as Label;
  }

  async createLabel(label: InsertLabel): Promise<Label> {
    const { data, error } = await supabase
      .from('labels')
      .insert(label)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating label:', error);
      throw new Error(`Failed to create label: ${error.message}`);
    }
    
    return data as Label;
  }

  async updateLabel(id: number, updates: Partial<Label>): Promise<void> {
    const { error } = await supabase
      .from('labels')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating label:', error);
      throw new Error(`Failed to update label: ${error.message}`);
    }
  }

  async deleteLabel(id: number): Promise<void> {
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting label:', error);
      throw new Error(`Failed to delete label: ${error.message}`);
    }
  }

  // ============================================================================
  // TRANSACTION LABEL OPERATIONS
  // ============================================================================

  async getTransactionLabels(transactionId: number): Promise<TransactionLabel[]> {
    const { data, error } = await supabase
      .from('transaction_labels')
      .select('*')
      .eq('transaction_id', transactionId);
    
    if (error) {
      console.error('Error fetching transaction labels:', error);
      throw new Error(`Failed to fetch transaction labels: ${error.message}`);
    }
    
    return data as TransactionLabel[];
  }

  async createTransactionLabel(transactionId: number, labelId: number): Promise<void> {
    const { error } = await supabase
      .from('transaction_labels')
      .insert({
        transaction_id: transactionId,
        label_id: labelId
      });
    
    if (error) {
      console.error('Error creating transaction label:', error);
      throw new Error(`Failed to create transaction label: ${error.message}`);
    }
  }

  async deleteTransactionLabel(transactionId: number, labelId: number): Promise<void> {
    const { error } = await supabase
      .from('transaction_labels')
      .delete()
      .eq('transaction_id', transactionId)
      .eq('label_id', labelId);
    
    if (error) {
      console.error('Error deleting transaction label:', error);
      throw new Error(`Failed to delete transaction label: ${error.message}`);
    }
  }

  async deleteAllTransactionLabels(transactionId: number): Promise<void> {
    const { error } = await supabase
      .from('transaction_labels')
      .delete()
      .eq('transaction_id', transactionId);
    
    if (error) {
      console.error('Error deleting all transaction labels:', error);
      throw new Error(`Failed to delete all transaction labels: ${error.message}`);
    }
  }

  // ============================================================================
  // ASSET OPERATIONS
  // ============================================================================

  async getAssetsByUserId(userId: number): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching assets:', error);
      throw new Error(`Failed to fetch assets: ${error.message}`);
    }
    
    return data as Asset[];
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching asset:', error);
      return undefined;
    }
    
    return data as Asset;
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating asset:', error);
      throw new Error(`Failed to create asset: ${error.message}`);
    }
    
    return data as Asset;
  }

  async updateAsset(id: number, updates: Partial<Asset>): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating asset:', error);
      throw new Error(`Failed to update asset: ${error.message}`);
    }
  }

  async deleteAsset(id: number): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting asset:', error);
      throw new Error(`Failed to delete asset: ${error.message}`);
    }
  }

  // ============================================================================
  // LIABILITY OPERATIONS
  // ============================================================================

  async getLiabilitiesByUserId(userId: number): Promise<Liability[]> {
    const { data, error } = await supabase
      .from('liabilities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching liabilities:', error);
      throw new Error(`Failed to fetch liabilities: ${error.message}`);
    }
    
    return data as Liability[];
  }

  async getLiability(id: number): Promise<Liability | undefined> {
    const { data, error } = await supabase
      .from('liabilities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching liability:', error);
      return undefined;
    }
    
    return data as Liability;
  }

  async createLiability(liability: InsertLiability): Promise<Liability> {
    const { data, error } = await supabase
      .from('liabilities')
      .insert(liability)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating liability:', error);
      throw new Error(`Failed to create liability: ${error.message}`);
    }
    
    return data as Liability;
  }

  async updateLiability(id: number, updates: Partial<Liability>): Promise<void> {
    const { error } = await supabase
      .from('liabilities')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating liability:', error);
      throw new Error(`Failed to update liability: ${error.message}`);
    }
  }

  async deleteLiability(id: number): Promise<void> {
    const { error } = await supabase
      .from('liabilities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting liability:', error);
      throw new Error(`Failed to delete liability: ${error.message}`);
    }
  }

  // ============================================================================
  // NET WORTH SNAPSHOT OPERATIONS
  // ============================================================================

  async getNetWorthSnapshotsByUserId(userId: number): Promise<NetWorthSnapshot[]> {
    const { data, error } = await supabase
      .from('net_worth_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching net worth snapshots:', error);
      throw new Error(`Failed to fetch net worth snapshots: ${error.message}`);
    }
    
    return data as NetWorthSnapshot[];
  }

  async createNetWorthSnapshot(snapshot: InsertNetWorthSnapshot): Promise<NetWorthSnapshot> {
    const { data, error } = await supabase
      .from('net_worth_snapshots')
      .insert(snapshot)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating net worth snapshot:', error);
      throw new Error(`Failed to create net worth snapshot: ${error.message}`);
    }
    
    return data as NetWorthSnapshot;
  }

  // ============================================================================
  // RECURRING TRANSACTION OPERATIONS
  // ============================================================================

  async getRecurringTransactionsByUserId(userId: number): Promise<RecurringTransaction[]> {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching recurring transactions:', error);
      throw new Error(`Failed to fetch recurring transactions: ${error.message}`);
    }
    
    return data as RecurringTransaction[];
  }

  async getRecurringTransaction(id: number): Promise<RecurringTransaction | undefined> {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching recurring transaction:', error);
      return undefined;
    }
    
    return data as RecurringTransaction;
  }

  async createRecurringTransaction(transaction: InsertRecurringTransaction): Promise<RecurringTransaction> {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating recurring transaction:', error);
      throw new Error(`Failed to create recurring transaction: ${error.message}`);
    }
    
    return data as RecurringTransaction;
  }

  async updateRecurringTransaction(id: number, updates: Partial<RecurringTransaction>): Promise<void> {
    const { error } = await supabase
      .from('recurring_transactions')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating recurring transaction:', error);
      throw new Error(`Failed to update recurring transaction: ${error.message}`);
    }
  }

  async deleteRecurringTransaction(id: number): Promise<void> {
    // First delete related splits
    await this.deleteRecurringTransactionSplits(id);
    
    // Then delete the recurring transaction
    const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting recurring transaction:', error);
      throw new Error(`Failed to delete recurring transaction: ${error.message}`);
    }
  }

  // ============================================================================
  // RECURRING TRANSACTION SPLIT OPERATIONS
  // ============================================================================

  async getRecurringTransactionSplits(recurringTransactionId: number): Promise<RecurringTransactionSplit[]> {
    const { data, error } = await supabase
      .from('recurring_transaction_splits')
      .select('*')
      .eq('recurring_transaction_id', recurringTransactionId);
    
    if (error) {
      console.error('Error fetching recurring transaction splits:', error);
      throw new Error(`Failed to fetch recurring transaction splits: ${error.message}`);
    }
    
    return data as RecurringTransactionSplit[];
  }

  async createRecurringTransactionSplit(split: InsertRecurringTransactionSplit): Promise<RecurringTransactionSplit> {
    const { data, error } = await supabase
      .from('recurring_transaction_splits')
      .insert(split)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating recurring transaction split:', error);
      throw new Error(`Failed to create recurring transaction split: ${error.message}`);
    }
    
    return data as RecurringTransactionSplit;
  }

  async deleteRecurringTransactionSplits(recurringTransactionId: number): Promise<void> {
    const { error } = await supabase
      .from('recurring_transaction_splits')
      .delete()
      .eq('recurring_transaction_id', recurringTransactionId);
    
    if (error) {
      console.error('Error deleting recurring transaction splits:', error);
      throw new Error(`Failed to delete recurring transaction splits: ${error.message}`);
    }
  }

  // ============================================================================
  // BANK CONNECTION OPERATIONS
  // ============================================================================

  async getBankConnectionsByUserId(userId: number): Promise<BankConnection[]> {
    const { data, error } = await supabase
      .from('bank_connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching bank connections:', error);
      throw new Error(`Failed to fetch bank connections: ${error.message}`);
    }
    
    return data as BankConnection[];
  }

  async getBankConnection(id: number): Promise<BankConnection | undefined> {
    const { data, error } = await supabase
      .from('bank_connections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined;
      console.error('Error fetching bank connection:', error);
      return undefined;
    }
    
    return data as BankConnection;
  }

  async createBankConnection(connection: InsertBankConnection): Promise<BankConnection> {
    const { data, error } = await supabase
      .from('bank_connections')
      .insert(connection)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating bank connection:', error);
      throw new Error(`Failed to create bank connection: ${error.message}`);
    }
    
    return data as BankConnection;
  }

  async updateBankConnection(id: number, updates: Partial<BankConnection>): Promise<void> {
    const { error } = await supabase
      .from('bank_connections')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating bank connection:', error);
      throw new Error(`Failed to update bank connection: ${error.message}`);
    }
  }

  async deleteBankConnection(id: number): Promise<void> {
    const { error } = await supabase
      .from('bank_connections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting bank connection:', error);
      throw new Error(`Failed to delete bank connection: ${error.message}`);
    }
  }
}

// Create and export the Supabase storage instance
export const supabaseStorage = new SupabaseStorage();