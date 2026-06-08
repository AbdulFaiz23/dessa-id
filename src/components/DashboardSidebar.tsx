"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Plus, User, LogOut, TreePine, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/listing", icon: List, label: "Listing Saya" },
  { href: "/dashboard/listing/baru", icon: Plus, label: "Buat Listing" },
  { href: "/dashboard/langganan", icon: CreditCard, label: "Langganan" },
  { href: "/dashboard/profil", icon: User, label: "Profil" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/masuk");
  };

  return (
    <aside className="w-60 bg-earth-900 min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-2 text-earth-50 font-heading text-2xl tracking-tight">
          <TreePine className="w-6 h-6 text-green-500" />
          <span>dessa<span className="text-green-500">.</span>id</span>
        </Link>
        <p className="text-earth-500 text-xs mt-1">Dashboard Penjual</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-green-700/20 text-green-100 font-medium"
                  : "text-earth-200 hover:bg-earth-700/50 hover:text-earth-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-earth-700/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-earth-500 hover:text-earth-200 hover:bg-earth-700/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
