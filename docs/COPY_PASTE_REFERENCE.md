# 📋 COPY-PASTE REFERENCE - Setup Accounts

## JUST COPY THESE VALUES

### FOR FIREBASE AUTHENTICATION

**User 1 (Validator):**
```
valjeremy@grc.edu.ph
validator123
```

**User 2 (Scholar):**
```
schojeremy@grc.edu.ph
scholar123
```

---

### FOR FIRESTORE - VALIDATOR DOCUMENT

**Document ID:** [Paste validator UID from Authentication]

**Fields to add (all type: string):**

```
uid: [paste same UID]
email: valjeremy@grc.edu.ph
fullName: Jeremy Validator
name: Jeremy Validator
role: validator
status: active
department: Validation Office
position: Application Validator
```

---

### FOR FIRESTORE - SCHOLAR DOCUMENT

**Document ID:** [Paste scholar UID from Authentication]

**Fields to add (all type: string):**

```
uid: [paste same UID]
email: schojeremy@grc.edu.ph
fullName: Jeremy Scholar
name: Jeremy Scholar
role: scholar
status: active
course: BSIT
yearLevel: 3
department: IT Department
```

---

## QUICK STEPS

1. **Firebase Console** → Authentication → Users → Add user
   - Copy/paste validator email & password
   - Click Add
   - Copy the UID

2. **Firebase Console** → Authentication → Users → Add user
   - Copy/paste scholar email & password
   - Click Add
   - Copy the UID

3. **Firebase Console** → Firestore Database → users collection → Add document
   - Document ID: [paste validator UID]
   - Add 8 fields from "VALIDATOR DOCUMENT" above
   - Save

4. **Firebase Console** → Firestore Database → users collection → Add document
   - Document ID: [paste scholar UID]
   - Add 9 fields from "SCHOLAR DOCUMENT" above
   - Save

5. **Test** at pages/public/login.html:
   - valjeremy / validator123
   - schojeremy / scholar123

---

## DONE! ✅
