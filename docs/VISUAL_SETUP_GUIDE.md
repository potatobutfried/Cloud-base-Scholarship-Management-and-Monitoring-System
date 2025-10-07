# 📸 Visual Step-by-Step Guide

## Firebase Console Setup - Screenshots Reference

### STEP 1: Open Firebase Console

**What to do:**
1. Go to: https://console.firebase.google.com/
2. You should see your projects
3. Click on: `scholarship-cloudbase`

**What you'll see:**
- List of your Firebase projects
- Click the one that says "scholarship-cloudbase"

---

### STEP 2: Go to Authentication

**What to do:**
1. On the LEFT sidebar, find and click: **Authentication**
2. Click the **Users** tab at the top

**What you'll see:**
```
Left Sidebar:
├── Project Overview
├── 🔥 Authentication  ← CLICK THIS
├── Firestore Database
├── Storage
└── ...

Top Tabs:
[Users] [Sign-in method] [Templates] [Usage]
  ↑
CLICK THIS
```

---

### STEP 3: Add First User (Validator)

**What to do:**
1. Click the **Add user** button (blue, top right)
2. A popup appears

**In the popup, enter:**
```
┌─────────────────────────────────────┐
│ Add user                         [X]│
├─────────────────────────────────────┤
│                                     │
│ Email address                       │
│ ┌─────────────────────────────────┐ │
│ │ valjeremy@grc.edu.ph           │ │ ← COPY/PASTE THIS
│ └─────────────────────────────────┘ │
│                                     │
│ Password                            │
│ ┌─────────────────────────────────┐ │
│ │ validator123                    │ │ ← COPY/PASTE THIS
│ └─────────────────────────────────┘ │
│                                     │
│        [Cancel]    [Add user]       │
└─────────────────────────────────────┘
```

3. Click **Add user**

**After clicking, you'll see:**
- New user appears in the list
- Click on the user to see details
- **COPY THE UID** (looks like: `MJ3kR9Xp2Yf8sL1Q4tV7...`)

---

### STEP 4: Add Second User (Scholar)

**What to do:**
1. Click **Add user** again
2. Enter in the popup:

```
┌─────────────────────────────────────┐
│ Add user                         [X]│
├─────────────────────────────────────┤
│                                     │
│ Email address                       │
│ ┌─────────────────────────────────┐ │
│ │ schojeremy@grc.edu.ph          │ │ ← COPY/PASTE THIS
│ └─────────────────────────────────┘ │
│                                     │
│ Password                            │
│ ┌─────────────────────────────────┐ │
│ │ scholar123                      │ │ ← COPY/PASTE THIS
│ └─────────────────────────────────┘ │
│                                     │
│        [Cancel]    [Add user]       │
└─────────────────────────────────────┘
```

3. Click **Add user**
4. Click on this new user
5. **COPY THE UID** (different from first one!)

**What you should now see in Users list:**
```
Users (2)
┌─────────────────────────────────────────────────────┐
│ User Identifier          │ Providers │ Created      │
├──────────────────────────┼───────────┼──────────────┤
│ valjeremy@grc.edu.ph    │ Email     │ Oct 7, 2025  │
│ schojeremy@grc.edu.ph   │ Email     │ Oct 7, 2025  │
└─────────────────────────────────────────────────────┘
```

---

### STEP 5: Go to Firestore Database

**What to do:**
1. On the LEFT sidebar, click: **Firestore Database**

**What you'll see:**
```
Left Sidebar:
├── Project Overview
├── Authentication
├── 🔥 Firestore Database  ← CLICK THIS
├── Storage
└── ...
```

**If you see "users" collection:**
- Click on it

**If you DON'T see "users" collection:**
1. Click **Start collection**
2. Collection ID: type `users`
3. Click **Next**
4. You'll be asked to add first document (continue to next step)

---

### STEP 6: Add Validator Document

**What to do:**
1. In the `users` collection, click **Add document**
2. You'll see this form:

```
┌─────────────────────────────────────────────────────┐
│ Add a document to users collection                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Document ID                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Paste Validator UID here]                     │ │ ← PASTE UID FROM STEP 3
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Field          │ Type    │ Value                   │
│ ───────────────┼─────────┼────────────────────────│
│ uid            │ string  │ [same UID]             │ ← ADD THIS
│ email          │ string  │ valjeremy@grc.edu.ph   │ ← ADD THIS
│ fullName       │ string  │ Jeremy Validator       │ ← ADD THIS
│ name           │ string  │ Jeremy Validator       │ ← ADD THIS
│ role           │ string  │ validator              │ ← ADD THIS ⚠️ IMPORTANT!
│ status         │ string  │ active                 │ ← ADD THIS
│ department     │ string  │ Validation Office      │ ← ADD THIS
│ position       │ string  │ Application Validator  │ ← ADD THIS
│                                                     │
│                          [Cancel]    [Save]         │
└─────────────────────────────────────────────────────┘
```

