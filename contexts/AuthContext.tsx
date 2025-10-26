
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Check admin status in Firestore
          const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
          const isAdminUser = adminDoc.exists() && adminDoc.data().isAdmin === true;
          
          // Also check if it's the specific admin email
          const isAdminEmail = firebaseUser.email === "padmaisha940@gmail.com";
          
          // Set admin status if either condition is true
          setIsAdmin(isAdminUser || isAdminEmail);
          
          // If admin email but not in admin collection, add them
          if (isAdminEmail && !adminDoc.exists()) {
            await setDoc(doc(db, "admins", firebaseUser.uid), {
              email: firebaseUser.email,
              role: "admin",
              isAdmin: true,
              createdAt: new Date().toISOString(),
              uid: firebaseUser.uid
            });
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        // Clear admin session when logged out
        sessionStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuth');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out");
    if (typeof window !== 'undefined') {
      window.location.href = '/login'; // or '/' if you want to redirect to home
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

