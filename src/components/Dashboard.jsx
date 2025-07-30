import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import DashboardCard from './DashboardCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalHelpRequests: 0,
    approved: 0
  });
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    users: false,
    appointments: false,
    helpRequests: false
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const appointmentsRef = collection(db, 'appointments');
    const helpRequestsRef = collection(db, 'help_requests');

    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.length;
      setStats(prev => ({ ...prev, totalUsers: users }));
      setDataLoaded(prev => ({ ...prev, users: true }));
    });

    const unsubAppointments = onSnapshot(appointmentsRef, (snapshot) => {
      const appointments = snapshot.docs.length;
      const approvedCount = snapshot.docs.filter(doc => 
        doc.data().status?.toLowerCase() === 'approved'
      ).length;
      setStats(prev => ({ 
        ...prev, 
        totalAppointments: appointments, 
        approved: prev.approved - (prev.totalAppointments > 0 ? prev.approved : 0) + approvedCount 
      }));
      setDataLoaded(prev => ({ ...prev, appointments: true }));
    });

    const unsubHelp = onSnapshot(helpRequestsRef, (snapshot) => {
      const helpRequests = snapshot.docs.length;
      const approvedCount = snapshot.docs.filter(doc => 
        doc.data().status?.toLowerCase() === 'approved'
      ).length;
      setStats(prev => ({ 
        ...prev, 
        totalHelpRequests: helpRequests, 
        approved: prev.approved + approvedCount 
      }));
      setDataLoaded(prev => ({ ...prev, helpRequests: true }));
    });

    return () => {
      unsubUsers();
      unsubAppointments();
      unsubHelp();
    };
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const activities = [];
        
        // Get recent appointments
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        appointmentsSnapshot.docs.forEach(doc => {
          activities.push({
            id: doc.id,
            type: 'appointment',
            data: doc.data(),
            timestamp: doc.data().timestamp
          });
        });

        // Get recent help requests
        const helpQuery = query(
          collection(db, 'help_requests'),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const helpSnapshot = await getDocs(helpQuery);
        helpSnapshot.docs.forEach(doc => {
          activities.push({
            id: doc.id,
            type: 'help_request',
            data: doc.data(),
            timestamp: doc.data().timestamp
          });
        });

        // Get recent users
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const usersSnapshot = await getDocs(usersQuery);
        usersSnapshot.docs.forEach(doc => {
          activities.push({
            id: doc.id,
            type: 'user',
            data: doc.data(),
            timestamp: doc.data().createdAt || doc.data().timestamp
          });
        });

        // Sort all activities by timestamp
        activities.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Take the 10 most recent
        setRecentActivities(activities.slice(0, 10));
        setActivitiesLoading(false);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        setActivitiesLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  useEffect(() => {
    if (dataLoaded.users && dataLoaded.appointments && dataLoaded.helpRequests) {
      setLoading(false);
    }
  }, [dataLoaded]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return (
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'help_request':
        return (
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
          </div>
        );
      case 'user':
        return (
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'appointment':
        return `${activity.data.name || 'Someone'} requested a ${activity.data.type || 'appointment'}`;
      case 'help_request':
        return `${activity.data.name || 'Someone'} requested ${activity.data.type || 'help'}`;
      case 'user':
        return `${activity.data.name || 'New user'} joined the platform`;
      default:
        return 'New activity';
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status?.toLowerCase()] || statusClasses.pending}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const cardData = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Total Help Requests',
      value: stats.totalHelpRequests,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      ),
      color: 'yellow'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <div className="ml-64 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of users, appointments, and help requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-600 mt-1">Latest user activities and requests</p>
        </div>
        
        {activitiesLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading activities...</p>
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No recent activities found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <tr key={`${activity.type}-${activity.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActivityIcon(activity.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {getActivityText(activity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.data.description ? activity.data.description.substring(0, 50) + '...' : 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                        activity.type === 'appointment' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'help_request' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.data.status ? getStatusBadge(activity.data.status) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(activity.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 