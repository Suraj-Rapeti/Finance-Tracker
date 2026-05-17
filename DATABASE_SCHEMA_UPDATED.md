# 🗄️ Finance Tracker Database Documentation

## Firebase Firestore Database Schema

### Overview
The Finance Tracker uses Firebase Firestore to store all user financial data. Data is organized in collections with user-level security (each user can only access their own data).

---

## 📋 Collections Structure

### 1. **users** Collection
Stores user profile information and authentication data.

```
users/
├── {userId}
│   ├── uid: string (user ID)
│   ├── email: string
│   ├── name: string
│   ├── avatar: string | null
│   ├── plan: string ("Free", "Premium", "Pro")
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

**Example:**
```json
{
  "uid": "FK37DLI9HScPHglK3JZVUqSrqVI3",
  "email": "test@example.com",
  "name": "Test User",
  "avatar": null,
  "plan": "Free",
  "createdAt": "2026-05-12T11:22:40Z",
  "updatedAt": "2026-05-12T11:22:40Z"
}
```

---

### 2. **transactions** Collection
Stores all income and expense transactions for users.

```
transactions/
├── {transactionId}
│   ├── user_id: string (links to user)
│   ├── title: string (description)
│   ├── amount: number (+ for income, - for expense)
│   ├── type: string ("income" | "expense")
│   ├── category: string (see categories below)
│   ├── method: string (payment method)
│   ├── icon: string (emoji)
│   ├── date: string (YYYY-MM-DD)
│   ├── created_at: timestamp
│   └── updated_at: timestamp
```

**Categories:**
- 🛒 Food & Grocery
- 🚗 Transport
- 🎬 Entertainment
- ⚡ Utilities
- 🛍️ Shopping
- 💪 Health
- 📚 Education
- 📈 Investment
- 💰 Income
- 📌 Other

**Payment Methods:**
- Card
- Cash
- Bank Transfer
- PayPal
- Auto-pay
- UPI

**Example:**
```json
{
  "user_id": "FK37DLI9HScPHglK3JZVUqSrqVI3",
  "title": "Grocery Shopping",
  "amount": -3500,
  "type": "expense",
  "category": "Food & Grocery",
  "method": "Card",
  "icon": "🛒",
  "date": "2026-05-10",
  "created_at": "2026-05-10T14:30:00Z",
  "updated_at": "2026-05-10T14:30:00Z"
}
```

---

### 3. **budgets** Collection
Stores monthly budget limits for different spending categories.

```
budgets/
├── {budgetId}
│   ├── user_id: string (links to user)
│   ├── category: string (spending category)
│   ├── limit: number (monthly budget limit in rupees)
│   ├── spent: number (amount spent this month)
│   ├── icon: string (emoji)
│   ├── color: string (hex color for UI)
│   ├── created_at: timestamp
│   └── updated_at: timestamp
```

**Example:**
```json
{
  "user_id": "FK37DLI9HScPHglK3JZVUqSrqVI3",
  "category": "Food & Grocery",
  "limit": 8000,
  "spent": 5300,
  "icon": "🛒",
  "color": "#10B981",
  "created_at": "2026-05-01T00:00:00Z",
  "updated_at": "2026-05-12T14:30:00Z"
}
```

---

### 4. **goals** Collection
Stores user financial goals with progress tracking.

```
goals/
├── {goalId}
│   ├── user_id: string (links to user)
│   ├── name: string (goal name)
│   ├── description: string (goal description)
│   ├── target: number (target amount)
│   ├── current: number (current progress)
│   ├── deadline: string (YYYY-MM-DD)
│   ├── icon: string (emoji)
│   ├── color: string (hex color)
│   ├── priority: string ("high" | "medium" | "low")
│   ├── created_at: timestamp
│   └── updated_at: timestamp
```

**Example:**
```json
{
  "user_id": "FK37DLI9HScPHglK3JZVUqSrqVI3",
  "name": "Emergency Fund",
  "description": "Build 6 months of expenses",
  "target": 150000,
  "current": 45000,
  "deadline": "2026-12-31",
  "icon": "🏦",
  "color": "#10B981",
  "priority": "high",
  "created_at": "2026-05-01T00:00:00Z",
  "updated_at": "2026-05-12T14:30:00Z"
}
```

---

### 5. **settings** Collection
Stores user preferences and settings.

```
settings/
├── {userId}
│   ├── currency: string ("INR", "USD", etc.)
│   ├── theme: string ("dark", "light")
│   ├── notifications: boolean
│   ├── language: string ("en", "hi", etc.)
│   ├── updated_at: timestamp
│   └── ... (other preferences)
```

---

## 🔒 Security Rules

Security rules ensure users can only access their own data:

```firestore
// Users can only read/write their own profile
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Users can only access their own transactions
match /transactions/{document=**} {
  allow read, write: if request.auth.uid == resource.data.user_id;
  allow create: if request.auth.uid == request.resource.data.user_id;
}

// Same for budgets and goals...
```

---

## 🚀 Setup & Usage

### 1. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Seed Sample Data
```bash
npm run seed-db
```

This will add:
- 10 sample transactions
- 5 sample budgets
- 3 sample goals

For the test user: `FK37DLI9HScPHglK3JZVUqSrqVI3`

### 3. Access from Application
The app automatically syncs data using real-time listeners:

```javascript
import { useFinance } from '../context/FinanceContext';

export const MyComponent = () => {
  const { transactions, budgets, goals, addTransaction } = useFinance();
  
  // Data is automatically synced from Firestore
  // Use addTransaction() to save new transactions
};
```

---

## 📊 Data Relationships

```
User (users collection)
├── Transactions (many)
│   ├── Related to Budget by category
│   └── Related to Goals (indirectly, via savings)
├── Budgets (many)
│   └── Aggregates transactions by category
├── Goals (many)
│   └── Tracks progress from savings
└── Settings (one)
    └── User preferences
```

---

## 💾 Backup & Export

To backup your data:

1. Go to Firebase Console
2. Firestore Database → Backup
3. Choose collections to backup
4. Download as JSON

Or use the Export function:
```bash
firebase firestore:export ./backups
```

---

## 🐛 Troubleshooting

**Q: Transactions not saving?**
- Check if user is authenticated
- Verify user_id matches auth.uid
- Check security rules allow write

**Q: Data not syncing?**
- Check network connection
- Verify Firebase initialization
- Check browser console for errors

**Q: Permission denied error?**
- Update security rules
- Ensure user_id field matches
- Redeploy rules: `firebase deploy --only firestore:rules`

---

## 📈 Next Steps

1. ✅ Security rules deployed
2. ✅ Sample data seeded
3. 🔄 Real-time sync working
4. 📝 Ready for production

---

**Last Updated:** May 14, 2026
**Status:** ✅ Production Ready
