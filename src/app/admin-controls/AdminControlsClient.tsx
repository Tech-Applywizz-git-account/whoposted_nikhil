"use client";

import { useState, useMemo } from "react";
import {
  Settings,
  Users,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Search,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface User {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string | null;
  role: string | null;
  status: boolean;
}

interface AdminControlsClientProps {
  initialUsers: User[];
}

export default function AdminControlsClient({ initialUsers }: AdminControlsClientProps) {
  const router = useRouter();

  // States
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Delete user states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching users:", err);
      showToast("Failed to refresh users", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserStatus = async (userId: string, status: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update user status");
      setUsers(users.map(u => u.user_id === userId ? { ...u, status } : u));
      showToast(`User status updated`, "success");
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.user_id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setUsers(users.filter(u => u.user_id !== userToDelete.user_id));
      showToast("User deleted", "success");
      setShowDeleteConfirm(false);
    } catch (err) {
      showToast("Delete failed", "error");
    } finally {
      setIsDeletingUser(false);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const paid = users.filter(u => u.status === true).length;
    const unpaid = users.filter(u => u.status === false).length;
    return { total, paid, unpaid };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-12 animate-fade-in font-inter pb-20">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 pb-12 border-b border-brand-500/5">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500 rounded-[14px] shadow-lg shadow-brand-500/20 text-white animate-in zoom-in-50 duration-500">
              <Settings className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-[34px] font-black text-slate-900 tracking-[-0.03em] leading-tight">
                Admin Controls
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80 pl-0.5">
                <Users className="h-3 w-3 text-brand-500" />
                User Management
              </div>
            </div>
          </div>
          <p className="text-[16px] text-slate-500 max-w-2xl font-medium leading-relaxed opacity-70">
            Manage user accounts, monitor subscription statuses, and configure system permissions.
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="text-right group cursor-default">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-1.5 opacity-60">Total Users</p>
              <p className="text-4xl font-black text-slate-900 tabular-nums tracking-[-0.04em] group-hover:text-brand-500 transition-colors duration-500">{stats.total}</p>
            </div>
            <div className="h-12 w-px bg-brand-500/5" />
            <div className="text-right group cursor-default">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-1.5 opacity-60">Paid Users</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-4xl font-black text-emerald-500 tabular-nums tracking-[-0.04em]">{stats.paid}</p>
                <span className="text-sm font-black text-slate-300">/{stats.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative group w-full lg:w-96">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors z-10">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 h-12 rounded-2xl border border-brand-500/5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-bold shadow-premium group-hover:bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={fetchUsers}
            className="h-12 px-6 rounded-2xl border border-brand-500/5 text-slate-500 font-bold text-sm flex items-center gap-3 hover:bg-slate-50 hover:text-brand-500 transition-all shadow-premium active:scale-95"
          >
            <RefreshCw className={cn("h-4 w-4", loadingUsers && "animate-spin")} />
            Refresh
          </button>
          <button
            className="h-12 px-7 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-500/20 flex items-center gap-3 transition-all active:scale-95 hover:shadow-elevated"
            onClick={() => router.push("/admin-controls/create-user")}
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded-3xl shadow-premium border border-brand-500/5 overflow-hidden transition-all hover:shadow-elevated">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 border-b border-brand-500/5">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-500/5">
            {currentUsers.map((user) => (
              <tr key={user.user_id} className="hover:bg-brand-50/20 transition-all duration-300 group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/20 transition-transform duration-300 group-hover:scale-110">
                      <span className="text-sm font-black text-white tracking-tight">{getInitials(user.full_name, user.email)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{user.full_name || "Unknown"}</span>
                      <span className="text-xs text-slate-400 font-medium">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    user.role === 'whopost_admin'
                     ? "bg-violet-50 text-violet-700 border-violet-200"
                     : "bg-teal-50 text-teal-700 border-teal-200"
                  )}>
                    {user.role === 'whopost_admin' ? 'Admin' : 'Client'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="relative group/select">
                    <select
                      value={user.status ? "paid" : "unpaid"}
                      onChange={(e) => updateUserStatus(user.user_id, e.target.value === "paid")}
                      className={cn(
                        "appearance-none text-[10px] rounded-full py-2 pl-4 pr-8 focus:ring-4 outline-none font-black uppercase tracking-widest cursor-pointer transition-all border",
                        user.status
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/10 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-200 focus:ring-rose-500/10 hover:bg-rose-100"
                      )}
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs text-slate-300 font-black uppercase tracking-widest tabular-nums">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    onClick={() => { setUserToDelete(user); setShowDeleteConfirm(true); }}
                    className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="px-8 py-5 bg-slate-50/30 border-t border-brand-500/5 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest opacity-60">
            Showing <span className="text-slate-900">{indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)}</span>{" "}
            of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="h-10 px-5 rounded-xl border border-brand-500/5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-brand-50/50 hover:text-brand-500 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-10 px-5 rounded-xl border border-brand-500/5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-brand-50/50 hover:text-brand-500 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal — Premium */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-inter">
          <div className="bg-white rounded-3xl shadow-elevated max-w-md w-full p-10 border border-brand-500/5 animate-in zoom-in-95 fade-in duration-300">
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <AlertCircle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">Delete User?</h3>
            <p className="text-slate-400 text-center mb-10 font-medium leading-relaxed text-sm">
              You are about to permanently delete{" "}
              <span className="font-black text-slate-800">{userToDelete.email}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl border border-brand-500/5 text-slate-500 font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeletingUser}
                className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95 disabled:opacity-50 hover:shadow-elevated"
              >
                {isDeletingUser ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification — Premium */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[110] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className={cn(
            "px-6 py-4 rounded-2xl shadow-elevated border flex items-center gap-4 bg-white",
            toast.type === "success" ? "border-emerald-200 text-emerald-800" : "border-rose-200 text-rose-800"
          )}>
            <div className={cn(
              "p-2 rounded-xl",
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            )}>
              {toast.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </div>
            <p className="font-bold text-sm pr-4">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
