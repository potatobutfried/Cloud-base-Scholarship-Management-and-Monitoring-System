# Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for your scholarship management system instead of using Firebase Storage.

## 🎯 Benefits of Google Drive Integration

- **Free Storage**: 15GB free storage per Google account
- **Familiar Interface**: Users familiar with Google Drive
- **Easy Sharing**: Built-in sharing and collaboration features
- **No Firebase Storage Costs**: Avoid Firebase Storage pricing
- **Better Organization**: Folder-based file organization
- **Direct Access**: Files accessible directly in Google Drive

## 📋 Setup Steps

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Note your project ID

### Step 2: Enable Google Drive API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click on "Google Drive API" and click **Enable**

### Step 3: Create Credentials

#### Option A: API Key (Simpler, but limited)
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API Key**
3. Copy the API key
4. Click **Restrict Key** and add these restrictions:
   - **API restrictions**: Select "Google Drive API"
   - **Website restrictions**: Add your domain(s)

#### Option B: OAuth 2.0 (Recommended for production)
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**
3. If prompted, configure OAuth consent screen first:
   - User Type: External
   - App name: "GRC-MLALAF Scholarship System"
   - Add your email as developer contact
4. For OAuth Client ID:
   - Application type: **Web application**
   - Name: "Scholarship Management Web Client"
   - Authorized JavaScript origins: Add your website URLs
     - `http://localhost:3000` (for testing)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs: (leave empty for this use case)
5. Copy the **Client ID**

### Step 4: Configure the Application

1. Open `google-drive-config.js`
2. Replace the placeholder values:

```javascript
export const GOOGLE_DRIVE_CONFIG = {
    API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
    CLIENT_ID: 'YOUR_ACTUAL_CLIENT_ID_HERE',
    // ... rest of config
};
```

### Step 5: Update Google Drive Settings

1. Go to [Google Drive Settings](https://drive.google.com/drive/settings)
2. Under "General", check:
   - ✅ "Convert uploaded files to Google Docs editor format" (optional)
   - ✅ "Create a Google Photos folder"

## 🔧 Configuration Options

### Folder Structure
The system will create this structure in Google Drive:
```
📁 GRC-MLALAF-Scholarship-Applications/
├── 📁 Guest-Applications/
│   ├── 📁 APP-2024-001/
│   │   ├── 📄 form137_document.pdf
│   │   └── 📄 recommendation_letter.pdf
│   └── 📁 APP-2024-002/
└── 📁 Authenticated-Applications/
    └── 📁 APP-2024-003/
```

### Permissions
Files are automatically set to:
- **Viewable by anyone with link** (for admin review)
- **Organized in application-specific folders**
- **10MB maximum file size**

## 🚀 Testing the Integration

1. Start your local server:
```bash
python3 -m http.server 3000
```

2. Open the test page:
```
http://localhost:3000/test-google-drive.html
```

3. Test the integration:
   - Click "Test Google Drive Connection"
   - Click "Test File Upload"
   - Check your Google Drive for the test folder

## 🔒 Security Considerations

### API Key Security
- ✅ Restrict API key to your domain
- ✅ Use environment variables in production
- ✅ Monitor API usage in Google Cloud Console

### File Access Control
- Files are viewable by anyone with the link
- Only admins should have access to the application folders
- Consider implementing additional access controls

### Rate Limits
- Google Drive API has rate limits
- Implement retry logic for failed uploads
- Monitor quota usage in Google Cloud Console

## 🛠️ Alternative Approaches

### Option 1: Service Account (Server-side)
For better security, implement server-side uploads:

1. Create a service account in Google Cloud Console
2. Download the service account key (JSON file)
3. Use server-side code to handle uploads
4. Frontend sends files to your server, server uploads to Google Drive

### Option 2: Hybrid Approach
- Keep Firebase for small files (thumbnails, profiles)
- Use Google Drive for large documents
- Maintain references in Firestore

## 📊 Monitoring and Analytics

### Google Cloud Console
- Monitor API usage: **APIs & Services** > **Dashboard**
- Check quotas: **IAM & Admin** > **Quotas**
- View logs: **Logging** > **Logs Explorer**

### Application Analytics
Track in your application:
- Upload success/failure rates
- File sizes and types
- User experience metrics

## 🆘 Troubleshooting

### Common Issues

#### "API key not valid"
- Check API key restrictions
- Ensure Google Drive API is enabled
- Verify domain restrictions

#### "Access denied"
- User needs to sign in to Google Drive
- Check OAuth 2.0 setup
- Verify scopes are correct

#### "Quota exceeded"
- Monitor usage in Google Cloud Console
- Implement caching strategies
- Consider upgrading quota limits

#### Files not appearing
- Check folder permissions
- Verify parent folder IDs
- Check for API rate limiting

### Debug Mode
Add to your application for debugging:

```javascript
// Enable debug mode
localStorage.setItem('drive_debug', 'true');

// Check debug logs in console
console.log('Drive Service Status:', driveService);
```

## 📱 Mobile Considerations

- Google Drive API works on mobile browsers
- Consider file size limits on mobile data
- Test upload functionality on different devices
- Implement progressive upload for large files

## 💰 Cost Comparison

### Google Drive (Free Tier)
- 15GB free storage per account
- Shared with Gmail and Google Photos
- Additional storage: $1.99/month for 100GB

### Firebase Storage
- 5GB free storage
- $0.026/GB/month after free tier
- Additional bandwidth costs

For most scholarship applications, Google Drive's free tier should be sufficient.

## 🔄 Migration from Firebase Storage

If you're migrating from Firebase Storage:

1. Export existing files from Firebase
2. Upload to Google Drive using the API
3. Update Firestore documents with new Google Drive URLs
4. Test thoroughly before switching

## ✅ Production Checklist

- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] Credentials configured (API Key + OAuth 2.0)
- [ ] Domain restrictions applied
- [ ] Test uploads working
- [ ] Folder structure created
- [ ] File permissions verified
- [ ] Error handling implemented
- [ ] Rate limiting considered
- [ ] Monitoring set up
- [ ] Backup strategy planned

---

## 🎉 You're Ready!

Once configured, your scholarship application system will:
- Store all files in Google Drive
- Organize files by application
- Allow admin access to all documents
- Provide direct links for file viewing
- Scale with Google's infrastructure

Need help? Check the troubleshooting section or open an issue!