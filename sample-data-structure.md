# Firebase Firestore Sample Data Structure

## Firestore Collections

Your Firebase Firestore should have the following collections:

### Users Collection (`users`)
```json
{
  "user1": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "active",
    "createdAt": 1640995200000
  },
  "user2": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+0987654321",
    "status": "active",
    "createdAt": 1640995200000
  }
}
```

### Appointments Collection (`appointments`)
```json
{
  "appointment1": {
    "name": "Ahmed Khan",
    "phone": "+1234567890",
    "type": "Medical Consultation",
    "description": "Need medical consultation for chronic condition",
    "status": "pending",
    "timestamp": 1640995200000
  },
  "appointment2": {
    "name": "Fatima Ali",
    "phone": "+0987654321",
    "type": "Financial Aid",
    "description": "Requesting financial assistance for education",
    "status": "approved",
    "timestamp": 1640995200000
  }
}
```

### Help Requests Collection (`help_requests`)
```json
{
  "help1": {
    "name": "Mohammed Hassan",
    "phone": "+1122334455",
    "type": "Food Assistance",
    "description": "Need food assistance for family of 4",
    "status": "pending",
    "timestamp": 1640995200000
  },
  "help2": {
    "name": "Aisha Rahman",
    "phone": "+5566778899",
    "type": "Shelter",
    "description": "Looking for temporary shelter",
    "status": "rejected",
    "timestamp": 1640995200000
  }
}
```

## Field Descriptions

### Users Collection
- **name**: Full name of the user
- **email**: User's email address
- **phone**: Contact phone number
- **status**: User status (active, inactive)
- **createdAt**: Unix timestamp when the user was created

### Appointments Collection
- **name**: Full name of the person requesting appointment
- **phone**: Contact phone number
- **type**: Type of appointment (e.g., Medical, Financial, Education)
- **description**: Detailed description of the appointment request
- **status**: Current status (pending, approved, rejected)
- **timestamp**: Unix timestamp when the request was created

### Help Requests Collection
- **name**: Full name of the person requesting help
- **phone**: Contact phone number
- **type**: Type of help needed (e.g., Food, Shelter, Medical, Financial)
- **description**: Detailed description of the help needed
- **status**: Current status (pending, approved, rejected)
- **timestamp**: Unix timestamp when the request was created

## Firestore Security Rules

For security, you can add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{document} {
      allow read, write: if request.auth != null;
    }
    match /appointments/{document} {
      allow read, write: if request.auth != null;
    }
    match /help_requests/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This ensures only authenticated users can read and write to the collections.

## Testing the Admin Panel

To test the admin panel functionality:

1. **Add sample data** to your Firestore collections using the structure above
2. **Login** to the admin panel
3. **Navigate** between Dashboard, Users, Book Appointment, and Request Help pages
4. **Test real-time updates** by modifying data in Firebase Console
5. **Test approve/reject** functionality on appointments and help requests

The admin panel will automatically display the data and update in real-time as you make changes in Firestore.

## Key Differences from Realtime Database

- **Collections**: Instead of nodes, Firestore uses collections
- **Documents**: Each record is a document with an auto-generated ID
- **Real-time listeners**: Uses `onSnapshot()` instead of `onValue()`
- **Updates**: Uses `updateDoc()` instead of `update()`
- **Queries**: More powerful querying capabilities available 