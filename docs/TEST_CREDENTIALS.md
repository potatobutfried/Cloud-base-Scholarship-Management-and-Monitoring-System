# Test Credentials - Quick Reference

## 🔐 Login Credentials

### Validator/Admin Account
```
Username/Email: valjeremy@grc.edu.ph
Password: validator123
Dashboard: Validator Dashboard (pages/admin/validator.html)
```

### Scholar Account
```
Username/Email: schojeremy@grc.edu.ph
Password: scholar123
Dashboard: Scholar Dashboard (pages/admin/scholar-dashboard.html)
```

## 🚀 Quick Setup

1. **Create the accounts:**
   - Open: `scripts/setup-test-accounts.html`
   - Click: "Create Test Accounts"
   - Wait for success message

2. **Test login:**
   - Open: `pages/public/login.html`
   - Enter credentials above
   - Verify correct dashboard redirect

## 📊 Database Structure

### Firestore Collection: `users`

**Validator Document Example:**
```json
{
  "uid": "auto-generated-firebase-uid",
  "email": "valjeremy@grc.edu.ph",
  "fullName": "Jeremy Validator",
  "name": "Jeremy Validator",
  "role": "validator",
  "status": "active",
  "department": "Validation Office",
  "position": "Application Validator",
  "createdAt": "2025-10-07T..."
}
```

**Scholar Document Example:**
```json
{
  "uid": "auto-generated-firebase-uid",
  "email": "schojeremy@grc.edu.ph",
  "fullName": "Jeremy Scholar",
  "name": "Jeremy Scholar",
  "role": "scholar",
  "status": "active",
  "course": "BSIT",
  "yearLevel": "3",
  "department": "IT Department",
  "createdAt": "2025-10-07T..."
}
```

## 🎯 Routing Logic

| Role | Redirects To |
|------|-------------|
| `validator` | `/pages/admin/validator.html` |
| `admin` | `/pages/admin/validator.html` |
| `administrator` | `/pages/admin/validator.html` |
| `reviewer` | `/pages/admin/validator.html` |
| `scholar` | `/pages/admin/scholar-dashboard.html` |

## ✅ Checklist

- [ ] Run `scripts/setup-test-accounts.html` to create accounts
- [ ] Test validator login → should redirect to validator dashboard
- [ ] Test scholar login → should redirect to scholar dashboard
- [ ] Check Firebase Console → Authentication → verify both users exist
- [ ] Check Firestore → `users` collection → verify both documents exist
- [ ] Test logout functionality
- [ ] Test forgot password feature

## 🔧 Manual Account Creation (If Needed)

### Via Firebase Console

**Step 1: Create Auth User**
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter email and password
4. Copy the generated UID

**Step 2: Create Firestore Document**
1. Go to Firestore Database → `users` collection
2. Click "Add document"
3. Use the UID as Document ID
4. Add fields:
   - `uid`: [paste UID]
   - `email`: [user email]
   - `fullName`: [name]
   - `role`: "validator" or "scholar"
   - `status`: "active"

## 🛡️ Security Notes

- **Production:** Change these passwords immediately
- **Testing:** These credentials are for development only
- **Firebase Rules:** Make sure to configure proper security rules
- **Session Storage:** User data is stored in sessionStorage (cleared on browser close)

## 📝 Notes

- The login page now works for **both** validators and scholars
- Role detection is automatic based on Firestore `users/{uid}/role` field
- No separate login pages needed - one unified login experience
- Better for transparency - users see their appropriate dashboard immediately
