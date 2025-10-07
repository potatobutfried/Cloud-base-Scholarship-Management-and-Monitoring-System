# Application Submission Flow - Complete Integration Guide

## Overview
This document explains how scholarship applications flow from submission to validator review, matching your Firebase structure exactly as shown in the screenshots.

## 🔄 Complete Workflow

```
Student Submits Form (apply.html)
          ↓
    Saves to Firestore:
    1. scholarship_applications/{docId}
    2. validator/pending/{docId}/info/{docId}
          ↓
    Validator Dashboard Loads
          ↓
    Validator Reviews (pending status)
          ↓
    Actions Available:
    - Approve → validator/approved
    - Reject → validator/reject  
    - Resubmission → validator/resubmission
    - Delete → Removes completely
```

## 📊 Firestore Structure (Matches Your Screenshots)

### Main Application Storage
```
scholarship_applications/
  └── {auto-generated-doc-id}/
      ├── applicationId: "APP-1234567890-123"
      ├── fullName: "Juan Dela Cruz"
      ├── name: "Juan Dela Cruz"
      ├── email: "juan@email.com"
      ├── course: "Computer Science"
      ├── yearLevel: "3rd Year"
      ├── status: "pending"  ← CRITICAL: lowercase for validator filters
      ├── createdAt: timestamp
      ├── submittedAt: timestamp
      ├── documents: {
      │   ├── gradeslip: { fileId, viewUrl, downloadUrl, ... }
      │   ├── certificateOfEnrollment: { ... }
      │   └── certificateOfCompletion: { ... }
      │ }
      ├── applicantInfo: { ... }
      ├── applicationStatus: { ... }
      └── metadata: { ... }
```

### Validator Organization (New - Matches Screenshot)
```
validator/
  ├── pending/
  │   └── {same-doc-id-from-scholarship_applications}/
  │       └── info/
  │           └── {same-doc-id}/
  │               ├── date: timestamp
  │               ├── applicationId: "APP-1234567890-123"
  │               ├── scholarshipApplicationRef: "{doc-id}"
  │               ├── status: "pending"
  │               ├── fullName: "Juan Dela Cruz"
  │               ├── email: "juan@email.com"
  │               ├── course: "Computer Science"
  │               └── createdAt: timestamp
  │
  ├── approved/
  │   └── {doc-id}/  (moved here when approved)
  │
  ├── reject/
  │   └── {doc-id}/  (moved here when rejected)
  │
  └── resubmission/
      └── {doc-id}/  (moved here when resubmission requested)
```

## ✅ What Was Changed in apply.html

### 1. Updated Firebase Imports
Added `setDoc` and `Timestamp` for proper Firestore operations:
```javascript
import { getFirestore, collection, addDoc, doc, setDoc, Timestamp } 
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
```

### 2. Updated Application Data Structure
Now includes fields the validator dashboard expects:
```javascript
const applicationData = {
  // NEW: Top-level fields for validator dashboard
  fullName: "First Last",
  name: "First Last",
  email: "email@example.com",
  course: "Computer Science",
  yearLevel: "3rd Year",
  status: "pending",  // ← MUST be lowercase "pending"
  createdAt: Timestamp.now(),
  
  // Existing nested structure (preserved)
  applicantInfo: { ... },
  documents: { ... },
  applicationStatus: { ... }
}
```

### 3. Dual-Write on Submission
When student submits application:

**Step 1: Save to main collection**
```javascript
const docRef = await addDoc(
  collection(db, 'scholarship_applications'), 
  applicationData
);
```

**Step 2: Add reference to validator/pending**
```javascript
const pendingInfoRef = doc(
  db, 
  'validator', 
  'pending', 
  docRef.id,      // Same doc ID
  'info', 
  docRef.id       // Same doc ID again
);

await setDoc(pendingInfoRef, {
  date: Timestamp.now(),
  applicationId: applicationData.applicationId,
  scholarshipApplicationRef: docRef.id,
  status: 'pending',
  fullName: applicationData.fullName,
  email: applicationData.email,
  course: applicationData.course,
  createdAt: Timestamp.now()
});
```

This creates the exact structure you showed in the screenshot:
```
validator > pending > {docId} > info > {docId with date field}
```

## 🎯 Critical Points

### 1. Status Field Format
**MUST be lowercase `"pending"`** - The validator dashboard filters use:
```javascript
applicants = allApplicants.filter(a => a.status === 'pending');
```

### 2. Document ID Matching
The same document ID is used in:
- `scholarship_applications/{docId}`
- `validator/pending/{docId}/info/{docId}`

This allows the validator to:
1. See the application in the pending queue
2. Click to load full details from `scholarship_applications`
3. Update the main document when approving/rejecting

### 3. Required Fields for Validator Dashboard
The validator expects these top-level fields:
- ✅ `fullName` or `name`
- ✅ `email`
- ✅ `course`
- ✅ `yearLevel`
- ✅ `status` (lowercase: 'pending', 'approved', 'rejected', 'resubmission')
- ✅ `createdAt` (Timestamp)
- ✅ `documents` (object with file URLs)

## 🧪 Testing the Integration

