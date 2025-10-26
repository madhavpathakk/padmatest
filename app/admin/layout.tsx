"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import "../../styles/globals.css";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const pathname = window.location.pathname;
    const isAdminAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    
    if (!loading) {
      // If we're not on login/init pages and either not authenticated or not admin
      if (!pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/init")) {
        if (!user || !isAdmin || !isAdminAuthenticated) {
          router.push("/admin/login");
        }
      } else if (pathname.startsWith("/admin/login") && user && isAdmin && isAdminAuthenticated) {
        // If we're on login page but already authenticated as admin, redirect to dashboard
        router.push("/admin/dashboard");
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#18181b]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Allow access to login and init pages even when not authenticated
  // Only access window on client
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/init")) {
      return children;
    }
  }

  if (!user || !isAdmin) {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#18181b]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ProtectedLayout>{children}</ProtectedLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}
