/**
 * Firestore Database Seed Script
 * Run this to populate sample data for testing
 * 
 * Usage: node scripts/seedDatabase.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize Firebase
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');

let db;

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "finance-tracker-332c8"
  });
  
  db = admin.firestore();
  console.log('✅ Firebase Admin SDK initialized with service account\n');
} catch (error) {
  console.log('⚠️  Service account not found. Using default credentials...');
  console.log('📝 Note: You can download service account key from:');
  console.log('   Firebase Console > Project Settings > Service Accounts > Generate new private key\n');
  
  // Fallback to default credentials (requires GOOGLE_APPLICATION_CREDENTIALS env var)
  admin.initializeApp({
    projectId: "finance-tracker-332c8"
  });
  
  db = admin.firestore();
}

// Test user ID (from your database)
const USER_ID = "FK37DLI9HScPHglK3JZVUqSrqVI3";

// Sample transactions data
const sampleTransactions = [
  {
    user_id: USER_ID,
    title: "Salary",
    amount: 50000,
    type: "income",
    category: "Income",
    method: "Bank Transfer",
    icon: "💰",
    date: "2026-05-01",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Freelance Project",
    amount: 15000,
    type: "income",
    category: "Income",
    method: "Bank Transfer",
    icon: "💰",
    date: "2026-05-05",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Grocery Shopping",
    amount: -3500,
    type: "expense",
    category: "Food & Grocery",
    method: "Card",
    icon: "🛒",
    date: "2026-05-10",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Netflix Subscription",
    amount: -499,
    type: "expense",
    category: "Entertainment",
    method: "Card",
    icon: "🎬",
    date: "2026-05-08",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Petrol",
    amount: -1200,
    type: "expense",
    category: "Transport",
    method: "Card",
    icon: "🚗",
    date: "2026-05-12",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Restaurant Dinner",
    amount: -1800,
    type: "expense",
    category: "Food & Grocery",
    method: "Cash",
    icon: "🛒",
    date: "2026-05-11",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Amazon Purchase",
    amount: -2500,
    type: "expense",
    category: "Shopping",
    method: "Card",
    icon: "🛍️",
    date: "2026-05-09",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Electricity Bill",
    amount: -1200,
    type: "expense",
    category: "Utilities",
    method: "Auto-pay",
    icon: "⚡",
    date: "2026-05-06",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Gym Membership",
    amount: -500,
    type: "expense",
    category: "Health",
    method: "Card",
    icon: "💪",
    date: "2026-05-07",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    title: "Online Course",
    amount: -5000,
    type: "expense",
    category: "Education",
    method: "Card",
    icon: "📚",
    date: "2026-05-04",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
];

// Sample budgets data
const sampleBudgets = [
  {
    user_id: USER_ID,
    category: "Food & Grocery",
    limit: 8000,
    spent: 5300,
    icon: "🛒",
    color: "#10B981",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    category: "Transport",
    limit: 3000,
    spent: 1200,
    icon: "🚗",
    color: "#3B82F6",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    category: "Entertainment",
    limit: 2000,
    spent: 499,
    icon: "🎬",
    color: "#F59E0B",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    category: "Shopping",
    limit: 5000,
    spent: 2500,
    icon: "🛍️",
    color: "#EC4899",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    category: "Utilities",
    limit: 2000,
    spent: 1200,
    icon: "⚡",
    color: "#8B5CF6",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
];

// Sample goals data
const sampleGoals = [
  {
    user_id: USER_ID,
    name: "Emergency Fund",
    description: "Build 6 months of expenses",
    target: 150000,
    current: 45000,
    deadline: "2026-12-31",
    icon: "🏦",
    color: "#10B981",
    priority: "high",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    name: "Vacation Fund",
    description: "Save for international trip",
    target: 100000,
    current: 28000,
    deadline: "2026-10-31",
    icon: "✈️",
    color: "#3B82F6",
    priority: "medium",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
  {
    user_id: USER_ID,
    name: "Laptop Upgrade",
    description: "Save for new MacBook Pro",
    target: 150000,
    current: 85000,
    deadline: "2026-08-31",
    icon: "💻",
    color: "#8B5CF6",
    priority: "medium",
    created_at: admin.firestore.Timestamp.now(),
    updated_at: admin.firestore.Timestamp.now(),
  },
];

// Seed function
async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...\n");

    // Add transactions
    console.log("📊 Adding transactions...");
    for (const transaction of sampleTransactions) {
      const docRef = await db.collection("transactions").add(transaction);
      console.log(`  ✓ Added transaction: ${transaction.title} (${docRef.id})`);
    }
    console.log(`✅ Added ${sampleTransactions.length} transactions\n`);

    // Add budgets
    console.log("💰 Adding budgets...");
    for (const budget of sampleBudgets) {
      const docRef = await db.collection("budgets").add(budget);
      console.log(`  ✓ Added budget: ${budget.category} (${docRef.id})`);
    }
    console.log(`✅ Added ${sampleBudgets.length} budgets\n`);

    // Add goals
    console.log("🎯 Adding goals...");
    for (const goal of sampleGoals) {
      const docRef = await db.collection("goals").add(goal);
      console.log(`  ✓ Added goal: ${goal.name} (${docRef.id})`);
    }
    console.log(`✅ Added ${sampleGoals.length} goals\n`);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`\n📈 Summary:`);
    console.log(`   • Transactions: ${sampleTransactions.length}`);
    console.log(`   • Budgets: ${sampleBudgets.length}`);
    console.log(`   • Goals: ${sampleGoals.length}`);
    console.log(`   • User ID: ${USER_ID}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