### Test Case 1: Submit New Application
1. Open `pages/public/apply.html`
2. Fill out the form completely
3. Upload all required documents
4. Click "Submit Application"
5. **Expected Result:**
   - ✅ Success message appears
   - ✅ Application ID displayed
   - ✅ Document saved to `scholarship_applications`
   - ✅ Reference created in `validator/pending`

### Test Case 2: Verify in Firebase Console
After submission, check Firebase Console:

**Check 1: scholarship_applications**
```
Firestore > scholarship_applications > [Your new doc]
Should see:
✓ status: "pending"
✓ fullName: "Your Name"
✓ email: "your@email.com"
✓ documents: { object with file URLs }
✓ createdAt: [timestamp]
```

**Check 2: validator/pending**
```
Firestore > validator > pending > [same doc ID] > info > [same doc ID]
Should see:
✓ date: [timestamp]
✓ status: "pending"
✓ scholarshipApplicationRef: [doc ID]
✓ fullName: "Your Name"
```

### Test Case 3: Validator Dashboard
1. Login as validator
2. Navigate to `pages/admin/validator.html`
3. **Expected Result:**
   - ✅ Application appears in "Pending Review" (count increases)
   - ✅ Can click on application to view details
   - ✅ Documents are viewable
   - ✅ Can approve/reject/request resubmission

## 🔧 Firestore Security Rules

Update your rules to allow the dual-write pattern:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Scholarship applications - main storage
    match /scholarship_applications/{applicationId} {
      // Allow anyone to create (guest submissions)
      allow create: if true;
      
      // Allow users to read their own applications
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || 
                      request.auth.token.role == 'validator' ||
                      request.auth.token.role == 'admin');
      
      // Allow validators/admins to update and delete
      allow update, delete: if request.auth != null && 
                              (request.auth.token.role == 'validator' || 
                               request.auth.token.role == 'admin');
    }
    
    // Validator collections
    match /validator/{status}/{applicationId}/{subcollection=**} {
      // Allow creation when applications are submitted
      allow create: if true;
      
      // Allow validators/admins to read, update, delete
      allow read, update, delete: if request.auth != null && 
                                     (request.auth.token.role == 'validator' || 
                                      request.auth.token.role == 'admin');
    }
  }
}
```

**Simplified version (if not using custom claims):**
```javascript
match /scholarship_applications/{applicationId} {
  allow create: if true;  // Anyone can submit
  allow read, update, delete: if request.auth != null;  // Authenticated users can manage
}

match /validator/{status}/{applicationId}/{subcollection=**} {
  allow create: if true;  // Allow submission to create
  allow read, update, delete: if request.auth != null;  // Authenticated validators
}
```

## 🔄 Status Change Flow

When validator takes action, the validator dashboard:

### Approve
1. Updates `scholarship_applications/{docId}`:
   - `status: 'approved'`
   - `approvedDate: timestamp`
   - `approvedBy: validator@email.com`
2. Moves reference from `validator/pending` to `validator/approved`

### Reject
1. Updates `scholarship_applications/{docId}`:
   - `status: 'rejected'`
   - `rejectedDate: timestamp`
   - `rejectionReason: "..."`
   - `rejectionCategory: "..."`
2. Moves reference from `validator/pending` to `validator/reject`

### Resubmission
1. Updates `scholarship_applications/{docId}`:
   - `status: 'resubmission'`
   - `resubmissionDate: timestamp`
   - `resubmissionReason: "..."`
2. Moves reference from `validator/pending` to `validator/resubmission`

## 🐛 Troubleshooting

### Applications Not Appearing in Validator Dashboard

**Problem:** Submitted application doesn't show in pending queue

**Solutions:**
1. ✅ Check `status` field is lowercase `"pending"` (not "Pending")
2. ✅ Verify `createdAt` is a Timestamp, not Date string
3. ✅ Check Firestore security rules allow read access
4. ✅ Verify document was created in `scholarship_applications`
5. ✅ Check browser console for errors

### Permission Denied on Submission

**Problem:** Error: "permission-denied" when submitting

**Solutions:**
1. ✅ Update Firestore rules to `allow create: if true;` for guest submissions
2. ✅ Check that both collections have proper write permissions
3. ✅ Verify Firebase is initialized correctly

### Documents Not Viewable

**Problem:** File viewer shows error

**Solutions:**
1. ✅ Check `documents` object contains valid URLs
2. ✅ Verify Storage security rules allow read access
3. ✅ Ensure files were uploaded successfully (check console logs)

## 📝 Summary Checklist

Before going live, verify:

- [ ] `apply.html` saves to `scholarship_applications` with `status: "pending"`
- [ ] `apply.html` creates reference in `validator/pending/{docId}/info/{docId}`
- [ ] Firestore rules allow guest submissions (`allow create: if true`)
- [ ] Firestore rules allow validators to read/update applications
- [ ] Storage rules allow validators to read uploaded documents
- [ ] Validator dashboard loads applications from `scholarship_applications`
- [ ] Validator can approve/reject/request resubmission
- [ ] Status changes update both main document and validator collections

## 🎓 Next Steps

1. **Test the complete flow** with a sample application
2. **Verify in Firebase Console** that both collections are populated
3. **Test validator actions** (approve, reject, resubmission)
4. **Set up email notifications** (optional) when status changes
5. **Create student dashboard** to track application status

---

**Last Updated:** October 4, 2025  
**Integration Status:** ✅ Complete - Ready for Testing
