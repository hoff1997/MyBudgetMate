import { IStorage } from "./storage";
import type {
  User,
  InsertUser,
  Account,
  InsertAccount,
  Envelope,
  InsertEnvelope,
  Transaction,
  InsertTransaction,
  CategoryRule,
  InsertCategoryRule,
  EnvelopeCategory,
  InsertEnvelopeCategory,
  RecurringTransaction,
  InsertRecurringTransaction,
  BankConnection,
  InsertBankConnection
} from "@shared/schema";

// Simple Replit Database client
class ReplitDB {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REPLIT_DB_URL!;
  }

  async get(key: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${encodeURIComponent(key)}`);
      if (response.status === 404) return undefined;
      const text = await response.text();
      return JSON.parse(text);
    } catch (error) {
      return undefined;
    }
  }

  async set(key: string, value: any): Promise<void> {
    await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
    });
  }

  async delete(key: string): Promise<void> {
    await fetch(`${this.baseUrl}/${encodeURIComponent(key)}`, {
      method: "DELETE"
    });
  }

  async list(prefix?: string): Promise<string[]> {
    const url = prefix 
      ? `${this.baseUrl}?prefix=${encodeURIComponent(prefix)}`
      : `${this.baseUrl}?prefix=`;
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').filter(Boolean);
  }
}

export class ReplitStorage implements IStorage {
  private db: ReplitDB;
  private nextId: number = 1;

  constructor() {
    this.db = new ReplitDB();
    this.initializeCounters();
  }

  private async initializeCounters() {
    const counter = await this.db.get('_counter');
    if (counter) {
      this.nextId = counter;
    }
  }

  private async getNextId(): Promise<number> {
    const id = this.nextId++;
    await this.db.set('_counter', this.nextId);
    return id;
  }

  // User operations (matching IStorage interface)
  async getAllUsers(): Promise<User[]> {
    const keys = await this.db.list('user:');
    const users = [];
    for (const key of keys) {
      const user = await this.db.get(key);
      if (user) users.push(user);
    }
    return users;
  }

  async getUser(id: string | number): Promise<User | undefined> {
    if (typeof id === 'string') {
      return await this.db.get(`user:${id}`);
    } else {
      // Search by numeric ID
      const keys = await this.db.list('user:');
      for (const key of keys) {
        const user = await this.db.get(key);
        if (user && user.id === id) return user;
      }
    }
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const keys = await this.db.list('user:');
    for (const key of keys) {
      const user = await this.db.get(key);
      if (user && user.username === username) return user;
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = await this.getNextId();
    const user: User = {
      id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    await this.db.set(`user:${userData.replitId || id}`, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    const user = await this.getUser(id);
    if (user) {
      const updated = { ...user, ...updates, updatedAt: new Date() };
      await this.db.set(`user:${user.replitId || id}`, updated);
    }
  }

  async upsertUser(userData: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User> {
    const existing = await this.getUser(userData.id);
    const user: User = {
      id: existing?.id || await this.getNextId(),
      replitId: userData.id,
      email: userData.email || existing?.email || null,
      firstName: userData.firstName || existing?.firstName || null,
      lastName: userData.lastName || existing?.lastName || null,
      profileImageUrl: userData.profileImageUrl || existing?.profileImageUrl || null,
      username: existing?.username || null,
      budgetName: existing?.budgetName || null,
      payCycle: existing?.payCycle || null,
      twoFactorEnabled: existing?.twoFactorEnabled || false,
      twoFactorSecret: existing?.twoFactorSecret || null,
      backupCodes: existing?.backupCodes || null,
      phoneNumber: existing?.phoneNumber || null,
      emailVerified: existing?.emailVerified || false,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    await this.db.set(`user:${userData.id}`, user);
    return user;
  }

  // Account operations
  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const keys = await this.db.list(`account:${userId}:`);
    const accounts = [];
    for (const key of keys) {
      const account = await this.db.get(key);
      if (account) accounts.push(account);
    }
    return accounts.sort((a, b) => a.id - b.id);
  }

  async getAccount(id: number): Promise<Account | undefined> {
    const keys = await this.db.list('account:');
    for (const key of keys) {
      const account = await this.db.get(key);
      if (account && account.id === id) return account;
    }
    return undefined;
  }

  async createAccount(accountData: InsertAccount): Promise<Account> {
    const id = await this.getNextId();
    const account: Account = {
      id,
      ...accountData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.set(`account:${accountData.userId}:${id}`, account);
    return account;
  }

  async updateAccount(id: number, accountData: Partial<InsertAccount>): Promise<Account> {
    const existing = await this.getAccount(id);
    if (!existing) throw new Error('Account not found');
    
    const updated: Account = {
      ...existing,
      ...accountData,
      updatedAt: new Date(),
    };
    await this.db.set(`account:${existing.userId}:${id}`, updated);
    return updated;
  }

  async deleteAccount(id: number): Promise<void> {
    const account = await this.getAccount(id);
    if (account) {
      await this.db.delete(`account:${account.userId}:${id}`);
    }
  }

  // Envelope operations
  async getEnvelopesByUserId(userId: string): Promise<Envelope[]> {
    const keys = await this.db.list(`envelope:${userId}:`);
    const envelopes = [];
    for (const key of keys) {
      const envelope = await this.db.get(key);
      if (envelope) envelopes.push(envelope);
    }
    return envelopes.sort((a, b) => a.id - b.id);
  }

  async getEnvelope(id: number): Promise<Envelope | undefined> {
    const keys = await this.db.list('envelope:');
    for (const key of keys) {
      const envelope = await this.db.get(key);
      if (envelope && envelope.id === id) return envelope;
    }
    return undefined;
  }

  async createEnvelope(envelopeData: InsertEnvelope): Promise<Envelope> {
    const id = await this.getNextId();
    const envelope: Envelope = {
      id,
      ...envelopeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.set(`envelope:${envelopeData.userId}:${id}`, envelope);
    return envelope;
  }

  async updateEnvelope(id: number, envelopeData: Partial<InsertEnvelope>): Promise<Envelope> {
    const existing = await this.getEnvelope(id);
    if (!existing) throw new Error('Envelope not found');
    
    const updated: Envelope = {
      ...existing,
      ...envelopeData,
      updatedAt: new Date(),
    };
    await this.db.set(`envelope:${existing.userId}:${id}`, updated);
    return updated;
  }

  async deleteEnvelope(id: number): Promise<void> {
    const envelope = await this.getEnvelope(id);
    if (envelope) {
      await this.db.delete(`envelope:${envelope.userId}:${id}`);
    }
  }

  // Transaction operations
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const keys = await this.db.list(`transaction:${userId}:`);
    const transactions = [];
    for (const key of keys) {
      const transaction = await this.db.get(key);
      if (transaction) transactions.push(transaction);
    }
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const keys = await this.db.list('transaction:');
    for (const key of keys) {
      const transaction = await this.db.get(key);
      if (transaction && transaction.id === id) return transaction;
    }
    return undefined;
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = await this.getNextId();
    const transaction: Transaction = {
      id,
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.set(`transaction:${transactionData.userId}:${id}`, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    const existing = await this.getTransaction(id);
    if (!existing) throw new Error('Transaction not found');
    
    const updated: Transaction = {
      ...existing,
      ...transactionData,
      updatedAt: new Date(),
    };
    await this.db.set(`transaction:${existing.userId}:${id}`, updated);
    return updated;
  }

  async deleteTransaction(id: number): Promise<void> {
    const transaction = await this.getTransaction(id);
    if (transaction) {
      await this.db.delete(`transaction:${transaction.userId}:${id}`);
      
      // Also delete related transaction envelopes
      const envKeys = await this.db.list(`transaction_envelope:${id}:`);
      for (const envKey of envKeys) {
        await this.db.delete(envKey);
      }
      
      // Also delete related transaction labels
      const labelKeys = await this.db.list(`transaction_label:${id}:`);
      for (const labelKey of labelKeys) {
        await this.db.delete(labelKey);
      }
    }
  }

  // Transaction Envelope operations
  async getTransactionEnvelopesByTransactionId(transactionId: number): Promise<TransactionEnvelope[]> {
    const keys = await this.db.list(`transaction_envelope:${transactionId}:`);
    const transactionEnvelopes = [];
    for (const key of keys) {
      const te = await this.db.get(key);
      if (te) transactionEnvelopes.push(te);
    }
    return transactionEnvelopes;
  }

  async createTransactionEnvelope(data: InsertTransactionEnvelope): Promise<TransactionEnvelope> {
    const id = await this.getNextId();
    const transactionEnvelope: TransactionEnvelope = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.db.set(`transaction_envelope:${data.transactionId}:${id}`, transactionEnvelope);
    return transactionEnvelope;
  }

  async deleteTransactionEnvelopes(transactionId: number): Promise<void> {
    const keys = await this.db.list(`transaction_envelope:${transactionId}:`);
    for (const key of keys) {
      await this.db.delete(key);
    }
  }

  // Placeholder implementations for other required methods - using in-memory fallback
  async getCategoryRulesByUserId(userId: number): Promise<any[]> { return []; }
  async createCategoryRule(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async deleteCategoryRule(id: number): Promise<void> { }

  async getEnvelopeCategoriesByUserId(userId: number): Promise<any[]> { return []; }
  async createEnvelopeCategory(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async updateEnvelopeCategory(id: number, data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async deleteEnvelopeCategory(id: number): Promise<void> { }

  async getLabelsByUserId(userId: number): Promise<any[]> { return []; }
  async createLabel(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async updateLabel(id: number, data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async deleteLabel(id: number): Promise<void> { }

  async getTransactionLabelsByTransactionId(transactionId: number): Promise<any[]> { return []; }
  async createTransactionLabel(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async deleteTransactionLabels(transactionId: number): Promise<void> { }

  async getRecurringTransactionsByUserId(userId: number): Promise<any[]> { return []; }
  async createRecurringTransaction(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async updateRecurringTransaction(id: number, data: any): Promise<void> { }
  async deleteRecurringTransaction(id: number): Promise<void> { }

  async getBankConnectionsByUserId(userId: number): Promise<any[]> { return []; }
  async createBankConnection(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async updateBankConnection(id: number, data: any): Promise<void> { }
  async deleteBankConnection(id: number): Promise<void> { }

  // Additional placeholder methods to match IStorage interface
  async updateAccountBalance(id: number, balance: string): Promise<void> {
    const account = await this.getAccount(id);
    if (account) {
      await this.updateAccount(id, { balance });
    }
  }

  async updateEnvelopeBalance(id: number, balance: string): Promise<void> {
    const envelope = await this.getEnvelope(id);
    if (envelope) {
      await this.updateEnvelope(id, { currentBalance: balance });
    }
  }

  async updateEnvelopeCategory(id: number, categoryId: number | null, sortOrder: number): Promise<void> {
    const envelope = await this.getEnvelope(id);
    if (envelope) {
      await this.updateEnvelope(id, { categoryId, sortOrder });
    }
  }

  // Additional methods not implemented yet
  async getMerchantMemoryByUserId(userId: number): Promise<any[]> { return []; }
  async getMerchantSuggestion(userId: number, merchant: string): Promise<any> { return undefined; }
  async getRecurringTransaction(id: number): Promise<any> { return undefined; }
  async getRecurringTransactionSplits(transactionId: number): Promise<any[]> { return []; }
  async createRecurringTransactionSplit(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async getBankConnection(id: number): Promise<any> { return undefined; }
  async getEnvelopeTypesByUserId(userId: number): Promise<any[]> { return []; }
  async getEnvelopeType(id: number): Promise<any> { return undefined; }
  async createEnvelopeType(data: any): Promise<any> { throw new Error('Not implemented in Replit Storage'); }
  async updateEnvelopeType(id: number, data: any): Promise<void> { }
  async deleteEnvelopeType(id: number): Promise<void> { }
  async getUserTwoFactorInfo(userId: number): Promise<any> { return undefined; }
  async updateUserTwoFactor(userId: number, updates: any): Promise<void> { }
}