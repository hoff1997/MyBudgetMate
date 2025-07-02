import { 
  users, accounts, envelopes, envelopeCategories, transactions, transactionEnvelopes, categoryRules, merchantMemory, bankConnections, recurringTransactions, recurringTransactionSplits, assets, liabilities, netWorthSnapshots, labels, transactionLabels, envelopeTypes,
  type User, type InsertUser,
  type Account, type InsertAccount,
  type Envelope, type InsertEnvelope,
  type EnvelopeCategory, type InsertEnvelopeCategory,
  type Transaction, type InsertTransaction,
  type TransactionEnvelope,
  type CategoryRule, type InsertCategoryRule,
  type MerchantMemory, type InsertMerchantMemory,
  type BankConnection, type InsertBankConnection,
  type RecurringTransaction, type InsertRecurringTransaction,
  type RecurringTransactionSplit, type InsertRecurringTransactionSplit,
  type Asset, type InsertAsset,
  type Liability, type InsertLiability,
  type NetWorthSnapshot, type InsertNetWorthSnapshot,
  type Label, type InsertLabel,
  type TransactionLabel,
  type EnvelopeType, type InsertEnvelopeType
} from "@shared/schema";

export interface IStorage {
  // Users
  getAllUsers(): Promise<User[]>;
  getUser(id: string | number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<void>;
  upsertUser(user: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User>;

  // Accounts
  getAccountsByUserId(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, updates: Partial<Account>): Promise<void>;
  updateAccountBalance(id: number, balance: string): Promise<void>;
  deleteAccount(id: number): Promise<void>;

  // Envelopes
  getEnvelopesByUserId(userId: number): Promise<Envelope[]>;
  getEnvelope(id: number): Promise<Envelope | undefined>;
  createEnvelope(envelope: InsertEnvelope): Promise<Envelope>;
  updateEnvelope(id: number, updates: Partial<Envelope>): Promise<void>;
  updateEnvelopeBalance(id: number, balance: string): Promise<void>;
  updateEnvelopeCategory(id: number, categoryId: number | null, sortOrder: number): Promise<void>;
  deleteEnvelope(id: number): Promise<void>;

  // Envelope Categories
  getEnvelopeCategoriesByUserId(userId: number): Promise<EnvelopeCategory[]>;
  getEnvelopeCategory(id: number): Promise<EnvelopeCategory | undefined>;
  createEnvelopeCategory(category: InsertEnvelopeCategory): Promise<EnvelopeCategory>;
  updateEnvelopeCategory(id: number, updates: Partial<EnvelopeCategory>): Promise<void>;
  deleteEnvelopeCategory(id: number): Promise<void>;

  // Transactions
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getPendingTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<void>;
  approveTransaction(id: number): Promise<void>;
  deleteTransaction(id: number): Promise<void>;

  // Transaction Envelopes
  getTransactionEnvelopes(transactionId: number): Promise<TransactionEnvelope[]>;
  createTransactionEnvelope(transactionId: number, envelopeId: number, amount: string): Promise<void>;
  deleteTransactionEnvelopes(transactionId: number): Promise<void>;

  // Category Rules
  getCategoryRulesByUserId(userId: number): Promise<CategoryRule[]>;
  createCategoryRule(rule: InsertCategoryRule): Promise<CategoryRule>;
  deleteCategoryRule(id: number): Promise<void>;

  // Merchant Memory
  getMerchantMemoryByUserId(userId: number): Promise<MerchantMemory[]>;
  getMerchantSuggestion(userId: number, merchant: string): Promise<MerchantMemory | undefined>;
  upsertMerchantMemory(memory: InsertMerchantMemory): Promise<MerchantMemory>;

  // Bank Connections
  getBankConnectionsByUserId(userId: number): Promise<BankConnection[]>;
  getBankConnection(id: number): Promise<BankConnection | undefined>;
  createBankConnection(connection: InsertBankConnection): Promise<BankConnection>;
  updateBankConnection(id: number, updates: Partial<BankConnection>): Promise<void>;
  deleteBankConnection(id: number): Promise<void>;

  // Assets
  getAssetsByUserId(userId: number): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<Asset>): Promise<void>;
  deleteAsset(id: number): Promise<void>;

  // Liabilities
  getLiabilitiesByUserId(userId: number): Promise<Liability[]>;
  getLiability(id: number): Promise<Liability | undefined>;
  createLiability(liability: InsertLiability): Promise<Liability>;
  updateLiability(id: number, liability: Partial<Liability>): Promise<void>;
  deleteLiability(id: number): Promise<void>;

  // Net Worth Snapshots
  getNetWorthSnapshotsByUserId(userId: number): Promise<NetWorthSnapshot[]>;
  createNetWorthSnapshot(snapshot: InsertNetWorthSnapshot): Promise<NetWorthSnapshot>;

  // Recurring Transactions
  getRecurringTransactionsByUserId(userId: number): Promise<RecurringTransaction[]>;
  getRecurringTransaction(id: number): Promise<RecurringTransaction | undefined>;
  createRecurringTransaction(transaction: InsertRecurringTransaction): Promise<RecurringTransaction>;
  updateRecurringTransaction(id: number, transaction: Partial<RecurringTransaction>): Promise<void>;
  deleteRecurringTransaction(id: number): Promise<void>;

  // Two-Factor Authentication
  getUserTwoFactorInfo(userId: number): Promise<{ twoFactorEnabled?: boolean; twoFactorSecret?: string; backupCodes?: string[] } | undefined>;
  updateUserTwoFactor(userId: number, updates: { twoFactorEnabled?: boolean; twoFactorSecret?: string; backupCodes?: string[] }): Promise<void>;

  // Recurring Transaction Splits
  getRecurringTransactionSplits(recurringTransactionId: number): Promise<RecurringTransactionSplit[]>;
  createRecurringTransactionSplit(split: InsertRecurringTransactionSplit): Promise<RecurringTransactionSplit>;
  deleteRecurringTransactionSplits(recurringTransactionId: number): Promise<void>;

  // Bank Connections
  getBankConnectionsByUserId(userId: number): Promise<BankConnection[]>;
  getBankConnection(id: number): Promise<BankConnection | undefined>;
  createBankConnection(connection: InsertBankConnection): Promise<BankConnection>;
  updateBankConnection(id: number, connection: Partial<BankConnection>): Promise<void>;
  deleteBankConnection(id: number): Promise<void>;

  // Labels
  getLabelsByUserId(userId: number): Promise<Label[]>;
  getLabel(id: number): Promise<Label | undefined>;
  createLabel(label: InsertLabel): Promise<Label>;
  updateLabel(id: number, label: Partial<Label>): Promise<void>;
  deleteLabel(id: number): Promise<void>;

  // Transaction Labels
  getTransactionLabels(transactionId: number): Promise<TransactionLabel[]>;
  createTransactionLabel(transactionId: number, labelId: number): Promise<void>;
  deleteTransactionLabel(transactionId: number, labelId: number): Promise<void>;
  deleteAllTransactionLabels(transactionId: number): Promise<void>;

  // Envelope Types
  getEnvelopeTypesByUserId(userId: number): Promise<EnvelopeType[]>;
  getEnvelopeType(id: number): Promise<EnvelopeType | undefined>;
  createEnvelopeType(envelopeType: InsertEnvelopeType): Promise<EnvelopeType>;
  updateEnvelopeType(id: number, envelopeType: Partial<EnvelopeType>): Promise<void>;
  deleteEnvelopeType(id: number): Promise<void>;

  // Two-factor authentication methods
  updateUserTwoFactor(userId: number, updates: {
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    backupCodes?: string[];
    phoneNumber?: string;
    emailVerified?: boolean;
    email?: string;
  }): Promise<void>;
  getUserTwoFactorInfo(userId: number): Promise<{
    twoFactorEnabled: boolean;
    hasBackupCodes: boolean;
    backupCodesCount: number;
    phoneNumber?: string;
    email?: string;
    emailVerified: boolean;
  } | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private envelopes: Map<number, Envelope>;
  private envelopeCategories: Map<number, EnvelopeCategory>;
  private transactions: Map<number, Transaction>;
  private transactionEnvelopes: Map<number, TransactionEnvelope>;
  private categoryRules: Map<number, CategoryRule>;
  private merchantMemory: Map<number, MerchantMemory>;
  private assets: Map<number, Asset>;
  private liabilities: Map<number, Liability>;
  private netWorthSnapshots: Map<number, NetWorthSnapshot>;
  private recurringTransactions: Map<number, RecurringTransaction>;
  private recurringTransactionSplits: Map<number, RecurringTransactionSplit>;
  private bankConnections: Map<number, BankConnection>;
  private labels: Map<number, Label>;
  private transactionLabels: Map<number, TransactionLabel>;
  private envelopeTypes: Map<number, EnvelopeType>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.envelopes = new Map();
    this.envelopeCategories = new Map();
    this.transactions = new Map();
    this.transactionEnvelopes = new Map();
    this.categoryRules = new Map();
    this.merchantMemory = new Map();
    this.assets = new Map();
    this.liabilities = new Map();
    this.netWorthSnapshots = new Map();
    this.recurringTransactions = new Map();
    this.recurringTransactionSplits = new Map();
    this.bankConnections = new Map();
    this.labels = new Map();
    this.transactionLabels = new Map();
    this.envelopeTypes = new Map();
    this.currentId = 126;

    // Initialize with sample data for demo user
    this.initializeSampleData();
    this.initializeDemoLabels();
    this.initializeDefaultEnvelopeTypes();
  }

