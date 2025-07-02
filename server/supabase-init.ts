import { supabase } from './supabase';

// Helper function to check if Supabase is available
function checkSupabase() {
  if (!supabase) {
    console.log('Supabase not configured - skipping initialization');
    return null;
  }
  return supabase;
}

/**
 * Initialize demo data in Supabase
 * This function creates a demo user with sample budgets, envelopes, and transactions
 * Only runs if the database is empty to avoid duplicating data
 */
export async function initializeSupabaseData(): Promise<void> {
  const client = checkSupabase();
  if (!client) return;

  try {
    // Check if we already have users in the database
    const { data: existingUsers, error: userCheckError } = await client
      .from('users')
      .select('id')
      .limit(1);

    if (userCheckError) {
      console.error('Error checking for existing users:', userCheckError);
      return;
    }

    // If users already exist, don't initialize demo data
    if (existingUsers && existingUsers.length > 0) {
      console.log('📊 Supabase database already contains data - skipping initialization');
      return;
    }

    console.log('🔄 Initializing Supabase with demo data...');

    // Create demo user
    const { data: demoUser, error: userError } = await supabase
      .from('users')
      .insert({
        username: 'demo',
        password: 'demo',
        pay_cycle: 'fortnightly',
        budget_name: 'Hoffman Household Budget'
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating demo user:', userError);
      return;
    }

    console.log('👤 Created demo user');

    // Create demo accounts
    const accounts = [
      {
        user_id: demoUser.id,
        name: 'ASB Everyday Account',
        type: 'checking',
        balance: '2847.63'
      },
      {
        user_id: demoUser.id,
        name: 'ANZ Savings Account',
        type: 'savings',
        balance: '15420.50'
      },
      {
        user_id: demoUser.id,
        name: 'Westpac Credit Card',
        type: 'credit',
        balance: '-1250.30'
      },
      {
        user_id: demoUser.id,
        name: 'Credit Card Holding',
        type: 'checking',
        balance: '1250.30',
        is_credit_holding: true
      }
    ];

    const { data: createdAccounts, error: accountsError } = await supabase
      .from('accounts')
      .insert(accounts)
      .select();

    if (accountsError) {
      console.error('Error creating accounts:', accountsError);
      return;
    }

    console.log('🏦 Created demo accounts');

    // Create envelope categories
    const categories = [
      { user_id: demoUser.id, name: 'Income', sort_order: 0 },
      { user_id: demoUser.id, name: 'Housing', sort_order: 1 },
      { user_id: demoUser.id, name: 'Transportation', sort_order: 2 },
      { user_id: demoUser.id, name: 'Food', sort_order: 3 },
      { user_id: demoUser.id, name: 'Personal', sort_order: 4 },
      { user_id: demoUser.id, name: 'Lifestyle', sort_order: 5 },
      { user_id: demoUser.id, name: 'Savings & Debt', sort_order: 6 }
    ];

    const { data: createdCategories, error: categoriesError } = await supabase
      .from('envelope_categories')
      .insert(categories)
      .select();

    if (categoriesError) {
      console.error('Error creating categories:', categoriesError);
      return;
    }

    console.log('📂 Created envelope categories');

    // Create some sample envelopes
    const envelopes = [
      {
        user_id: demoUser.id,
        category_id: createdCategories[0].id, // Income
        name: "Greg's Salary",
        budget_amount: '3200.00',
        current_balance: '0.00',
        frequency: 'fortnightly',
        is_income: true
      },
      {
        user_id: demoUser.id,
        category_id: createdCategories[3].id, // Food
        name: 'Groceries',
        budget_amount: '400.00',
        current_balance: '127.35',
        frequency: 'monthly',
        is_monitored: true
      },
      {
        user_id: demoUser.id,
        category_id: createdCategories[4].id, // Personal
        name: 'Spending Money',
        budget_amount: '200.00',
        current_balance: '89.20',
        frequency: 'fortnightly',
        is_monitored: true
      },
      {
        user_id: demoUser.id,
        category_id: createdCategories[1].id, // Housing
        name: 'Rent',
        budget_amount: '1800.00',
        current_balance: '1800.00',
        frequency: 'monthly'
      },
      {
        user_id: demoUser.id,
        category_id: createdCategories[2].id, // Transportation
        name: 'Fuel',
        budget_amount: '120.00',
        current_balance: '45.75',
        frequency: 'monthly'
      }
    ];

    const { data: createdEnvelopes, error: envelopesError } = await supabase
      .from('envelopes')
      .insert(envelopes)
      .select();

    if (envelopesError) {
      console.error('Error creating envelopes:', envelopesError);
      return;
    }

    console.log('💰 Created sample envelopes');

    // Create some demo transactions
    const transactions = [
      {
        user_id: demoUser.id,
        account_id: createdAccounts[0].id, // ASB Everyday
        merchant: 'Countdown',
        description: 'Weekly grocery shopping',
        amount: '127.50',
        date: '2025-01-23',
        approved: true
      },
      {
        user_id: demoUser.id,
        account_id: createdAccounts[0].id,
        merchant: 'BP Fuel',
        description: 'Petrol fill-up',
        amount: '68.45',
        date: '2025-01-22',
        approved: true
      },
      {
        user_id: demoUser.id,
        account_id: createdAccounts[0].id,
        merchant: 'Uber Eats',
        description: '',
        amount: '28.50',
        date: '2025-01-21',
        approved: false
      },
      {
        user_id: demoUser.id,
        account_id: createdAccounts[0].id,
        merchant: 'Mitre 10',
        description: '',
        amount: '156.80',
        date: '2025-01-20',
        approved: false
      },
      {
        user_id: demoUser.id,
        account_id: createdAccounts[0].id,
        merchant: 'Coffee Supreme',
        description: '',
        amount: '4.00',
        date: '2025-01-19',
        approved: false
      }
    ];

    const { data: createdTransactions, error: transactionsError } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();

    if (transactionsError) {
      console.error('Error creating transactions:', transactionsError);
      return;
    }

    console.log('💳 Created demo transactions');

    // Create transaction envelope links for approved transactions
    const transactionEnvelopes = [
      {
        transaction_id: createdTransactions[0].id, // Countdown
        envelope_id: createdEnvelopes[1].id, // Groceries
        amount: '127.50'
      },
      {
        transaction_id: createdTransactions[1].id, // BP Fuel
        envelope_id: createdEnvelopes[4].id, // Fuel
        amount: '68.45'
      }
    ];

    const { error: transactionEnvelopesError } = await supabase
      .from('transaction_envelopes')
      .insert(transactionEnvelopes);

    if (transactionEnvelopesError) {
      console.error('Error creating transaction envelopes:', transactionEnvelopesError);
      return;
    }

    // Create some demo labels
    const labels = [
      { user_id: demoUser.id, name: 'Personal', colour: '#3B82F6' },
      { user_id: demoUser.id, name: 'Business', colour: '#10B981' },
      { user_id: demoUser.id, name: 'Tax Deductible', colour: '#F59E0B' },
      { user_id: demoUser.id, name: 'Recurring', colour: '#8B5CF6' },
      { user_id: demoUser.id, name: 'Emergency', colour: '#EF4444' }
    ];

    const { error: labelsError } = await supabase
      .from('labels')
      .insert(labels);

    if (labelsError) {
      console.error('Error creating labels:', labelsError);
      return;
    }

    console.log('🏷️ Created demo labels');
    console.log('✅ Supabase initialization complete!');

  } catch (error) {
    console.error('❌ Error initializing Supabase data:', error);
  }
}

/**
 * Clean up all demo data from Supabase
 * Use this function to reset the database to a clean state
 */
export async function cleanSupabaseData(): Promise<void> {
  try {
    console.log('🧹 Cleaning up Supabase data...');

    // Delete in reverse order of dependencies
    await supabase.from('transaction_labels').delete().gte('id', 0);
    await supabase.from('transaction_envelopes').delete().gte('id', 0);
    await supabase.from('labels').delete().gte('id', 0);
    await supabase.from('transactions').delete().gte('id', 0);
    await supabase.from('envelopes').delete().gte('id', 0);
    await supabase.from('envelope_categories').delete().gte('id', 0);
    await supabase.from('accounts').delete().gte('id', 0);
    await supabase.from('users').delete().gte('id', 0);

    console.log('✅ Supabase cleanup complete!');
  } catch (error) {
    console.error('❌ Error cleaning Supabase data:', error);
  }
}