import { useEffect } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function AdminPage() {
  const { session, isAdmin, loading, signingIn, login, logout } = useAdminAuth();

  useEffect(() => {
    document.title = isAdmin
      ? "Admin — Ottermap Qualifier"
      : "Admin Sign In — Ottermap";
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLogin={login} signingIn={signingIn} />;
  }

  return (
    <AdminDashboard
      adminEmail={session?.user?.email}
      onLogout={logout}
    />
  );
}
