import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ADMIN_EMAIL = "test@gamil.com";

const ProtectedRoute = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    // Still loading
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Only allow if logged in and email matches
  if (user && user.email === ADMIN_EMAIL) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;