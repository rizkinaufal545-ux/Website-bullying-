import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserSquare2, 
  History, 
  PlusCircle, 
  LogOut,
  Menu,
  X,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setRole(profile.role);
          setUserName(profile.full_name);
        }
      }
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = {
    admin: [
      { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
      { name: 'Laporan Bullying', path: '/app/reports', icon: FileText },
      { name: 'Manajemen User', path: '/app/users', icon: Users },
      { name: 'Data Siswa', path: '/app/students', icon: UserSquare2 },
      { name: 'Rekap Laporan', path: '/app/recap', icon: BarChart3 },
    ],
    guru: [
      { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
      { name: 'Laporan Bullying', path: '/app/reports', icon: FileText },
      { name: 'Rekap Laporan', path: '/app/recap', icon: BarChart3 },
    ],
    siswa: [
      { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
      { name: 'Buat Laporan', path: '/app/create-report', icon: PlusCircle },
      { name: 'Riwayat Laporan', path: '/app/history', icon: History },
    ],
  };

  const currentMenuItems = role ? menuItems[role] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-primary leading-tight">SMK Prima</h1>
              <p className="text-xs text-secondary font-semibold">Anti-Bullying</p>
            </div>
          </div>

          <Separator />

          <nav className="flex-1 p-4 space-y-1">
            {currentMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500 capitalize">{role}</p>
            </div>
            <Avatar className="border-2 border-primary/10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
