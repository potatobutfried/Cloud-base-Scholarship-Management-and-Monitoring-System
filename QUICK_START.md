# 🚀 Quick Start Guide - Fix "Invalid Email or Password" Error

## ⚠️ Why You're Getting the Error

The error "Invalid email or password. Please check your credentials" appears because **the test accounts don't exist in Firebase yet**. They need to be created first!

---

## ✅ Fix in 2 Easy Steps

### Step 1: Create the Test Accounts (ONE TIME ONLY)

1. **Open this file in your browser:**
   ```
   scripts/setup-test-accounts.html
   ```

2. **Click the button:** "Create Test Accounts"

3. **Wait for success message:** You should see green checkmarks like:
   ```
   ✓ Auth account created (UID: abc123...)
   ✓ Firestore document created for Jeremy Validator
   ✓ Auth account created (UID: xyz789...)
   ✓ Firestore document created for Jeremy Scholar
   ✓ Setup Complete!
   ```

### Step 2: Now Login!

1. **Go to:** `pages/public/login.html`

2. **Try these credentials:**

   **Option A: Validator Login**
   ```
   Username: valjeremy
   Password: validator123
   ```
   OR
   ```
   Email: valjeremy@grc.edu.ph
   Password: validator123
   ```

   **Option B: Scholar Login**
   ```
   Username: schojeremy
   Password: scholar123
   ```
   OR
   ```
   Email: schojeremy@grc.edu.ph
   Password: scholar123
   ```

3. **What happens:**
   - Validator → Redirects to Validator Dashboard
   - Scholar → Redirects to Scholar Dashboard

---

## 💡 Now You Can Use Short Usernames!

**NEW FEATURE:** You can now login with just the username (no need to type @grc.edu.ph):

✅ Type: `valjeremy` → Auto-completes to `valjeremy@grc.edu.ph`
✅ Type: `schojeremy` → Auto-completes to `schojeremy@grc.edu.ph`

---

## 🔍 Verify Accounts Were Created

### Check in Firebase Console:

1. **Go to:** [Firebase Console](https://console.firebase.google.com/)
2. **Select project:** "scholarship-cloudbase"
3. **Check Authentication:**
   - Click "Authentication" → "Users"
   - You should see 2 users:
     - `valjeremy@grc.edu.ph`
     - `schojeremy@grc.edu.ph`

4. **Check Firestore:**
   - Click "Firestore Database"
   - Open `users` collection
   - You should see 2 documents
   - Each document should have a `role` field:
     - One with `role: "validator"`
     - One with `role: "scholar"`

---

## ❌ Still Not Working?

### Error: "Email already in use"
- **Cause:** Accounts already exist
- **Fix:** Just go to login page and try logging in

### Error: "Invalid email or password"
- **Cause 1:** Accounts not created yet
  - **Fix:** Run Step 1 above (setup-test-accounts.html)
- **Cause 2:** Wrong password
  - **Fix:** Check you typed `validator123` or `scholar123` correctly
- **Cause 3:** Wrong email/username
  - **Fix:** Use exactly `valjeremy` or `schojeremy`

### Error: "Permission denied" in setup script
- **Cause:** Firebase rules may be blocking account creation
- **Fix:** Check Firebase Console → Firestore → Rules

### Error: "Firebase not initialized"
- **Cause:** Internet connection or Firebase config issue
- **Fix:** 
  - Check your internet connection
  - Open browser console (F12) to see detailed error
  - Verify Firebase project is active

---

## 📝 Summary Checklist

- [ ] Run `scripts/setup-test-accounts.html` (ONE TIME)
- [ ] Click "Create Test Accounts" button
- [ ] See success message
- [ ] Go to `pages/public/login.html`
- [ ] Try validator: `valjeremy` / `validator123`
- [ ] Should redirect to validator dashboard ✓
- [ ] Logout and try scholar: `schojeremy` / `scholar123`
- [ ] Should redirect to scholar dashboard ✓

---

## 🎉 Success!

Once you complete Step 1, you'll never need to do it again. The accounts will stay in Firebase and you can login anytime!

**Test Credentials (Remember These):**
- Validator: `valjeremy` / `validator123`
- Scholar: `schojeremy` / `scholar123`

---

Need more help? Check `docs/SETUP_COMPLETE.md` for detailed documentation.
