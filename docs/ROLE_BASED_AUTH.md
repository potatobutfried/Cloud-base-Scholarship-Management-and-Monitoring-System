# Role-Based Authentication System

## Overview
This system implements role-based authentication using Firebase Authentication and Firestore. Users are automatically routed to different dashboards based on their role.

## Database Structure

### Collection: `users`
Each user document is stored with their Firebase Auth UID as the document ID.

**Schema:**
```javascript
{
  uid: string,              // Firebase Auth UID (matches document ID)
  email: string,            // User's email address
  fullName: string,         // Full name
  name: string,             // Display name (alias)
  role: string,             // "validator", "admin", "scholar", etc.
  status: string,           // "active", "pending", "inactive"
  createdAt: timestamp,     // Account creation date
  
  // Role-specific fields
  department: string,       // For validators/admins
  position: string,         // For validators/admins
  course: string,           // For scholars
  yearLevel: string,        // For scholars
}
```

## User Roles

### 1. **Validator** (Admin)
- **Role value:** `"validator"`, `"admin"`, `"administrator"`, or `"reviewer"`
- **Dashboard:** `/pages/admin/validator.html`
- **Permissions:** Can review applications, approve/reject scholars

### 2. **Scholar**
- **Role value:** `"scholar"`
- **Dashboard:** `/pages/admin/scholar-dashboard.html`
- **Permissions:** View their own duty logs, attendance, send messages

## Test Accounts

### Validator Account
```
Email: valjeremy@grc.edu.ph
Password: validator123
Role: validator
```

### Scholar Account
```
Email: schojeremy@grc.edu.ph
Password: scholar123
Role: scholar
```

## Setup Instructions

### Step 1: Create Test Accounts
1. Open your browser and navigate to:
   ```
   scripts/setup-test-accounts.html
   ```
2. Click the "Create Test Accounts" button
3. Wait for the confirmation that both accounts have been created

### Step 2: Test the Login System
1. Navigate to: `pages/public/login.html`
2. Try logging in with the validator account:
   - Email: `valjeremy@grc.edu.ph`
   - Password: `validator123`
   - You should be redirected to the validator dashboard
3. Sign out and try the scholar account:
   - Email: `schojeremy@grc.edu.ph`
   - Password: `scholar123`
   - You should be redirected to the scholar dashboard

## How It Works

### Login Flow
1. User enters email and password
2. Firebase Authentication verifies credentials
3. System fetches user document from Firestore using UID
4. User's `role` field is checked
5. User is redirected to appropriate dashboard:
   - `validator/admin/administrator/reviewer` → Validator Dashboard
   - `scholar` → Scholar Dashboard
   - Unknown role → Error message

### Security
- User information is stored in `sessionStorage` during the session
- Role verification happens on both client and server (Firestore rules)
- Users without proper roles cannot access admin features

## Adding New Users

### Method 1: Manual (Firebase Console)
1. Go to Firebase Console → Authentication
2. Add user with email/password
3. Go to Firestore → `users` collection
4. Create document with UID as document ID
5. Add required fields including `role`

### Method 2: Programmatic (Recommended for Production)
Use the create-admin page or implement a user management interface in your admin dashboard.

## Database Best Practices

### Why Single Collection (`users`)?
✅ **Advantages:**
- Simpler queries (one collection to search)
- Easier to manage permissions
- Single source of truth for user data
- Flexible role system (can add new roles easily)
- Better for Firebase's pricing model (fewer collection reads)

❌ **Alternative (Separate Collections):**
You could create separate collections like:
- `validators` collection
- `scholars` collection

But this approach:
- Requires duplicate data management
- More complex queries
- Harder to maintain consistency
- More expensive (multiple collection reads)

### Firestore Security Rules Example
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only admins can write
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['validator', 'admin', 'administrator'];
    }
    
    // Scholar messages - scholars can create, admins can read
    match /scholar_messages/{messageId} {
      allow create: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'scholar';
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['validator', 'admin', 'administrator'];
    }
  }
}
```

## Troubleshooting

### Login Issues
1. **"Invalid email or password"**
   - Check if account exists in Firebase Authentication
   - Verify password is correct

2. **"Invalid account role"**
   - Check Firestore `users` collection
   - Verify user document has correct `role` field

3. **Redirects to wrong dashboard**
   - Check user's `role` value in Firestore
   - Clear browser cache and try again

### Account Creation Issues
1. **"Email already in use"**
   - Account exists - use password reset or delete and recreate
   
2. **"Permission denied"**
   - Check Firestore security rules
   - Make sure rules allow creation

## Future Enhancements
- [ ] Add email verification
- [ ] Implement password complexity requirements
- [ ] Add multi-factor authentication
- [ ] Create user management interface for admins
- [ ] Add audit logging for role changes
- [ ] Implement rate limiting on login attempts

## Support
For issues or questions, contact the development team or check the Firebase Console logs.