**How to add fields:**
- Click **+ Add field** button for each field
- Select "string" as type for all fields
- Copy/paste the values EXACTLY as shown above

3. Click **Save**

---

### STEP 7: Add Scholar Document

**What to do:**
1. Still in `users` collection
2. Click **Add document** again
3. Fill in:

```
┌─────────────────────────────────────────────────────┐
│ Add a document to users collection                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Document ID                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Paste Scholar UID here]                       │ │ ← PASTE UID FROM STEP 4
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Field          │ Type    │ Value                   │
│ ───────────────┼─────────┼────────────────────────│
│ uid            │ string  │ [same UID]             │ ← ADD THIS
│ email          │ string  │ schojeremy@grc.edu.ph  │ ← ADD THIS
│ fullName       │ string  │ Jeremy Scholar         │ ← ADD THIS
│ name           │ string  │ Jeremy Scholar         │ ← ADD THIS
│ role           │ string  │ scholar                │ ← ADD THIS ⚠️ IMPORTANT!
│ status         │ string  │ active                 │ ← ADD THIS
│ course         │ string  │ BSIT                   │ ← ADD THIS
│ yearLevel      │ string  │ 3                      │ ← ADD THIS
│ department     │ string  │ IT Department          │ ← ADD THIS
│                                                     │
│                          [Cancel]    [Save]         │
└─────────────────────────────────────────────────────┘
```

3. Click **Save**

---

### ✅ VERIFY - What You Should See

**In Firestore Database → users collection:**
```
users (collection)
├── [UID-1] (document)
│   ├── uid: "..."
│   ├── email: "valjeremy@grc.edu.ph"
│   ├── fullName: "Jeremy Validator"
│   ├── role: "validator"  ← CHECK THIS!
│   └── ...
│
└── [UID-2] (document)
    ├── uid: "..."
    ├── email: "schojeremy@grc.edu.ph"
    ├── fullName: "Jeremy Scholar"
    ├── role: "scholar"  ← CHECK THIS!
    └── ...
```

**In Authentication → Users:**
```
2 users total:
- valjeremy@grc.edu.ph
- schojeremy@grc.edu.ph
```

---

## 🎯 NOW TEST LOGIN

1. Open: `pages/public/login.html` in your browser

2. **Test 1 - Validator:**
   ```
   Username: valjeremy
   Password: validator123
   ```
   Expected: Redirects to `pages/admin/validator.html`

3. **Test 2 - Scholar:**
   ```
   Username: schojeremy
   Password: scholar123
   ```
   Expected: Redirects to `pages/admin/scholar-dashboard.html`

---

## ⚠️ CRITICAL FIELDS

These fields MUST be correct:

1. **role** field:
   - Validator document: `role: "validator"` (lowercase)
   - Scholar document: `role: "scholar"` (lowercase)

2. **Document ID** = **UID from Authentication**

3. **email** field matches Authentication email

---

## 🆘 Common Mistakes

❌ **Mistake 1:** Document ID doesn't match UID
✅ **Fix:** Copy UID from Authentication user and paste as Document ID

❌ **Mistake 2:** role field has wrong value or is capitalized
✅ **Fix:** Must be exactly `validator` or `scholar` (lowercase)

❌ **Mistake 3:** Field type is wrong
✅ **Fix:** All fields should be type "string"

❌ **Mistake 4:** Typo in email
✅ **Fix:** Copy/paste from the values above

---

## 📋 Quick Checklist

- [ ] Created valjeremy@grc.edu.ph in Authentication
- [ ] Created schojeremy@grc.edu.ph in Authentication
- [ ] Copied both UIDs
- [ ] Created users collection in Firestore
- [ ] Created validator document (UID as document ID)
- [ ] Added all 8 fields for validator (including role: "validator")
- [ ] Created scholar document (UID as document ID)
- [ ] Added all 9 fields for scholar (including role: "scholar")
- [ ] Tested login with both accounts

---

**Done! You should now be able to login!** 🎉
