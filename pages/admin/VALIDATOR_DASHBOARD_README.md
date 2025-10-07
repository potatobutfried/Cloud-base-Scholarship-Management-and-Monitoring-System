# 🎯 Validator Dashboard - User Guide

## Overview
The Validator Dashboard is a fully functional, standalone application for validating scholarship applications. It uses **localStorage** for data persistence, meaning no database is required.

## ✨ Features

### 1. **Application Validation**
- View pending applications one at a time
- See detailed applicant information
- Review submitted documents with zoom functionality
- Accept or reject applications with detailed reasons

### 2. **History Tracking**
- View all accepted applications
- View all rejected applications with rejection reasons
- Track validation dates and times

### 3. **Profile Management**
- Update profile picture
- Change email address
- Change password
- Secure profile settings

### 4. **Slot Management**
- Track available scholarship slots
- Automatically decrements when accepting applications
- Visual slot counter

## 🚀 How to Use

### Getting Started
1. Open `validitordash.html` in your browser
2. Sample applications are automatically loaded on first use
3. Default login credentials:
   - Email: `validator@example.com`
   - Password: `password123`

### Validating Applications

1. **View Application**
   - Click the "VALIDATE" button on the main card
   - Review all applicant details
   - Click on document thumbnails to view full size

2. **Accept Application**
   - Review the applicant information
   - Click the "✓ Accept" button
   - Available slots will decrease by 1
   - Application moves to "Accepted" history

3. **Reject Application**
   - Click the "✗ Reject" button
   - Select invalid documents (if applicable)
   - Choose rejection category
   - Provide detailed remarks (required)
   - Submit rejection form
   - Application moves to "Rejected" history

### View History
- Click the history icon (🕒) in the top section
- View separate lists for accepted and rejected applications
- See validation dates, times, and rejection reasons

### Manage Profile
- Click the hamburger menu (☰) in the header
- Select "Profile Settings"
- Update your profile picture, email, or password

## 💾 Data Storage

All data is stored in **browser localStorage**:

| Storage Key | Description |
|------------|-------------|
| `validator_applicants` | Pending applications queue |
| `validator_validated` | Accepted applications |
| `validator_rejected` | Rejected applications |
| `validator_profile` | User profile settings |
| `validator_current_index` | Current position in queue |
| `validator_slots` | Available scholarship slots |

### Reset Data
To reset all data and start fresh:
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

## 📊 Sample Data

The system comes with 3 sample applications:

1. **APL-2025-001** - Juan Dela Cruz
   - Course: BS Computer Science
   - GPA: 3.75
   - Type: Academic Excellence

2. **APL-2025-002** - Maria Santos
   - Course: BS Information Technology
   - GPA: 3.85
   - Type: Leadership Grant

3. **APL-2025-003** - Pedro Garcia
   - Course: BS Business Administration
   - GPA: 3.90
   - Type: Merit-Based

## 🔧 Customization

### Add More Sample Applications
Edit the JavaScript section and add to `sampleApplicants` array:

```javascript
{
    id: 'APL-2025-004',
    name: 'Your Name',
    email: 'email@example.com',
    studentId: '2024-00126',
    course: 'Your Course',
    yearLevel: '2nd Year',
    gpa: '3.80',
    scholarshipType: 'Type',
    contactNumber: '09XXXXXXXXX',
    address: 'Your Address',
    documents: {
        gradeslip: 'image_url',
        coc: 'image_url',
        cor: 'image_url',
        id: 'image_url'
    },
    dateApplied: new Date().toLocaleDateString()
}
```

### Change Available Slots
Modify the initial slots in the initialization:
```javascript
localStorage.setItem(STORAGE_KEYS.AVAILABLE_SLOTS, '100'); // Change 50 to your number
```

### Customize Colors
Edit the CSS section to change the color scheme:
```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

## 🎨 UI Components

### Dashboard Header
- Profile picture and email display
- Hamburger menu for navigation
- Responsive design

### Available Slots Section
- Real-time slot counter
- History button (🕒)

### Application Card
- Applicant ID display
- Remaining count badge
- Validate button

### Modals
1. **Applicant Details Modal** - Full applicant information
2. **Rejection Modal** - Rejection form
3. **History Modal** - Validation history
4. **Profile Modal** - Profile settings
5. **Image Zoom Modal** - Document preview

## 📱 Responsive Design

The dashboard is fully responsive:
- Desktop: Full layout with side-by-side grids
- Tablet: Stacked layout
- Mobile: Single column with touch-friendly buttons

## 🔒 Security Features

- Password protected profile settings
- Secure localStorage data
- Validation for all form inputs
- Required remarks for rejections

## 🐛 Troubleshooting

### No Applicants Showing
- Check browser console (F12)
- Clear localStorage and reload
- Ensure JavaScript is enabled

### Images Not Loading
- Sample images use placeholder service
- Replace with actual image URLs
- Check internet connection

### Data Not Persisting
- Ensure localStorage is enabled
- Check browser privacy settings
- Try a different browser

## 🎯 Best Practices

1. **Always provide detailed rejection remarks**
2. **Review all documents before accepting**
3. **Check history regularly for auditing**
4. **Update profile settings on first use**
5. **Monitor available slots**

## 🔄 Future Enhancements

Potential features to add:
- Export history to CSV/PDF
- Search and filter applications
- Bulk validation
- Email notifications
- Integration with backend API
- Advanced analytics dashboard

## 📞 Support

For issues or questions:
1. Check this README
2. Review the code comments
3. Open browser console for errors
4. Contact system administrator

---

**Version:** 1.0.0  
**Last Updated:** October 4, 2025  
**Status:** Fully Functional (No Database Required)
