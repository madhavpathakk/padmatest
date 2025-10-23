import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const ADMIN_EMAIL = "padmaisha940@gmail.com";
export const ADMIN_PASSWORD = "maisha@112233";

export async function loginAsAdmin(email: string, password: string) {
  if (email !== ADMIN_EMAIL) {
    throw new Error('Access denied. Invalid admin email.');
  }

  try {
    // First verify the password
    if (password !== ADMIN_PASSWORD) {
      throw new Error('Invalid admin password.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check and update admin status in Firestore
    const adminRef = doc(db, 'admins', user.uid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      // Create admin document if it doesn't exist
      await setDoc(adminRef, {
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        isAdmin: true,
        uid: user.uid
      });
    }

    // Ensure admin status is set in the users collection
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: email,
      isAdmin: true,
      role: 'admin',
      updatedAt: new Date().toISOString(),
      uid: user.uid
    }, { merge: true });

    // Set admin session
    sessionStorage.setItem('adminAuth', 'true');
    localStorage.setItem('adminAuth', 'true');

    return user;
  } catch (error: any) {
    console.error('Admin login error:', error);
    if (error.message.includes('password')) {
      throw new Error('Invalid admin password.');
    }
    if (error.code === 'auth/user-not-found') {
      throw new Error('Admin account not found.');
    }
    throw new Error('Login failed. Please try again.');
  }
}
