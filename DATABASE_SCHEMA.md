# Finance Tracker Database Schema

## Firestore Collections

### Users Collection
**Collection:** `users`

```
users/{uid}
├── id (string) - Firebase UID
├── name (string) - User's full name
├── email (string) - User's email address
├── avatar (string, optional) - Avatar URL
├── plan (string) - Plan type (Free/Pro)
├── created_at (timestamp) - Account creation date
├── updated_at (timestamp) - Last profile update
```

**Example:**
```json
{
  "id": "user_123abc",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "plan": "Pro",
  "created_at": "2026-05-12T00:00:00Z",
  "updated_at": "2026-05-12T12:00:00Z"
}
```

---

### Transactions Collection
**Collection:** `transactions`

```
transactions/{id}
├── id (string) - Document ID
├── user_id (string) - Reference to user
├── amount (number) - Transaction amount
├── category (string) - Category (Food & Grocery, Transport, etc.)
├── type (string) - Type (income/expense)
├── payment_method (string) - Method (Card, Bank Transfer, Cash, etc.)
├── title (string) - Description
├── date (string) - Date (YYYY-MM-DD format)
├── icon (string, optional) - Emoji or icon
├── created_at (timestamp) - When created
├── updated_at (timestamp) - Last updated
```

**Example:**
```json
{
  "user_id": "user_123abc",
  "amount": 50.00,
  "category": "Food & Grocery",
  "type": "expense",
  "payment_method": "Card",
  "title": "Whole Foods Market",
  "date": "2026-05-12",
  "icon": "🛒",
  "created_at": "2026-05-12T10:30:00Z",
  "updated_at": "2026-05-12T10:30:00Z"
}
```

---

### Budgets Collection
**Collection:** `budgets`

```
budgets/{id}
├── id (string) - Document ID
├── user_id (string) - Reference to user
├── category (string) - Budget category
├── limit_amount (number) - Budget limit
├── spent (number) - Amount spent in month
├── month (string) - Month (YYYY-MM format)
├── color (string) - Color hex code
├── icon (string) - Emoji or icon
├── created_at (timestamp) - When created
├── updated_at (timestamp) - Last updated
```

**Example:**
```json
{
  "user_id": "user_123abc",
  "category": "Food & Grocery",
  "limit_amount": 500.00,
  "spent": 250.00,
  "month": "2026-05",
  "color": "#10B981",
  "icon": "🛒",
  "created_at": "2026-05-01T00:00:00Z",
  "updated_at": "2026-05-12T10:30:00Z"
}
```

---

### Goals Collection
**Collection:** `goals`

```
goals/{id}
├── id (string) - Document ID
├── user_id (string) - Reference to user
├── goal_name (string) - Goal name
├── target_amount (number) - Target amount
├── current (number) - Current progress
├── deadline (string) - Deadline date (YYYY-MM-DD)
├── color (string) - Color hex code
├── icon (string) - Emoji or icon
├── created_at (timestamp) - When created
├── updated_at (timestamp) - Last updated
```

**Example:**
```json
{
  "user_id": "user_123abc",
  "goal_name": "Emergency Fund",
  "target_amount": 10000.00,
  "current": 6800.00,
  "deadline": "2026-12-31",
  "color": "#10B981",
  "icon": "🛡️",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-05-12T10:30:00Z"
}
```

---

### Bills Collection
**Collection:** `bills`

```
bills/{id}
├── id (string) - Document ID
├── user_id (string) - Reference to user
├── title (string) - Bill name (e.g., "Rent", "Phone Bill")
├── amount (number) - Bill amount
├── category (string) - Category (Housing, Utilities, Insurance, Entertainment, Health, Education, Transport, Other)
├── dueDate (string) - Due date (YYYY-MM-DD format)
├── icon (string) - Emoji or icon representation
├── created_at (timestamp) - When created
├── updated_at (timestamp) - Last updated
```

