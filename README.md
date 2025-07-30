# Saylani Admin Panel

A comprehensive responsive admin panel built with React, Tailwind CSS, and Firebase Realtime Database for managing appointments and help requests.

## Features

- 🔐 **Secure Authentication**: Firebase email/password authentication
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔄 **Real-time Data**: Live updates from Firebase Realtime Database
- 📊 **Dashboard Analytics**: Overview cards with real-time statistics
- 📋 **Appointment Management**: View and manage all appointment requests
- 🆘 **Help Request Management**: View and manage all help requests
- ✅ **Status Management**: Approve/Reject functionality for both tables
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- 🔄 **Auto-redirect**: Automatic navigation to admin panel on successful login

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Realtime Database enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saylaniadmin
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Update `src/firebase.js` with your Firebase configuration
   - Enable Realtime Database in your Firebase console
   - Set up the database structure as shown in `sample-data-structure.md`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Admin Login

1. Navigate to the login page (default route `/`)
2. Enter your admin email and password
3. Click "Sign In" to authenticate
4. Upon successful login, you'll be redirected to the admin dashboard

### Admin Panel Features

#### Dashboard (`/admin/dashboard`)
- **Real-time Statistics**: Shows total requests, approved, pending, and rejected counts
- **Data Sources**: Pulls data from both `/appointments` and `/requestHelp` nodes
- **Live Updates**: Automatically updates when data changes in Firebase

#### Book Appointment (`/admin/appointments`)
- **Data Display**: Shows all appointments from `/appointments` node
- **Columns**: Name, Phone, Type, Description, Status, Actions
- **Status Management**: Approve/Reject buttons that update Firebase in real-time
- **Statistics**: Shows total, pending, and approved appointment counts

#### Request Help (`/admin/help-requests`)
- **Data Display**: Shows all help requests from `/requestHelp` node
- **Same Format**: Identical table structure to appointments
- **Status Management**: Approve/Reject functionality
- **Statistics**: Shows total, pending, and approved request counts

## Firebase Configuration

The Firebase configuration is set up in `src/firebase.js` with:

- **Authentication**: Email/Password enabled
- **Realtime Database**: Connected for live data updates
- **Database URL**: Configured for your Firebase project

### Database Structure

Your Firebase Realtime Database should have these nodes:
- `/appointments` - For appointment requests
- `/requestHelp` - For help requests

See `sample-data-structure.md` for detailed structure and sample data.

## Project Structure

```
src/
├── components/
│   ├── AdminLogin.jsx      # Login form component
│   ├── AdminPanel.jsx      # Main admin panel layout
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── Dashboard.jsx       # Dashboard with statistics
│   ├── DashboardCard.jsx   # Reusable stat cards
│   ├── Appointments.jsx    # Appointment management
│   └── HelpRequests.jsx    # Help request management
├── firebase.js             # Firebase configuration
├── App.jsx                 # Main app with routing
├── main.jsx                # App entry point
└── index.css               # Tailwind CSS imports
```

## Technologies Used

- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Firebase** - Authentication & Realtime Database
- **React Router** - Navigation
- **Vite** - Build tool

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Operations

The admin panel performs these Firebase operations:

1. **Read Operations**:
   - `onValue()` - Real-time data listening
   - Fetches data from `/appointments` and `/requestHelp`

2. **Write Operations**:
   - `update()` - Status updates for approve/reject actions
   - Updates individual records in both nodes

## Deployment

### Vercel Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

3. Configure environment variables in Vercel dashboard if needed

## Security Notes

- Firebase API keys are safe to expose in client-side code
- Consider implementing Firebase Security Rules for production
- Admin credentials should be managed through Firebase Console
- The app uses Firebase Authentication for secure access

## Customization

You can customize the application by:

1. **Styling**: Modify Tailwind classes in components
2. **Database**: Add more nodes and fields to Firebase
3. **Features**: Add new pages and functionality
4. **Validation**: Update form validation rules
5. **Routing**: Add more routes in AdminPanel.jsx

## License

This project is for internal use by Saylani Welfare System.
