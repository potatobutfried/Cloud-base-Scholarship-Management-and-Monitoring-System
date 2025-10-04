# 🚨 Fix CORS Error - Quick Setup Guide

## ⚡ Immediate Solution

The CORS error happens because Firebase Storage needs proper security rules. Here's how to fix it:

### **Step 1: Apply Firebase Storage Rules**

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/scholarship-cloudbase/storage/rules
   ```

2. **Replace the existing rules with this:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Guest application documents
       match /scholarship_applications/guest/{applicationId}/{fileName} {
         // Allow guest uploads (no auth required, max 10MB)
         allow write: if resource == null && 
                         request.resource.size <= 10 * 1024 * 1024;
         
         // Admins can read
         allow read: if request.auth != null;
       }
       
       // Anonymous uploads (fallback)
       match /scholarship_applications/anonymous/{applicationId}/{fileName} {
         allow write: if resource == null && 
                         request.resource.size <= 10 * 1024 * 1024;
         allow read: if request.auth != null;
       }
       
       // Authenticated user uploads  
       match /scholarship_applications/{userId}/{applicationId}/{fileName} {
         allow write: if request.auth != null && 
                         request.auth.uid == userId &&
                         resource == null &&
                         request.resource.size <= 10 * 1024 * 1024;
         allow read: if request.auth != null;
       }
     }
   }
   ```

3. **Click "Publish"**

### **Step 2: Test Your Application**

1. **Make sure server is running:**
   ```bash
   python3 -m http.server 3000
   ```

2. **Open application:**
   ```
   http://localhost:3000/apply.html
   ```

3. **Fill out form and upload files** - Should work without CORS errors!

---

## 🎯 **Alternative: Use Development Rules (Temporary)**

If you need a quick fix for testing, use these permissive rules (ONLY for development):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING: Change back to secure rules before production!**

---

## ✅ **Your Server Status**

- ✅ Python HTTP server is running on port 3000
- ✅ Application is accessible at `http://localhost:3000/apply.html`  
- ✅ Firebase configuration is correct
- ⚠️ Firebase Storage rules need to be updated (see above)

---

## 🔧 **If Still Having Issues**

### Check Browser Console (F12):
- Look for specific Firebase error messages
- Check if files are being uploaded successfully
- Verify network requests are going to correct URLs

### Test with Simple Upload:
1. Go to `http://localhost:3000/apply.html`
2. Fill minimal form data
3. Upload one small PDF file
4. Check browser console for errors

### Verify Firebase Project:
- Ensure you're using project: `scholarship-cloudbase`
- Check if Firebase Storage is enabled
- Verify API keys are correct

---

## 🎉 **Expected Result**

After applying the Storage rules:
- ✅ No more CORS errors
- ✅ Files upload to Firebase Storage successfully  
- ✅ Guest submissions work without login
- ✅ Applications save to Firestore database

**Go apply the Firebase Storage rules now!**