**Example:**
```json
{
  "user_id": "user_123abc",
  "title": "Electricity Bill",
  "amount": 2500.00,
  "category": "Utilities",
  "dueDate": "2026-06-15",
  "icon": "⚡",
  "created_at": "2026-05-10T00:00:00Z",
  "updated_at": "2026-05-10T10:00:00Z"
}
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Transactions: User can read/write only their own
    match /transactions/{document=**} {
      allow read: if request.auth.uid == resource.data.user_id;
      allow write: if request.auth.uid == request.resource.data.user_id;
      allow delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Budgets: User can read/write only their own
    match /budgets/{document=**} {
      allow read: if request.auth.uid == resource.data.user_id;
      allow write: if request.auth.uid == request.resource.data.user_id;
      allow delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Goals: User can read/write only their own
    match /goals/{document=**} {
      allow read: if request.auth.uid == resource.data.user_id;
      allow write: if request.auth.uid == request.resource.data.user_id;
      allow delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Bills: User can read/write only their own
    match /bills/{document=**} {
      allow read: if request.auth.uid == resource.data.user_id;
      allow write: if request.auth.uid == request.resource.data.user_id;
      allow delete: if request.auth.uid == resource.data.user_id;
    }
  }
}
```

---

## Field Types Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id / uid | String | Yes | Firestore document ID or Firebase UID |
| name | String | Yes | User's full name |
| email | String | Yes | Email address (unique) |
| user_id | String | Yes | Reference to user (Firebase UID) |
| amount | Number | Yes | Can be positive or negative |
| category | String | Yes | Pre-defined categories |
| type | String | Yes | "income" or "expense" |
| payment_method | String | Yes | Card, Bank Transfer, Cash, PayPal, etc. |
| title | String | Yes | Transaction description |
| date | String | Yes | ISO format: YYYY-MM-DD |
| limit_amount | Number | Yes | Budget limit in dollars |
| spent | Number | Yes | Amount spent so far |
| month | String | Yes | YYYY-MM format |
| goal_name | String | Yes | Name of the goal |
| target_amount | Number | Yes | Target amount in dollars |
| current | Number | Yes | Current progress |
| deadline | String | Yes | Target completion date (YYYY-MM-DD) |
| color | String | No | Hex color code (#10B981) |
| icon | String | No | Emoji or icon identifier |
| created_at | Timestamp | Yes | Automatic on creation |
| updated_at | Timestamp | Yes | Automatic on update |

---

## Indexes

Firestore will automatically suggest indexes for:
- `transactions` ordered by `user_id` + `created_at`
- `budgets` filtered by `user_id` + `month`
- `goals` filtered by `user_id` + `deadline`

---

## Constraints & Validation

### Users
- Email must be unique
- Name must not be empty
- Plan must be one of: Free, Pro, Premium

### Transactions
- Amount must be a number (positive or negative)
- Type must be "income" or "expense"
- Category must be from predefined list
- Date must be valid ISO format

### Budgets
- limit_amount must be > 0
- spent must be >= 0
- month must be valid YYYY-MM format
- Only one budget per user per category per month

### Goals
- target_amount must be > 0
- current must be >= 0 and <= target_amount
- deadline must be in future

---

## Queries

### Get All Transactions for a User
```
db.collection("transactions")
  .where("user_id", "==", userId)
  .orderBy("created_at", "desc")
  .get()
```

### Get Budget for Current Month
```
db.collection("budgets")
  .where("user_id", "==", userId)
  .where("month", "==", "2026-05")
  .get()
```

### Get Active Goals
```
db.collection("goals")
  .where("user_id", "==", userId)
  .where("deadline", ">=", today)
  .orderBy("deadline", "asc")
  .get()
```

### Calculate Total Spent by Category (Month)
```
db.collection("transactions")
  .where("user_id", "==", userId)
  .where("type", "==", "expense")
  .where("month", "==", "2026-05")
  .get()
  // Then aggregate by category in your application
```
