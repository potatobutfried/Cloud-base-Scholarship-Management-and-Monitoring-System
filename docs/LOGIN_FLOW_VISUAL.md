# 🔄 Login Flow - Visual Guide

## User Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Opens Login Page                     │
│                  (pages/public/login.html)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              User Enters Credentials                         │
│    Email: valjeremy@grc.edu.ph   OR  schojeremy@grc.edu.ph  │
│    Password: validator123         OR  scholar123            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│            Firebase Authentication Validates                 │
│              ✓ Email exists?                                │
│              ✓ Password correct?                            │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
         ✓ Success                 ✗ Failed
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│  Get User UID        │   │   Show Error Message:        │
│  (from Firebase Auth)│   │   - Invalid credentials      │
└──────┬───────────────┘   │   - Account not found        │
       │                   │   - Wrong password           │
       ▼                   └──────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│          Fetch User Document from Firestore                  │
│          Collection: users / Document: {uid}                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Read 'role' Field from Document                 │
└──────┬──────────────────────────────────┬───────────────────┘
       │                                  │
   role: "validator"                  role: "scholar"
   role: "admin"                          │
   role: "administrator"                  │
   role: "reviewer"                       │
       │                                  │
       ▼                                  ▼
┌──────────────────────┐         ┌───────────────────────────┐
│  Set Session Data:   │         │   Set Session Data:       │
│  - userRole          │         │   - userRole              │
│  - userName          │         │   - userName              │
│  - userAdmin: true   │         │   - userEmail             │
└──────┬───────────────┘         └───────┬───────────────────┘
       │                                 │
       ▼                                 ▼
┌──────────────────────┐         ┌───────────────────────────┐
│   Redirect To:       │         │    Redirect To:           │
│ validator.html       │         │ scholar-dashboard.html    │
│                      │         │                           │
│ Features:            │         │ Features:                 │
│ - Review apps        │         │ - View duty logs          │
│ - Approve/Reject     │         │ - See attendance          │
│ - View all scholars  │         │ - Send messages           │
│ - Generate reports   │         │ - View own profile        │
└──────────────────────┘         └───────────────────────────┘
```

## Database Structure

```
Firebase Project: scholarship-cloudbase
│
├── Authentication (Firebase Auth)
│   ├── valjeremy@grc.edu.ph (UID: abc123...)
│   └── schojeremy@grc.edu.ph (UID: xyz789...)
│
└── Firestore Database
    └── users (collection)
        ├── abc123... (document - Validator)
        │   ├── uid: "abc123..."
        │   ├── email: "valjeremy@grc.edu.ph"
        │   ├── fullName: "Jeremy Validator"
        │   ├── role: "validator" ◄── IMPORTANT!
        │   ├── status: "active"
        │   ├── department: "Validation Office"
        │   └── position: "Application Validator"
        │
        └── xyz789... (document - Scholar)
            ├── uid: "xyz789..."
            ├── email: "schojeremy@grc.edu.ph"
            ├── fullName: "Jeremy Scholar"
            ├── role: "scholar" ◄── IMPORTANT!
            ├── status: "active"
            ├── course: "BSIT"
            ├── yearLevel: "3"
            └── department: "IT Department"
```

## Role-Based Routing Table

| User Role       | Login Email             | Redirects To                      | Access Level |
|----------------|-------------------------|-----------------------------------|--------------|
| `validator`    | valjeremy@grc.edu.ph   | `/pages/admin/validator.html`    | Full Admin   |
| `admin`        | (any admin email)       | `/pages/admin/validator.html`    | Full Admin   |
| `administrator`| (any admin email)       | `/pages/admin/validator.html`    | Full Admin   |
| `reviewer`     | (any reviewer email)    | `/pages/admin/validator.html`    | Full Admin   |
| `scholar`      | schojeremy@grc.edu.ph  | `/pages/admin/scholar-dashboard.html` | Scholar   |

## Session Storage Data

After successful login, these values are stored in `sessionStorage`:

**For Validators/Admins:**
```javascript
{
  userRole: "validator",
  userName: "Jeremy Validator",
  userEmail: "valjeremy@grc.edu.ph",
  userAdmin: true
}
```

**For Scholars:**
```javascript
{
  userRole: "scholar",
  userName: "Jeremy Scholar",
  userEmail: "schojeremy@grc.edu.ph"
}
```

## Error Handling Flow

```
Login Attempt
    │
    ├─ Email not found
    │  └─► "No account found with this email address."
    │
    ├─ Wrong password
    │  └─► "Incorrect password. Please try again."
    │
    ├─ Account disabled
    │  └─► "This account has been disabled."
    │
    ├─ Too many attempts
    │  └─► "Too many failed attempts. Please try again later."
    │
    ├─ No Firestore document
    │  └─► Create basic profile OR show error
    │
    └─ Unknown role
       └─► "Invalid account role. Please contact support."
```

## Account Creation Flow (Setup Script)

```
Open: scripts/setup-test-accounts.html
    │
    ▼
Click "Create Test Accounts"
    │
    ▼
┌─────────────────────────────────────┐
│  For Each Account (Validator, Scholar): │
│                                     │
│  1. Create Firebase Auth User      │
│     ├─ Email                       │
│     ├─ Password                    │
│     └─ Get UID                     │
│                                     │
│  2. Create Firestore Document      │
│     ├─ Collection: users           │
│     ├─ Document ID: {UID}          │
│     └─ Fields:                     │
│         ├─ uid                     │
│         ├─ email                   │
│         ├─ fullName                │
│         ├─ role ◄── CRITICAL       │
│         ├─ status                  │
│         └─ other fields...         │
│                                     │
│  3. Sign out (cleanup)             │
└─────────────────────────────────────┘
    │
    ▼
Both Accounts Created ✓
    │
    ▼
Ready to Test Login!
```

## Security Flow

```
User Request
    │
    ▼
┌─────────────────────────┐
│  Client-Side Check      │
│  (login.html)           │
│  - Validate credentials │
│  - Check role           │
│  - Route accordingly    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Firebase Auth          │
│  - Verify password      │
│  - Generate token       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Firestore Rules        │
│  - Check auth token     │
│  - Verify permissions   │
│  - Allow/Deny access    │
└─────────────────────────┘
```

## Quick Test Checklist

- [ ] 1. Create accounts (run setup-test-accounts.html)
- [ ] 2. Open login page (pages/public/login.html)
- [ ] 3. Test validator login:
      - Email: valjeremy@grc.edu.ph
      - Password: validator123
      - Should redirect to validator.html ✓
- [ ] 4. Sign out
- [ ] 5. Test scholar login:
      - Email: schojeremy@grc.edu.ph
      - Password: scholar123
      - Should redirect to scholar-dashboard.html ✓
- [ ] 6. Verify in Firebase Console:
      - Authentication → 2 users exist ✓
      - Firestore → users collection → 2 documents ✓
- [ ] 7. Check role fields are correct ✓

## Success Indicators

✅ Login page accepts both email addresses
✅ Correct password validation
✅ Automatic redirect based on role
✅ Session data properly stored
✅ Logout clears session
✅ Can't access wrong dashboard
✅ Firebase Console shows both users
✅ Firestore documents have correct role field

---

**Ready to use!** 🎉

See `docs/SETUP_COMPLETE.md` for full instructions.
