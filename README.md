# Firebase Firestore Sample Data Generator

## 🚨 IMPORTANT: Fixing "Missing or insufficient permissions" Error

The error occurs because Firebase Firestore has security rules that prevent unauthorized access. Follow these steps to fix it:

### Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **scholarship-cloudbase**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **"Rules"** tab
5. Replace the existing rules with one of the options below:

#### Option A: For Development/Testing (Easiest)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
⚠️ **Warning**: This allows anyone to read/write your database. Only use for testing!

#### Option B: With Authentication (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
✅ This requires users to be authenticated before accessing data.

#### Option C: Role-Based Access (Production Ready)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scholarship_applications/{applicationId} {
      allow read, write: if request.auth != null;
    }
    
    match /scholarship_programs/{programId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 2: Enable Authentication (If using Option B or C)

1. In Firebase Console, go to **Authentication**
2. Click on **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Anonymous"** authentication
5. Save the changes

### Step 3: Test Your Setup

1. Open `firebase-test.html` in your browser
2. If using authentication rules, click **"Sign In Anonymously"**
3. Try adding sample data using the buttons

## 📁 Files Included

### `firebase-test.html`
- Interactive web interface for testing Firebase integration
- Includes authentication support
- Easy-to-use buttons for adding sample data
- Real-time logging and status updates

### `firebase-sample-data.js`
- Node.js compatible script for programmatic data generation
- Exports functions for use in other projects
- Comprehensive sample data generation

### `package.json`
- Node.js project configuration
- Includes Firebase dependencies
- Scripts for running and serving the project

## 🚀 Getting Started

### Method 1: Web Interface (Recommended)
1. Open `firebase-test.html` in your web browser
2. Follow the authentication steps if required
3. Click buttons to add sample data

### Method 2: Node.js Script
```bash
# Install dependencies
npm install

# Run the script
npm start

# Or serve the web interface
npm run dev
```

### Method 3: Local Server
```bash
# Install a simple HTTP server
npm install -g http-server

# Serve the files
http-server . -p 3000 -o
```

## 📊 Sample Data Collections

The generator creates three main collections:

### 1. `scholarship_applications`
- Student personal information
- Academic records (GPA, university, major)
- Scholarship application details
- Application status and timestamps

### 2. `scholarship_programs`
- Scholarship program details
- Funding information
- Eligibility requirements
- Application deadlines

### 3. `users`
- User accounts (administrators, reviewers, students)
- Role-based permissions
- Contact information
- Activity timestamps

## 🔧 Customization

### Adding More Sample Data
Modify the arrays in the JavaScript files:
- `firstNames`, `lastNames`: Expand the name lists
- `universities`: Add more institutions
- `majors`: Include additional academic programs
- `scholarshipTypes`: Create new scholarship categories

### Adjusting Data Volume
Change the count parameters in function calls:
```javascript
addSampleApplications(50);  // Add 50 applications
addSamplePrograms(20);      // Add 20 programs
addSampleUsers(10);         // Add 10 users
```

## 🔒 Security Best Practices

1. **Never use `allow read, write: if true;` in production**
2. **Always implement proper authentication**
3. **Use role-based access control for sensitive data**
4. **Regularly audit your security rules**
5. **Enable Firebase Security Rules unit testing**

## 🐛 Common Issues & Solutions

### Issue: "Firebase project not found"
**Solution**: Check your `projectId` in `firebaseConfig`

### Issue: "Network request failed"
**Solution**: 
- Check internet connection
- Verify Firebase project is active
- Ensure Firestore is enabled in Firebase Console

### Issue: "Permission denied"
**Solution**: Update Firestore security rules as described above

### Issue: Authentication not working
**Solution**: 
- Enable Anonymous authentication in Firebase Console
- Clear browser cache and cookies
- Check browser console for detailed errors

## 📱 Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this code in your projects.

---

**Happy coding! 🎓✨**