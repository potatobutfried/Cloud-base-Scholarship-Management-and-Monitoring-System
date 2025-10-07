# Validator Dashboard - Firebase Integration Guide

## Overview
The Validator Dashboard is now fully integrated with Firebase Firestore. It automatically loads scholarship applications from your `scholarship_applications` collection and allows validators to approve, reject, request resubmission, or delete applications in real-time.

## Application Workflow

```
Applicant submits form → status: "pending" 
                              ↓
                    Validator reviews
                              ↓
        ┌─────────────────────┼─────────────────────┬──────────────┐
        ↓                     ↓                     ↓              ↓
  APPROVE                 REJECT              RESUBMISSION      DELETE
status: "approved"    status: "rejected"   status: "resubmission"  (removed)
```

## What You Need to Do

### 1. **Ensure Applicant Form Saves to Firestore Correctly**

When applicants submit their application, make sure your form saves to the `scholarship_applications` collection with this structure:

```javascript
{
  // Required fields
  fullName: "Juan Dela Cruz",           // or 'name'
  email: "juan@email.com",
  course: "Computer Science",
  yearLevel: "3rd Year",
  status: "pending",                    // IMPORTANT: Set to "pending" by default
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  
  // Optional but recommended
  phoneNumber: "+63 912 345 6789",
  address: "Manila, Philippines",
  gpa: "3.5",
  
  // Documents (URLs from Firebase Storage)
  documents: {
    gradeslip: "https://firebasestorage.googleapis.com/.../gradeslip.pdf",
    certificateOfEnrollment: "https://firebasestorage.googleapis.com/.../coe.pdf",
    certificateOfCompletion: "https://firebasestorage.googleapis.com/.../coc.pdf"
    // Add more document fields as needed
  }
}
```

**Critical**: Make sure `status: "pending"` is set when the applicant submits their form. This ensures they appear in the validator's pending queue.

### 2. **Document Upload Structure**

Your applicant form should upload documents to Firebase Storage and save the download URLs in the `documents` object. Example:

```javascript
// When applicant uploads a file
const storageRef = firebase.storage().ref(`applications/${userId}/gradeslip.pdf`);
await storageRef.put(file);
const downloadURL = await storageRef.getDownloadURL();

// Save to Firestore
await firebase.firestore().collection('scholarship_applications').add({
  // ... other fields
  documents: {
    gradeslip: downloadURL,
    // ... other documents
  }
});
```

### 3. **Firestore Security Rules**

Update your Firestore security rules to allow validators to read and update applications:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Scholarship applications
    match /scholarship_applications/{applicationId} {
      // Allow applicants to create their own applications
      allow create: if request.auth != null;
      
      // Allow applicants to read their own applications
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      // Allow validators/admins to read and update all applications
      allow read, update: if request.auth != null && 
                            (request.auth.token.role == 'validator' || 
                             request.auth.token.role == 'admin');
      
      // Allow validators/admins to delete applications
      allow delete: if request.auth != null && 
                       (request.auth.token.role == 'validator' || 
                        request.auth.token.role == 'admin');
    }
    
    // Validator collections (for organizing approved/rejected/resubmission)
    match /validator/{status} {
      allow read, write: if request.auth != null && 
                           (request.auth.token.role == 'validator' || 
                            request.auth.token.role == 'admin');
    }
  }
}
```

**Note**: If you're not using custom claims (roles), you can simplify to:

```javascript
match /scholarship_applications/{applicationId} {
  allow read, write: if request.auth != null;
}
```

### 4. **Firebase Storage Security Rules**

Allow validators to read uploaded documents:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /applications/{userId}/{allPaths=**} {
      // Allow users to upload their own files
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow validators/admins to read all files
      allow read: if request.auth != null;
      
      // Allow validators/admins to delete files
      allow delete: if request.auth != null && 
                       (request.auth.token.role == 'validator' || 
                        request.auth.token.role == 'admin');
    }
  }
}
```

### 5. **User Authentication**

Make sure validators are authenticated before accessing the validator dashboard. The page will:
- Automatically redirect to login if not authenticated
- Display the validator's email in the header
- Load applications only after successful authentication

### 6. **Testing the Integration**

#### Step 1: Create Test Applications
Using the Firebase Console or your applicant form, create a few test applications:

```javascript
// In Firebase Console → Firestore → scholarship_applications → Add Document
{
  fullName: "Test Applicant",
  email: "test@email.com",
  course: "Computer Science",
  yearLevel: "2nd Year",
  status: "pending",
  createdAt: <current timestamp>,
  documents: {
    gradeslip: "https://example.com/test.pdf"
  }
}
```

#### Step 2: Login as Validator
1. Navigate to `/pages/public/login.html`
2. Login with validator credentials
3. Navigate to `/pages/admin/validator.html`

#### Step 3: Verify Features
- [ ] Applications load automatically
- [ ] Statistics show correct counts
- [ ] Can click stat cards to filter (All, Pending, Approved, Rejected)
- [ ] Can navigate between applications using prev/next buttons
- [ ] Can view uploaded documents
- [ ] Can approve an application (moves to "approved" status)
- [ ] Can reject an application (opens modal, saves rejection reason)
- [ ] Can request resubmission (moves to "resubmission" status)
- [ ] Can delete an application (removes from Firestore)
- [ ] Real-time updates (if you change status in Firebase Console, it updates on page)

## Status Flow Details

### Pending → Approved
When you click "APPROVE":
1. Updates Firestore: `status: 'approved'`
2. Adds timestamp: `approvedDate`
3. Records who approved: `approvedBy`
4. Application moves to "Approved" filter
5. Decrements pending count, increments approved count

### Pending → Rejected
When you click "REJECT" and confirm:
1. Opens modal to select rejection category and reason
2. Updates Firestore: `status: 'rejected'`
3. Adds: `rejectedDate`, `rejectionReason`, `rejectionCategory`, `rejectedBy`
4. Application moves to "Rejected" filter
5. Decrements pending count, increments rejected count

### Pending → Resubmission
When you click "RESUBMIT" and confirm:
1. Opens modal to enter resubmission reason
2. Updates Firestore: `status: 'resubmission'`
3. Adds: `resubmissionDate`, `resubmissionReason`, `requestedBy`
4. Application stays visible (you can create a separate filter for resubmission status)
5. Applicant can see this status and resubmit documents

### Delete
When you click "DELETE" and confirm:
1. Permanently removes document from Firestore
2. Cannot be undone
3. Updates statistics immediately

## Real-Time Updates

The validator dashboard uses `onSnapshot` for real-time updates. This means:
- If another validator approves/rejects an application, you'll see it instantly
- If an applicant submits a new application, it appears immediately
- Statistics update in real-time
- No need to refresh the page

## Document Viewer

The integrated document viewer:
- Automatically detects file type (image, PDF, other)
- For images: Displays inline preview
- For PDFs: Embeds PDF viewer
- For other files: Provides download link
- Loads files from Firebase Storage using the URLs saved in Firestore

## Customization

### Adding More Document Types
In your applicant form, just add more fields to the `documents` object:

```javascript
documents: {
  gradeslip: "url...",
  certificateOfEnrollment: "url...",
  certificateOfCompletion: "url...",
  birthCertificate: "url...",      // Add new document types
  incomeStatement: "url...",        // as needed
  barangayClearance: "url..."
}
```

The validator dashboard will automatically display all documents.

### Filtering by Resubmission Status
If you want a dedicated "Resubmission" stat card, you can add it to the stats row in the HTML and update the JavaScript.

## Troubleshooting

### Applications Not Loading
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure Firestore rules allow read access
4. Confirm user is authenticated
5. Check that applications have `status: "pending"` field

### Documents Not Showing
1. Verify `documents` object exists in Firestore
2. Check that URLs are valid Firebase Storage URLs
3. Ensure Storage security rules allow read access
4. Check browser console for CORS errors

### Authentication Redirect Loop
1. Verify login page path is correct: `../../pages/public/login.html`
2. Ensure authentication is working in your login page
3. Check that Firebase Auth is properly configured

### Can't Update Application Status
1. Verify Firestore security rules allow `update` operation
2. Check browser console for permission errors
3. Ensure user has proper role/permissions

## Next Steps

1. **Update your applicant form** to save applications with `status: "pending"`
2. **Test the workflow** with sample data
3. **Configure Firestore security rules** based on your authentication setup
4. **Add email notifications** (optional) when status changes
5. **Create applicant dashboard** to show their application status

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firestore data structure matches the expected format
3. Test with Firebase Console to ensure rules are working
4. Ensure all Firebase services (Auth, Firestore, Storage) are enabled in your Firebase project

---

**Last Updated**: October 4, 2025