  private initializeDemoLabels() {
    const demoLabels = [
      { name: "Personal", colour: "#3b82f6" },
      { name: "Business", colour: "#10b981" },
      { name: "Urgent", colour: "#ef4444" },
      { name: "Subscription", colour: "#8b5cf6" },
      { name: "One-time", colour: "#f59e0b" },
      { name: "Recurring", colour: "#06b6d4" }
    ];

    demoLabels.forEach(labelData => {
      const id = ++this.currentId;
      const label: Label = {
        id,
        userId: 1,
        name: labelData.name,
        colour: labelData.colour
      };
      this.labels.set(id, label);
    });
  }

  private initializeDefaultEnvelopeTypes() {
    const defaultTypes = [
      { name: "Income", icon: "💼", color: "bg-emerald-100 text-emerald-800", isDefault: true, sortOrder: 1 },
      { name: "Essential", icon: "🏠", color: "bg-blue-100 text-blue-800", isDefault: true, sortOrder: 2 },
      { name: "Transport", icon: "🚗", color: "bg-orange-100 text-orange-800", isDefault: true, sortOrder: 3 },
      { name: "Food", icon: "🍽️", color: "bg-green-100 text-green-800", isDefault: true, sortOrder: 4 },
      { name: "Lifestyle", icon: "🎭", color: "bg-purple-100 text-purple-800", isDefault: true, sortOrder: 5 },
      { name: "Savings", icon: "💰", color: "bg-yellow-100 text-yellow-800", isDefault: true, sortOrder: 6 },
      { name: "Debt", icon: "💳", color: "bg-red-100 text-red-800", isDefault: true, sortOrder: 7 },
      { name: "Fun", icon: "🎉", color: "bg-pink-100 text-pink-800", isDefault: true, sortOrder: 8 }
    ];

    defaultTypes.forEach(typeData => {
      const id = ++this.currentId;
      const envelopeType: EnvelopeType = {
        id,
        userId: 1,
        name: typeData.name,
        icon: typeData.icon,
        color: typeData.color,
        isDefault: typeData.isDefault,
        sortOrder: typeData.sortOrder,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.envelopeTypes.set(id, envelopeType);
    });
  }

  private initializeSampleData() {
    // Create demo user
    const demoUser: User = { id: 1, username: "demo", password: "demo", payCycle: "fortnightly", budgetName: "Hoffman Household Budget" };
    this.users.set(1, demoUser);

    // Create demo accounts
    const checkingAccount: Account = {
      id: 1,
      userId: 1,
      name: "ASB Everyday Account",
      type: "checking",
      balance: "2450.32",
      isActive: true,
    };
    const savingsAccount: Account = {
      id: 2,
      userId: 1,
      name: "Savings Account",
      type: "savings",
      balance: "15230.50",
      isActive: true,
    };
    const creditCard: Account = {
      id: 3,
      userId: 1,
      name: "Credit Card",
      type: "credit",
      balance: "-1204.89",
      isActive: true,
    };

    this.accounts.set(1, checkingAccount);
    this.accounts.set(2, savingsAccount);
    this.accounts.set(3, creditCard);

    // Credit Card Holding Account - where money sits waiting for CC payment
    const ccHolding: Account = {
      id: 4,
      userId: 1,
      name: "Credit Card Holding",
      type: "checking",
      balance: "1200.00", // Money reserved for credit card payment
      isActive: true,
    };

    this.accounts.set(4, ccHolding);

    // Envelope categories based on user's list
    const categories: EnvelopeCategory[] = [
      {
        id: this.currentId++,
        userId: 1,
        name: "Income",
        icon: "💰",
        color: "#059669",
        sortOrder: 0,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Essential Expenses",
        icon: "🏠",
        color: "#dc2626",
        sortOrder: 1,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Lifestyle & Discretionary",
        icon: "🎬",
        color: "#7c3aed",
        sortOrder: 2,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Personal Care & Health",
        icon: "🏥",
        color: "#0891b2",
        sortOrder: 3,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Transportation & Travel",
        icon: "🚗",
        color: "#ea580c",
        sortOrder: 4,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Gifts & Special Occasions",
        icon: "🎁",
        color: "#db2777",
        sortOrder: 5,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Savings & Investments",
        icon: "📈",
        color: "#059669",
        sortOrder: 6,
        isCollapsed: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const category of categories) {
      this.envelopeCategories.set(category.id, category);
    }
    
    console.log(`Initialized ${categories.length} envelope categories`);

    // Complete envelope list from user's uploaded file
    const userEnvelopes = [
      // Income category
      { name: "Greg's Bonus", categoryId: categories[0].id, icon: "🎁", type: "income", annualAmount: 3000, payFrequencyAmount: 125.00, frequency: "monthly", openingBalance: 200.00 },
      { name: "Other Income", categoryId: categories[0].id, icon: "💰", type: "income", annualAmount: 1200, payFrequencyAmount: 50.00, frequency: "monthly", openingBalance: 0.00 },
      { name: "Reimbursements", categoryId: categories[0].id, icon: "💳", type: "income", annualAmount: 600, payFrequencyAmount: 25.00, frequency: "monthly", openingBalance: 0.00 },
      { name: "Surplus", categoryId: categories[0].id, icon: "📈", type: "income", annualAmount: 2400, payFrequencyAmount: 100.00, frequency: "monthly", openingBalance: 500.00 },
      { name: "IRD", categoryId: categories[0].id, icon: "🏦", type: "income", annualAmount: 0, payFrequencyAmount: 0.00, frequency: "annually", openingBalance: 0.00 },
      { name: "Investment Returns", categoryId: categories[0].id, icon: "📊", type: "income", annualAmount: 1800, payFrequencyAmount: 75.00, frequency: "monthly", openingBalance: 150.00 },
      
      // Essential Expenses
      { name: "Groceries", categoryId: categories[1].id, icon: "🛒", type: "expense", annualAmount: 9600, payFrequencyAmount: 400.00, frequency: "monthly", openingBalance: 250.00 },
      { name: "Rates", categoryId: categories[1].id, icon: "🏠", type: "expense", annualAmount: 3600, payFrequencyAmount: 150.00, frequency: "monthly", openingBalance: 800.00, targetAmount: 900.00, dueDate: new Date('2025-02-15') },
      { name: "Electricity", categoryId: categories[1].id, icon: "⚡", type: "expense", annualAmount: 2400, payFrequencyAmount: 100.00, frequency: "monthly", openingBalance: 45.00, targetAmount: 250.00, dueDate: new Date('2025-01-20') },
      { name: "Water Usage", categoryId: categories[1].id, icon: "💧", type: "expense", annualAmount: 1200, payFrequencyAmount: 50.00, frequency: "monthly", openingBalance: 25.00 },
      { name: "Vodafone Internet", categoryId: categories[1].id, icon: "🌐", type: "expense", annualAmount: 960, payFrequencyAmount: 40.00, frequency: "monthly", openingBalance: 0.00, targetAmount: 80.00, dueDate: new Date('2025-01-10') },
      { name: "Vodafone Deb's Cellphone", categoryId: categories[1].id, icon: "📱", type: "expense", annualAmount: 720, payFrequencyAmount: 30.00, frequency: "monthly", openingBalance: 15.00 },
      
      // Lifestyle & Discretionary
      { name: "Spending", categoryId: categories[2].id, icon: "🛍️", type: "expense", annualAmount: 3600, payFrequencyAmount: 150.00, frequency: "monthly", openingBalance: 75.00 },
      { name: "Restaurants & Cafes", categoryId: categories[2].id, icon: "🍽️", type: "expense", annualAmount: 2400, payFrequencyAmount: 100.00, frequency: "monthly", openingBalance: 50.00 },
      { name: "Spending Deb", categoryId: categories[2].id, icon: "👩", type: "expense", annualAmount: 1800, payFrequencyAmount: 75.00, frequency: "monthly", openingBalance: 125.00 },
      { name: "Spending Greg", categoryId: categories[2].id, icon: "👨", type: "expense", annualAmount: 1800, payFrequencyAmount: 75.00, frequency: "monthly", openingBalance: 80.00 },
      { name: "Spending Splurge", categoryId: categories[2].id, icon: "💸", type: "expense", annualAmount: 1200, payFrequencyAmount: 50.00, frequency: "monthly", openingBalance: 0.00 },
      { name: "Clothing", categoryId: categories[2].id, icon: "👕", type: "expense", annualAmount: 1800, payFrequencyAmount: 75.00, frequency: "monthly", openingBalance: 200.00 },
      { name: "Clothing Abby", categoryId: categories[2].id, icon: "👧" },
      { name: "Clothing Amara", categoryId: categories[2].id, icon: "👧" },
      { name: "Clothing Deb", categoryId: categories[2].id, icon: "👩" },
      { name: "Clothing Greg", categoryId: categories[2].id, icon: "👨" },
      { name: "Hobbies", categoryId: categories[2].id, icon: "🎨" },
      { name: "Sport", categoryId: categories[2].id, icon: "⚽" },
      { name: "Netflix", categoryId: categories[2].id, icon: "📺", type: "expense", annualAmount: 240, payFrequencyAmount: 10.00, frequency: "monthly", openingBalance: 20.00 },
      { name: "Sky TV", categoryId: categories[2].id, icon: "📺", type: "expense", annualAmount: 600, payFrequencyAmount: 25.00, frequency: "monthly", openingBalance: 0.00, targetAmount: 50.00, dueDate: new Date('2025-01-25') },
      { name: "Spotify", categoryId: categories[2].id, icon: "🎵", type: "expense", annualAmount: 180, payFrequencyAmount: 7.50, frequency: "monthly", openingBalance: 15.00 },
      { name: "Apple Storage", categoryId: categories[2].id, icon: "☁️", type: "expense", annualAmount: 60, payFrequencyAmount: 2.50, frequency: "monthly", openingBalance: 5.00 },
      { name: "Chat GPT", categoryId: categories[2].id, icon: "🤖", type: "expense", annualAmount: 240, payFrequencyAmount: 10.00, frequency: "monthly", openingBalance: 0.00 },
      { name: "Money Management Software", categoryId: categories[2].id, icon: "💻", type: "expense", annualAmount: 120, payFrequencyAmount: 5.00, frequency: "monthly", openingBalance: 25.00 },
      
      // Gifts & Special Occasions
      { name: "Gifts", categoryId: categories[2].id, icon: "🎁" },
      { name: "Birthday", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Abby", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Amara", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Greg", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Deb", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Parents", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Nieces & Nephews", categoryId: categories[2].id, icon: "🎂" },
      { name: "Birthday Friends", categoryId: categories[2].id, icon: "🎂" },
      { name: "Mothers & Fathers Day G & D", categoryId: categories[2].id, icon: "💐" },
      { name: "Mothers & Fathers Day Parents", categoryId: categories[2].id, icon: "💐" },
      { name: "Easter", categoryId: categories[2].id, icon: "🐰" },
      { name: "Christmas", categoryId: categories[2].id, icon: "🎄", type: "expense", annualAmount: 1500, payFrequencyAmount: 62.50, frequency: "monthly", openingBalance: 100.00 },
      { name: "Christmas Abby", categoryId: categories[2].id, icon: "🎄", type: "expense", annualAmount: 300, payFrequencyAmount: 12.50, frequency: "monthly", openingBalance: 50.00 },
      { name: "Christmas Amara", categoryId: categories[2].id, icon: "🎄" },
      { name: "Christmas Greg", categoryId: categories[2].id, icon: "🎄" },
      { name: "Christmas Deb", categoryId: categories[2].id, icon: "🎄" },
      { name: "Christmas Parents", categoryId: categories[2].id, icon: "🎄" },
      { name: "Christmas Nieces & Nephews", categoryId: categories[2].id, icon: "🎄" },
      { name: "Christmas Friends", categoryId: categories[2].id, icon: "🎄" },
      
      // Savings & Financial Goals
      { name: "Savings", categoryId: categories[2].id, icon: "💰" },
      { name: "Holiday Savings", categoryId: categories[2].id, icon: "🏖️" },
      { name: "Family Hanmer Holiday Fund", categoryId: categories[2].id, icon: "🏕️" },
      { name: "Giving", categoryId: categories[2].id, icon: "❤️" },
      { name: "Investment", categoryId: categories[2].id, icon: "📈" },
      { name: "Loans", categoryId: categories[2].id, icon: "🏦" },
      
      // Personal Care & Health
      { name: "Health", categoryId: categories[3].id, icon: "🏥" },
      { name: "Breastcare Cant.", categoryId: categories[3].id, icon: "🏥" },
      { name: "Dentist", categoryId: categories[3].id, icon: "🦷" },
      { name: "Doctors", categoryId: categories[3].id, icon: "👨‍⚕️" },
      { name: "Oxford Women's Health", categoryId: categories[3].id, icon: "👩‍⚕️" },
      { name: "Physio & Chriopractor", categoryId: categories[3].id, icon: "🏥" },
      { name: "Pharmacy/Medications", categoryId: categories[3].id, icon: "💊" },
      { name: "Hair", categoryId: categories[3].id, icon: "💇" },
      { name: "Hair Deb", categoryId: categories[3].id, icon: "💇‍♀️" },
      { name: "Hair Girls", categoryId: categories[3].id, icon: "💇‍♀️" },
      { name: "Hair Greg", categoryId: categories[3].id, icon: "💇‍♂️" },
      { name: "Eyebrows Deb", categoryId: categories[3].id, icon: "👁️" },
      
      // Household Fixed Costs
      { name: "Household Fixed", categoryId: categories[1].id, icon: "🏠" },
      { name: "Abby & Amara Pocket Money", categoryId: categories[1].id, icon: "💰" },
      { name: "Credit Card Fee", categoryId: categories[1].id, icon: "💳" },
      
      // Household Variables
      { name: "Household Variables", categoryId: categories[1].id, icon: "🔧" },
      { name: "Chico", categoryId: categories[1].id, icon: "🐕" },
      { name: "Drycleaning", categoryId: categories[1].id, icon: "👔" },
      { name: "Parking", categoryId: categories[1].id, icon: "🅿️" },
      { name: "Pool & Spa", categoryId: categories[1].id, icon: "🏊" },
      
      // Insurance
      { name: "Car", categoryId: categories[1].id, icon: "🚗" },
      { name: "Caravan", categoryId: categories[1].id, icon: "🚐" },
      { name: "Contents", categoryId: categories[1].id, icon: "🏠" },
      { name: "House", categoryId: categories[1].id, icon: "🏠" },
      { name: "Pet", categoryId: categories[1].id, icon: "🐕" },
      { name: "Life & Mortgage Protection", categoryId: categories[1].id, icon: "🛡️" },
      
      // School
      { name: "School", categoryId: categories[1].id, icon: "🏫" },
      { name: "Activities", categoryId: categories[1].id, icon: "⚽" },
      { name: "Donations", categoryId: categories[1].id, icon: "💝" },
      { name: "Fees", categoryId: categories[1].id, icon: "💰" },
      { name: "Photos", categoryId: categories[1].id, icon: "📸" },
      { name: "Stationery", categoryId: categories[1].id, icon: "✏️" },
      { name: "Uniform", categoryId: categories[1].id, icon: "👕" },
      
      // Transportation & Travel
      { name: "Petrol", categoryId: categories[4].id, icon: "⛽", type: "expense", annualAmount: 3600, payFrequencyAmount: 150.00, frequency: "monthly", openingBalance: 85.00 },
      { name: "Vehicle", categoryId: categories[4].id, icon: "🚗", type: "expense", annualAmount: 2400, payFrequencyAmount: 100.00, frequency: "monthly", openingBalance: 320.00 },
      { name: "Car Rego", categoryId: categories[4].id, icon: "📋", type: "expense", annualAmount: 480, payFrequencyAmount: 20.00, frequency: "monthly", openingBalance: 150.00, targetAmount: 240.00, dueDate: new Date('2025-08-15') },
      { name: "Caravan Rego", categoryId: categories[4].id, icon: "📋", type: "expense", annualAmount: 300, payFrequencyAmount: 12.50, frequency: "monthly", openingBalance: 0.00, targetAmount: 150.00, dueDate: new Date('2025-11-01') },
      { name: "Maintenance", categoryId: categories[4].id, icon: "🔧", type: "expense", annualAmount: 1800, payFrequencyAmount: 75.00, frequency: "monthly", openingBalance: 45.00 },
      { name: "WOF", categoryId: categories[4].id, icon: "✅", type: "expense", annualAmount: 120, payFrequencyAmount: 5.00, frequency: "monthly", openingBalance: 25.00, targetAmount: 60.00, dueDate: new Date('2025-04-20') },
    ];

    userEnvelopes.forEach((env, index) => {
      // Use demo data if provided, otherwise use defaults
      let currentBalance = env.openingBalance ? env.openingBalance.toFixed(2) : "0.00";
      let budgetedAmount = env.payFrequencyAmount ? env.payFrequencyAmount.toFixed(2) : "0.00";
      let frequency = env.frequency || "monthly";
      let nextPaymentDue = env.dueDate || null;
      let annualAmount = env.annualAmount ? env.annualAmount.toString() : "0";
      let targetAmount = env.targetAmount ? env.targetAmount.toString() : null;
      let envelopeType = env.type || "expense";

      const envelope: Envelope = {
        id: this.currentId++,
        userId: 1,
        name: env.name,
        icon: env.icon,
        budgetedAmount,
        currentBalance,
        openingBalance: currentBalance, // Use the calculated opening balance
        budgetFrequency: frequency,
        nextPaymentDue: nextPaymentDue,
        isSpendingAccount: false,
        isMonitored: env.name === "Groceries" || env.name === "Spending Deb", // Monitor these by default
        parentId: null,
        categoryId: env.categoryId,
        sortOrder: index,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        annualAmount: annualAmount,
        payCycleAmount: budgetedAmount,
        notes: null,
        envelopeType: envelopeType,
        targetAmount: targetAmount
      };
      this.envelopes.set(envelope.id, envelope);
    });

    // Find envelope IDs for merchants that need them
    const spendingDebEnvelope = Array.from(this.envelopes.values()).find(env => env.name === "Spending Deb");
    const phoneEnvelope = Array.from(this.envelopes.values()).find(env => env.name.includes("Phone") || env.name.includes("Mobile"));
    const entertainmentEnvelope = Array.from(this.envelopes.values()).find(env => env.name.includes("Entertainment") || env.name.includes("Streaming"));
    const clothingEnvelope = Array.from(this.envelopes.values()).find(env => env.name.includes("Clothing"));
    const groceriesEnvelope = Array.from(this.envelopes.values()).find(env => env.name === "Groceries");
    const petrolEnvelope = Array.from(this.envelopes.values()).find(env => env.name === "Petrol");
    const gregsBonusEnvelope = Array.from(this.envelopes.values()).find(env => env.name === "Greg's Bonus");

    // Add sample merchant memories
    const merchantMemories = [
      { merchant: "Pak'nSave", envelopeId: groceriesEnvelope?.id }, // Groceries (for test)
      { merchant: "Countdown", envelopeId: groceriesEnvelope?.id }, // Groceries
      { merchant: "New World", envelopeId: groceriesEnvelope?.id }, // Groceries
      { merchant: "BP", envelopeId: petrolEnvelope?.id }, // Petrol
      { merchant: "The Warehouse", envelopeId: null }, // Will find Spending Deb
      { merchant: "Bunnings", envelopeId: null }, // Will find Spending Deb
      { merchant: "Spark", envelopeId: null }, // Will find Phone
      { merchant: "Netflix", envelopeId: null }, // Will find Entertainment
      { merchant: "Farmers", envelopeId: null }, // Will find Clothing
    ];

    merchantMemories.forEach((mem, index) => {
      let envelopeId = mem.envelopeId;
      
      // Assign envelope IDs for merchants that need them
      if (mem.merchant === "The Warehouse" || mem.merchant === "Bunnings") {
        envelopeId = spendingDebEnvelope?.id || null;
      } else if (mem.merchant === "Spark") {
        envelopeId = phoneEnvelope?.id || null;
      } else if (mem.merchant === "Netflix") {
        envelopeId = entertainmentEnvelope?.id || null;
      } else if (mem.merchant === "Farmers") {
        envelopeId = clothingEnvelope?.id || null;
      }

      if (envelopeId) {
        const memory: MerchantMemory = {
          id: this.currentId++,
          userId: 1,
          merchant: mem.merchant,
          lastEnvelopeId: envelopeId,
          frequency: 1,
          lastUsed: new Date(),
        };
        this.merchantMemory.set(memory.id, memory);
      }
    });

    // Add sample transactions
    const today = new Date();
    const sampleTransactions = [
      // Test transactions for quick approve functionality (pending)
      { 
        merchant: "Pak'nSave", 
        description: "Grocery shopping", 
        amount: "-85.40", 
        accountId: 1, 
        envelopeId: groceriesEnvelope?.id || null,
        date: new Date(today.getTime() - 0.5 * 24 * 60 * 60 * 1000),
        isApproved: false
      },
      { 
        merchant: "BP", 
        description: "Fuel fill-up", 
        amount: "-72.15", 
        accountId: 1, 
        envelopeId: petrolEnvelope?.id || null,
        date: new Date(today.getTime() - 0.3 * 24 * 60 * 60 * 1000),
        isApproved: false
      },
      // Groceries transactions
      { 
        merchant: "Countdown", 
        description: "Weekly grocery shop", 
        amount: "-127.50", 
        accountId: 1, 
        envelopeId: groceriesEnvelope?.id || null, // Groceries
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000) 
      },
      { 
        merchant: "New World", 
        description: "Fresh produce", 
        amount: "-45.80", 
        accountId: 1, 
        envelopeId: groceriesEnvelope?.id || null, // Groceries
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000) 
      },
      // Deb Spending transactions
      { 
        merchant: "The Warehouse", 
        description: "Household items", 
        amount: "-32.90", 
        accountId: 1, 
        envelopeId: spendingDebEnvelope?.id || null,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000) 
      },
      { 
        merchant: "Bunnings", 
        description: "Garden supplies", 
        amount: "-68.45", 
        accountId: 1, 
        envelopeId: spendingDebEnvelope?.id || null,
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) 
      },
      // Other envelope transactions
      { 
        merchant: "BP", 
        description: "Fuel", 
        amount: "-89.20", 
        accountId: 1, 
        envelopeId: petrolEnvelope?.id || null, // Petrol
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000) 
      },
      { 
        merchant: "Spark", 
        description: "Mobile phone bill", 
        amount: "-45.00", 
        accountId: 1, 
        envelopeId: phoneEnvelope?.id || null,
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000) 
      },
      { 
        merchant: "Netflix", 
        description: "Monthly subscription", 
        amount: "-19.99", 
        accountId: 1, 
        envelopeId: entertainmentEnvelope?.id || null,
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) 
      },
      { 
        merchant: "Kiwibank", 
        description: "Account fee", 
        amount: "-5.00", 
        accountId: 1, 
        envelopeId: null, // Bank fees
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
        isApproved: false // Make this unmatched instead of approved
      },
      { 
        merchant: "Farmers", 
        description: "Clothing purchase", 
        amount: "-156.75", 
        accountId: 1, 
        envelopeId: clothingEnvelope?.id || null,
        date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000) 
      },
      { 
        merchant: "McDonald's", 
        description: "Lunch", 
        amount: "-12.50", 
        accountId: 1, 
        envelopeId: null, // Dining out
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        isApproved: false // Make this unmatched instead of approved
      },
      // Income transactions for Greg's Bonus
      { 
        merchant: "ABC Company", 
        description: "Quarterly bonus payment", 
        amount: "750.00", 
        accountId: 1, 
        envelopeId: gregsBonusEnvelope?.id || null,
        date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
      },
      { 
        merchant: "ABC Company", 
        description: "Project completion bonus", 
        amount: "500.00", 
        accountId: 1, 
        envelopeId: gregsBonusEnvelope?.id || null,
        date: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000)
      },
      { 
        merchant: "ABC Company", 
        description: "Annual performance bonus", 
        amount: "1200.00", 
        accountId: 1, 
        envelopeId: gregsBonusEnvelope?.id || null,
        date: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
      },
    ];

    sampleTransactions.forEach((txnData, index) => {
      const transaction: Transaction = {
        id: this.currentId++,
        userId: 1,
        accountId: txnData.accountId,
        merchant: txnData.merchant,
        description: txnData.description,
        amount: txnData.amount,
        date: txnData.date,
        receiptPath: null,
        isApproved: txnData.isApproved !== undefined ? txnData.isApproved : true, // Use specified approval status or default to true
        isTransfer: false,
        transferToAccountId: null,
        sourceType: "manual",
        duplicateStatus: "none",
        bankTransactionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.transactions.set(transaction.id, transaction);

      // Create transaction-envelope relationships
      if (txnData.envelopeId) {
        const transactionEnvelope: TransactionEnvelope = {
          id: this.currentId++,
          transactionId: transaction.id,
          envelopeId: txnData.envelopeId,
          amount: txnData.amount,
        };
        this.transactionEnvelopes.set(transactionEnvelope.id, transactionEnvelope);

        // Update envelope balance
        const envelope = this.envelopes.get(txnData.envelopeId);
        if (envelope) {
          const currentBalance = parseFloat(envelope.currentBalance);
          const transactionAmount = parseFloat(txnData.amount);
          const newBalance = currentBalance + transactionAmount; // Amount is negative for expenses
          envelope.currentBalance = newBalance.toFixed(2);
          envelope.updatedAt = new Date();
        }
      }
    });

    // Add unmatched bank sync transactions for demonstration
    const unmatchedTransactions = [
      {
        id: this.currentId++,
        userId: 1,
        accountId: 1,
        merchant: "Uber Eats",
        description: "Food delivery",
        amount: "28.50",
        date: new Date("2024-12-22"),
        isApproved: false,
        isTransfer: false,
        transferToAccountId: null,
        receiptUrl: null,
        sourceType: "bank_sync",
        duplicateStatus: "none",
        bankTransactionId: "bank_uber_001",
        receiptPath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        accountId: 1,
        merchant: "Mitre 10",
        description: "Hardware store",
        amount: "156.80",
        date: new Date("2024-12-21"),
        isApproved: false,
        isTransfer: false,
        transferToAccountId: null,
        receiptUrl: null,
        sourceType: "bank_sync",
        duplicateStatus: "none",
        bankTransactionId: "bank_mitre10_001",
        receiptPath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        accountId: 1,
        merchant: "Westfield Shopping Centre",
        description: "Parking fee",
        amount: "4.00",
        date: new Date("2024-12-20"),
        isApproved: false,
        isTransfer: false,
        transferToAccountId: null,
        receiptUrl: null,
        sourceType: "bank_sync",
        duplicateStatus: "none",
        bankTransactionId: "bank_westfield_001",
        receiptPath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        accountId: 1,
        merchant: "Chemist Warehouse",
        description: "Pharmacy",
        amount: "67.95",
        date: new Date("2024-12-19"),
        isApproved: false,
        isTransfer: false,
        transferToAccountId: null,
        receiptUrl: null,
        sourceType: "bank_sync",
        duplicateStatus: "none",
        bankTransactionId: "bank_chemist_001",
        receiptPath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.currentId++,
        userId: 1,
        accountId: 1,
        merchant: "Coffee Supreme",
        description: "Coffee",
        amount: "6.50",
        date: new Date("2024-12-18"),
        isApproved: false,
        isTransfer: false,
        transferToAccountId: null,
        receiptUrl: null,
        sourceType: "bank_sync",
        duplicateStatus: "none",
        bankTransactionId: "bank_coffee_001",
        receiptPath: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    unmatchedTransactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });

    this.initializeDebtDemoData();
    this.currentId = 300; // Set higher to avoid conflicts
  }

  private initializeDebtDemoData() {
    // Add realistic debt liabilities for New Zealand
    const debtLiabilities = [
      {
        id: this.currentId++,
        userId: 1,
        name: "ANZ Credit Card",
        liabilityType: "credit_card",
        currentBalance: "4850.75",
        interestRate: "19.95",
        minimumPayment: "145.00",
        notes: "Main credit card for everyday purchases"
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Westpac Personal Loan",
        liabilityType: "personal_loan",
        currentBalance: "12750.00",
        interestRate: "12.95",
        minimumPayment: "385.00",
        notes: "Car purchase loan, 3 years remaining"
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Student Loan (StudyLink)",
        liabilityType: "student_loan",
        currentBalance: "28500.00",
        interestRate: "0.00",
        minimumPayment: "0.00",
        notes: "Interest-free while living in NZ"
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Store Card - Harvey Norman",
        liabilityType: "credit_card",
        currentBalance: "1245.50",
        interestRate: "27.95",
        minimumPayment: "50.00",
        notes: "Furniture purchase, high interest rate"
      }
    ];

    for (const liability of debtLiabilities) {
      this.liabilities.set(liability.id, liability);
    }

    // Add debt payment envelopes
    const debtEnvelopes = [
      {
        id: this.currentId++,
        userId: 1,
        name: "Credit Card Payment",
        icon: "💳",
        budgetedAmount: "200.00",
        currentBalance: "200.00",
        categoryId: null,
        sortOrder: 1000,
        isActive: true,
        isMonitored: true,
        paymentSchedule: "monthly",
        nextPaymentDue: new Date(2025, 6, 15).toISOString(),
        isSpendingAccount: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Personal Loan Payment",
        icon: "🏦",
        budgetedAmount: "385.00",
        currentBalance: "385.00",
        categoryId: null,
        sortOrder: 1001,
        isActive: true,
        isMonitored: true,
        paymentSchedule: "monthly",
        nextPaymentDue: new Date(2025, 6, 20).toISOString(),
        isSpendingAccount: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.currentId++,
        userId: 1,
        name: "Extra Debt Payment",
        icon: "⚡",
        budgetedAmount: "150.00",
        currentBalance: "150.00",
        categoryId: null,
        sortOrder: 1002,
        isActive: true,
        isMonitored: false,
        paymentSchedule: "monthly",
        nextPaymentDue: new Date(2025, 6, 25).toISOString(),
        isSpendingAccount: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const envelope of debtEnvelopes) {
      this.envelopes.set(envelope.id, envelope);
    }

    console.log(`Initialized ${debtLiabilities.length} debt liabilities and ${debtEnvelopes.length} debt payment envelopes`);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string | number): Promise<User | undefined> {
    if (typeof id === 'string') {
      // Search by Replit ID
      return Array.from(this.users.values()).find(u => u.replitId === id);
    } else {
      // Search by internal numeric ID
      return this.users.get(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...updates });
    }
  }

  async upsertUser(userData: { id: string; email?: string; firstName?: string; lastName?: string; profileImageUrl?: string }): Promise<User> {
    // Find existing user by Replit ID (stored as string in userData.id)
    const existingUser = Array.from(this.users.values()).find(u => u.replitId === userData.id);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        email: userData.email || existingUser.email,
        firstName: userData.firstName || existingUser.firstName,
        lastName: userData.lastName || existingUser.lastName,
        profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const id = this.currentId++;
      const newUser: User = {
        id,
        username: userData.email || `user_${userData.id}`,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        replitId: userData.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: null, // Replit Auth doesn't use passwords
        budgetName: "My Budget",
        payCycle: "fortnightly",
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
        phoneNumber: null,
        emailVerified: false,
      };
      this.users.set(id, newUser);
      return newUser;
    }
  }

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(account => account.userId === userId);
  }

  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.currentId++;
    const account: Account = { 
      ...insertAccount, 
      id,
      balance: insertAccount.balance || "0",
      isActive: insertAccount.isActive ?? true
    };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccount(id: number, updates: Partial<Account>): Promise<void> {
    const account = this.accounts.get(id);
    if (account) {
      Object.assign(account, updates);
      this.accounts.set(id, account);
    }
  }

  async updateAccountBalance(id: number, balance: string): Promise<void> {
    const account = this.accounts.get(id);
    if (account) {
      account.balance = balance;
      this.accounts.set(id, account);
    }
  }

  async deleteAccount(id: number): Promise<void> {
    this.accounts.delete(id);
  }

  async getEnvelopesByUserId(userId: number): Promise<Envelope[]> {
    return Array.from(this.envelopes.values())
      .filter(envelope => envelope.userId === userId && envelope.isActive)
      .sort((a, b) => {
        // Sort by category first, then by sort order within category
        const aCategoryOrder = a.categoryId || 999;
        const bCategoryOrder = b.categoryId || 999;
        if (aCategoryOrder !== bCategoryOrder) {
          return aCategoryOrder - bCategoryOrder;
        }
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      });
  }

  async getEnvelope(id: number): Promise<Envelope | undefined> {
    return this.envelopes.get(id);
  }

  async createEnvelope(insertEnvelope: InsertEnvelope): Promise<Envelope> {
    const id = this.currentId++;
    const envelope: Envelope = { 
      ...insertEnvelope, 
      id, 
      currentBalance: insertEnvelope.currentBalance || "0",
      openingBalance: insertEnvelope.openingBalance || "0.00",
      budgetFrequency: insertEnvelope.budgetFrequency || "monthly",
      nextPaymentDue: insertEnvelope.nextPaymentDue || null,
      isSpendingAccount: insertEnvelope.isSpendingAccount || false,
      isMonitored: insertEnvelope.isMonitored || false,
      isActive: insertEnvelope.isActive ?? true,
      icon: insertEnvelope.icon || "📁",
      parentId: insertEnvelope.parentId || null,
      categoryId: insertEnvelope.categoryId || null,
      sortOrder: insertEnvelope.sortOrder || 0,
      budgetedAmount: insertEnvelope.budgetedAmount || "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.envelopes.set(id, envelope);
    return envelope;
  }

  async updateEnvelope(id: number, updates: Partial<Envelope>): Promise<void> {
    const envelope = this.envelopes.get(id);
    if (envelope) {
      Object.assign(envelope, updates, { updatedAt: new Date() });
    }
  }

  async updateEnvelopeBalance(id: number, balance: string): Promise<void> {
    const envelope = this.envelopes.get(id);
    if (envelope) {
      envelope.currentBalance = balance;
      envelope.updatedAt = new Date();
      this.envelopes.set(id, envelope);
    }
  }

  async updateEnvelopeCategory(id: number, categoryId: number | null, sortOrder: number): Promise<void> {
    const envelope = this.envelopes.get(id);
    if (envelope) {
      envelope.categoryId = categoryId;
      envelope.sortOrder = sortOrder;
      envelope.updatedAt = new Date();
      this.envelopes.set(id, envelope);
    }
  }

  async deleteEnvelope(id: number): Promise<void> {
    this.envelopes.delete(id);
  }

  // Envelope Categories
  async getEnvelopeCategoriesByUserId(userId: number): Promise<EnvelopeCategory[]> {
    const allCategories = Array.from(this.envelopeCategories.values());
    console.log(`Found ${allCategories.length} total categories in storage`);
    
    const userCategories = allCategories
      .filter(category => category.userId === userId && category.isActive)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    console.log(`Returning ${userCategories.length} categories for user ${userId}`);
    return userCategories;
  }

  async getEnvelopeCategory(id: number): Promise<EnvelopeCategory | undefined> {
    return this.envelopeCategories.get(id);
  }

  async createEnvelopeCategory(insertCategory: InsertEnvelopeCategory): Promise<EnvelopeCategory> {
    const id = this.currentId++;
    const category: EnvelopeCategory = { 
      ...insertCategory, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.envelopeCategories.set(id, category);
    return category;
  }

  async updateEnvelopeCategory(id: number, updates: Partial<EnvelopeCategory>): Promise<void> {
    const category = this.envelopeCategories.get(id);
    if (category) {
      Object.assign(category, updates, { updatedAt: new Date() });
      this.envelopeCategories.set(id, category);
    }
  }

  async deleteEnvelopeCategory(id: number): Promise<void> {
    const category = this.envelopeCategories.get(id);
    if (category) {
      category.isActive = false;
      category.updatedAt = new Date();
      this.envelopeCategories.set(id, category);
      
      // Move envelopes in this category to uncategorized
      Array.from(this.envelopes.values()).forEach(envelope => {
        if (envelope.categoryId === id) {
          envelope.categoryId = null;
          envelope.updatedAt = new Date();
          this.envelopes.set(envelope.id, envelope);
        }
      });
    }
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const allTransactions = Array.from(this.transactions.values());
    console.log(`Total transactions in storage: ${allTransactions.length}`);
    console.log(`Unapproved transactions: ${allTransactions.filter(t => !t.isApproved).length}`);
    
    const userTransactions = allTransactions.filter(transaction => transaction.userId === userId);
    console.log(`User ${userId} transactions: ${userTransactions.length}`);
    console.log(`User ${userId} unapproved: ${userTransactions.filter(t => !t.isApproved).length}`);
    
    // Populate transaction envelopes for each transaction
    const transactionsWithEnvelopes = userTransactions.map(transaction => {
      const transactionEnvelopes = Array.from(this.transactionEnvelopes.values())
        .filter(te => te.transactionId === transaction.id)
        .map(te => {
          const envelope = this.envelopes.get(te.envelopeId);
          return {
            ...te,
            envelopeName: envelope?.name || 'Unknown Envelope'
          };
        });
      
      return {
        ...transaction,
        transactionEnvelopes
      };
    });
    
    return transactionsWithEnvelopes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getPendingTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId && !transaction.isApproved)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      isApproved: false,
      isTransfer: insertTransaction.isTransfer || false,
      transferToAccountId: insertTransaction.transferToAccountId || null,
      receiptUrl: insertTransaction.receiptUrl || null,
      description: insertTransaction.description || null,
    };
    this.transactions.set(id, transaction);

    // Create transaction envelope mappings if provided
    if (insertTransaction.envelopes) {
      for (const envAllocation of insertTransaction.envelopes) {
        await this.createTransactionEnvelope(id, envAllocation.envelopeId, envAllocation.amount);
      }
    }

    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<void> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      Object.assign(transaction, updates);
      this.transactions.set(id, transaction);
    }
  }

  async approveTransaction(id: number): Promise<void> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.isApproved = true;
      this.transactions.set(id, transaction);

      // Update envelope balances
      const transactionEnvelopes = await this.getTransactionEnvelopes(id);
      for (const te of transactionEnvelopes) {
        const envelope = this.envelopes.get(te.envelopeId);
        if (envelope) {
          const currentBalance = parseFloat(envelope.currentBalance);
          const transactionAmount = parseFloat(te.amount);
          const newBalance = currentBalance + transactionAmount;
          await this.updateEnvelopeBalance(te.envelopeId, newBalance.toFixed(2));
        }
      }

      // Update account balance
      const account = this.accounts.get(transaction.accountId);
      if (account) {
        const currentBalance = parseFloat(account.balance);
        const transactionAmount = parseFloat(transaction.amount);
        const newBalance = currentBalance + transactionAmount;
        await this.updateAccountBalance(transaction.accountId, newBalance.toFixed(2));
      }
    }
  }

  async deleteTransaction(id: number): Promise<void> {
    this.transactions.delete(id);
    // Also delete associated transaction envelopes
    Array.from(this.transactionEnvelopes.entries()).forEach(([key, te]) => {
      if (te.transactionId === id) {
        this.transactionEnvelopes.delete(key);
      }
    });
  }

  async getTransactionEnvelopes(transactionId: number): Promise<TransactionEnvelope[]> {
    return Array.from(this.transactionEnvelopes.values())
      .filter(te => te.transactionId === transactionId);
  }

  async createTransactionEnvelope(transactionId: number, envelopeId: number, amount: string): Promise<void> {
    const id = this.currentId++;
    const transactionEnvelope: TransactionEnvelope = {
      id,
      transactionId,
      envelopeId,
      amount,
    };
    this.transactionEnvelopes.set(id, transactionEnvelope);
  }

  async deleteTransactionEnvelopes(transactionId: number): Promise<void> {
    const envelopesToDelete = Array.from(this.transactionEnvelopes.values())
      .filter(te => te.transactionId === transactionId);
    
    for (const envelope of envelopesToDelete) {
      this.transactionEnvelopes.delete(envelope.id);
    }
  }

  async getCategoryRulesByUserId(userId: number): Promise<CategoryRule[]> {
    return Array.from(this.categoryRules.values()).filter(rule => rule.userId === userId);
  }

  async createCategoryRule(insertRule: InsertCategoryRule): Promise<CategoryRule> {
    const id = this.currentId++;
    const rule: CategoryRule = { 
      ...insertRule, 
      id,
      isActive: insertRule.isActive ?? true
    };
    this.categoryRules.set(id, rule);
    return rule;
  }

  async deleteCategoryRule(id: number): Promise<void> {
    this.categoryRules.delete(id);
  }

  async getMerchantMemoryByUserId(userId: number): Promise<MerchantMemory[]> {
    return Array.from(this.merchantMemory.values()).filter(memory => memory.userId === userId);
  }

  async getMerchantSuggestion(userId: number, merchant: string): Promise<MerchantMemory | undefined> {
    const cleanMerchant = merchant.toLowerCase().trim();
    return Array.from(this.merchantMemory.values())
      .filter(memory => memory.userId === userId)
      .find(memory => memory.merchant.toLowerCase().includes(cleanMerchant) || cleanMerchant.includes(memory.merchant.toLowerCase()));
  }

  async upsertMerchantMemory(insertMemory: InsertMerchantMemory): Promise<MerchantMemory> {
    // Check if merchant already exists for this user
    const existing = Array.from(this.merchantMemory.values())
      .find(memory => memory.userId === insertMemory.userId && 
                      memory.merchant.toLowerCase() === insertMemory.merchant.toLowerCase());

    if (existing) {
      // Update existing
      existing.lastEnvelopeId = insertMemory.lastEnvelopeId;
      existing.frequency += 1;
      existing.lastUsed = insertMemory.lastUsed;
      this.merchantMemory.set(existing.id, existing);
      return existing;
    } else {
      // Create new
      const id = this.currentId++;
      const memory: MerchantMemory = { 
        ...insertMemory, 
        id,
        frequency: insertMemory.frequency || 1
      };
      this.merchantMemory.set(id, memory);
      return memory;
    }
  }

  // Labels methods
  async getLabelsByUserId(userId: number): Promise<Label[]> {
    return Array.from(this.labels.values())
      .filter(label => label.userId === userId)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getLabel(id: number): Promise<Label | undefined> {
    return this.labels.get(id);
  }

  async createLabel(insertLabel: InsertLabel): Promise<Label> {
    const id = ++this.currentId;
    const label: Label = { ...insertLabel, id };
    this.labels.set(id, label);
    return label;
  }

  async updateLabel(id: number, updates: Partial<Label>): Promise<void> {
    const label = this.labels.get(id);
    if (label) {
      Object.assign(label, updates);
      this.labels.set(id, label);
    }
  }

  async deleteLabel(id: number): Promise<void> {
    this.labels.delete(id);
  }

  // Transaction Labels methods
  async getTransactionLabels(transactionId: number): Promise<TransactionLabel[]> {
    return Array.from(this.transactionLabels.values()).filter(tl => tl.transactionId === transactionId);
  }

  async createTransactionLabel(transactionId: number, labelId: number): Promise<void> {
    const id = ++this.currentId;
    const transactionLabel: TransactionLabel = { id, transactionId, labelId };
    this.transactionLabels.set(id, transactionLabel);
  }

  async deleteTransactionLabel(transactionId: number, labelId: number): Promise<void> {
    const existing = Array.from(this.transactionLabels.values())
      .find(tl => tl.transactionId === transactionId && tl.labelId === labelId);
    if (existing) {
      this.transactionLabels.delete(existing.id);
    }
  }

  async deleteAllTransactionLabels(transactionId: number): Promise<void> {
    const toDelete = Array.from(this.transactionLabels.values())
      .filter(tl => tl.transactionId === transactionId);
    for (const tl of toDelete) {
      this.transactionLabels.delete(tl.id);
    }
  }

  // Assets implementation
  async getAssetsByUserId(userId: number): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => asset.userId === userId);
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.currentId++;
    const asset: Asset = { ...insertAsset, id };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: number, updates: Partial<Asset>): Promise<void> {
    const asset = this.assets.get(id);
    if (asset) {
      this.assets.set(id, { ...asset, ...updates });
    }
  }

  async deleteAsset(id: number): Promise<void> {
    this.assets.delete(id);
  }

  // Liabilities implementation
  async getLiabilitiesByUserId(userId: number): Promise<Liability[]> {
    return Array.from(this.liabilities.values()).filter(liability => liability.userId === userId);
  }

  async getLiability(id: number): Promise<Liability | undefined> {
    return this.liabilities.get(id);
  }

  async createLiability(insertLiability: InsertLiability): Promise<Liability> {
    const id = this.currentId++;
    const liability: Liability = { ...insertLiability, id };
    this.liabilities.set(id, liability);
    return liability;
  }

  async updateLiability(id: number, updates: Partial<Liability>): Promise<void> {
    const liability = this.liabilities.get(id);
    if (liability) {
      this.liabilities.set(id, { ...liability, ...updates });
    }
  }

  async deleteLiability(id: number): Promise<void> {
    this.liabilities.delete(id);
  }

  // Net Worth Snapshots implementation
  async getNetWorthSnapshotsByUserId(userId: number): Promise<NetWorthSnapshot[]> {
    return Array.from(this.netWorthSnapshots.values())
      .filter(snapshot => snapshot.userId === userId)
      .sort((a, b) => new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime());
  }

  async createNetWorthSnapshot(insertSnapshot: InsertNetWorthSnapshot): Promise<NetWorthSnapshot> {
    const id = this.currentId++;
    const snapshot: NetWorthSnapshot = { 
      ...insertSnapshot, 
      id,
      snapshotDate: new Date().toISOString()
    };
    this.netWorthSnapshots.set(id, snapshot);
    return snapshot;
  }

  // Recurring Transactions implementation
  async getRecurringTransactionsByUserId(userId: number): Promise<RecurringTransaction[]> {
    return Array.from(this.recurringTransactions.values()).filter(rt => rt.userId === userId);
  }

  async getRecurringTransaction(id: number): Promise<RecurringTransaction | undefined> {
    return this.recurringTransactions.get(id);
  }

  async createRecurringTransaction(insertRT: InsertRecurringTransaction): Promise<RecurringTransaction> {
    const id = this.currentId++;
    const recurringTransaction: RecurringTransaction = { ...insertRT, id };
    this.recurringTransactions.set(id, recurringTransaction);
    return recurringTransaction;
  }

  async updateRecurringTransaction(id: number, updates: Partial<RecurringTransaction>): Promise<void> {
    const rt = this.recurringTransactions.get(id);
    if (rt) {
      this.recurringTransactions.set(id, { ...rt, ...updates });
    }
  }

  async deleteRecurringTransaction(id: number): Promise<void> {
    this.recurringTransactions.delete(id);
  }

  // Recurring Transaction Splits implementation
  async getRecurringTransactionSplits(recurringTransactionId: number): Promise<RecurringTransactionSplit[]> {
    return Array.from(this.recurringTransactionSplits.values())
      .filter(split => split.recurringTransactionId === recurringTransactionId);
  }

  async createRecurringTransactionSplit(insertSplit: InsertRecurringTransactionSplit): Promise<RecurringTransactionSplit> {
    const id = this.currentId++;
    const split: RecurringTransactionSplit = { ...insertSplit, id };
    this.recurringTransactionSplits.set(id, split);
    return split;
  }

  async deleteRecurringTransactionSplits(recurringTransactionId: number): Promise<void> {
    const toDelete = Array.from(this.recurringTransactionSplits.values())
      .filter(split => split.recurringTransactionId === recurringTransactionId);
    
    for (const split of toDelete) {
      this.recurringTransactionSplits.delete(split.id);
    }
  }

  // Envelope Types implementation
  async getEnvelopeTypesByUserId(userId: number): Promise<EnvelopeType[]> {
    return Array.from(this.envelopeTypes.values())
      .filter(type => type.userId === userId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getEnvelopeType(id: number): Promise<EnvelopeType | undefined> {
    return this.envelopeTypes.get(id);
  }

  async createEnvelopeType(insertType: InsertEnvelopeType): Promise<EnvelopeType> {
    const id = ++this.currentId;
    const envelopeType: EnvelopeType = { 
      ...insertType, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.envelopeTypes.set(id, envelopeType);
    return envelopeType;
  }

  async updateEnvelopeType(id: number, updates: Partial<EnvelopeType>): Promise<void> {
    const type = this.envelopeTypes.get(id);
    if (type) {
      this.envelopeTypes.set(id, { ...type, ...updates, updatedAt: new Date() });
    }
  }

  async deleteEnvelopeType(id: number): Promise<void> {
    this.envelopeTypes.delete(id);
  }

  // Initialize default envelope types for a user
  async initializeDefaultEnvelopeTypes(userId: number): Promise<void> {
    const defaultTypes = [
      { name: "Housing", icon: "🏠", color: "bg-blue-100 text-blue-800", sortOrder: 1 },
      { name: "Food", icon: "🍽️", color: "bg-green-100 text-green-800", sortOrder: 2 },
      { name: "Transportation", icon: "🚗", color: "bg-yellow-100 text-yellow-800", sortOrder: 3 },
      { name: "Entertainment", icon: "🎭", color: "bg-purple-100 text-purple-800", sortOrder: 4 },
      { name: "Health", icon: "🏥", color: "bg-red-100 text-red-800", sortOrder: 5 },
      { name: "Income", icon: "💼", color: "bg-emerald-100 text-emerald-800", sortOrder: 6 },
      { name: "Savings", icon: "💰", color: "bg-indigo-100 text-indigo-800", sortOrder: 7 }
    ];

    for (const type of defaultTypes) {
      await this.createEnvelopeType({
        ...type,
        userId,
        isDefault: true,
        isActive: true
      });
    }
  }

  // Bank Connections
  async getBankConnectionsByUserId(userId: number): Promise<BankConnection[]> {
    return Array.from(this.bankConnections.values())
      .filter(connection => connection.userId === userId);
  }

  async getBankConnection(id: number): Promise<BankConnection | undefined> {
    return this.bankConnections.get(id);
  }

  async createBankConnection(connection: InsertBankConnection): Promise<BankConnection> {
    const id = this.currentId++;
    const newConnection: BankConnection = {
      id,
      ...connection,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bankConnections.set(id, newConnection);
    return newConnection;
  }

  async updateBankConnection(id: number, updates: Partial<BankConnection>): Promise<void> {
    const connection = this.bankConnections.get(id);
    if (connection) {
      Object.assign(connection, updates, { updatedAt: new Date() });
    }
  }

  async deleteBankConnection(id: number): Promise<void> {
    this.bankConnections.delete(id);
  }

  // Two-factor authentication methods
  async updateUserTwoFactor(userId: number, updates: {
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    backupCodes?: string[];
    phoneNumber?: string;
    emailVerified?: boolean;
    email?: string;
  }): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, updates);
      this.users.set(userId, user);
    }
  }

  async getUserTwoFactorInfo(userId: number): Promise<{
    twoFactorEnabled: boolean;
    hasBackupCodes: boolean;
    backupCodesCount: number;
    phoneNumber?: string;
    email?: string;
    emailVerified: boolean;
  } | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    return {
      twoFactorEnabled: user.twoFactorEnabled || false,
      hasBackupCodes: (user.backupCodes && user.backupCodes.length > 0) || false,
      backupCodesCount: user.backupCodes?.length || 0,
      phoneNumber: user.phoneNumber || undefined,
      email: user.email || undefined,
      emailVerified: user.emailVerified || false,
    };
  }
}

// Import Supabase storage implementation
import { supabaseStorage } from './supabase-storage';

// Use Supabase storage if credentials are available, otherwise fall back to memory storage
export const storage = process.env.SUPABASE_URL && process.env.SUPABASE_KEY 
  ? supabaseStorage 
  : new MemStorage();

console.log('📦 Storage backend:', process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'In-Memory (Demo Mode)');
