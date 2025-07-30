// Utility to sync existing Firebase Auth users to Firestore users collection
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

export const syncExistingUsers = async () => {
  try {
    // Get all existing users from Firestore
    const usersRef = collection(db, 'users');
    const existingUsersSnapshot = await getDocs(usersRef);
    const existingUserEmails = new Set();
    
    existingUsersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.email) {
        existingUserEmails.add(userData.email);
      }
    });

    // Note: listUsers is only available in Firebase Admin SDK (server-side)
    // For client-side, we can only work with existing Firestore data
    console.log('Existing users in Firestore:', existingUserEmails.size);
    
    return {
      success: true,
      message: `Found ${existingUserEmails.size} existing users in Firestore`
    };
  } catch (error) {
    console.error('Error syncing users:', error);
    return {
      success: false,
      message: 'Failed to sync users: ' + error.message
    };
  }
};

// Function to manually add a user to Firestore (for testing)
export const addUserToFirestore = async (userData) => {
  try {
    const userRef = collection(db, 'users');
    const docRef = await addDoc(userRef, {
      uid: userData.uid,
      name: userData.name || 'Unknown User',
      email: userData.email,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('User added to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Function to create a test user for debugging
export const createTestUser = async () => {
  const testUserData = {
    uid: 'test-user-' + Date.now(),
    name: 'Test User',
    email: 'test@example.com',
    status: 'active'
  };
  
  return await addUserToFirestore(testUserData);
}; 