import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Recycle, 
  Wrench, 
  FileText, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { cn } from '../utils';

export const Layout = () => {
  const { factory, user, alerts, resetData } = useAppData();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeAlerts = alerts.filter(a => !a.resolved_at);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Zap, label: 'Energy Tracker' },
    { to: '/scrap', icon: Recycle, label: 'Scrap Tracker' },
    { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { to: '/actions', icon: CheckCircle2, label: 'Fix Tracker' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    resetData();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex flex-col md:flex-row font-inter">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#112A20] text-white fixed h-full z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">ReMargin</h1>
          <p className="text-sm text-gray-400 mt-1 truncate">{factory?.name}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                isActive 
                  ? "bg-[var(--color-brand-primary)] text-white" 
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#112A20] text-white p-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold">ReMargin</h1>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">{factory?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative" onClick={() => setNotificationsOpen(true)}>
            <Bell size={24} />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-brand-red)] w-4 h-4 rounded-full border-2 border-[#112A20]"></span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#112A20] z-10 pt-20 px-4 pb-24 flex flex-col">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-4 py-4 rounded-md transition-colors text-lg",
                  isActive 
                    ? "bg-[var(--color-brand-primary)] text-white" 
                    : "text-gray-300"
                )}
              >
                <item.icon size={24} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 w-full rounded-md text-gray-300 mt-auto"
          >
            <LogOut size={24} />
            <span className="font-medium text-lg">Logout</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative pb-20 md:pb-0">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex bg-white h-16 border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-lg font-medium text-gray-800">{factory?.name}</div>
          <div className="flex items-center gap-6">
            <button 
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={20} />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 bg-[var(--color-brand-red)] w-2.5 h-2.5 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex items-center justify-around h-16 pb-safe z-20">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive ? "text-[var(--color-brand-primary)]" : "text-gray-500"
            )}
          >
            <item.icon size={20} className="mb-1" />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* Slide-in Notifications Panel */}
      {notificationsOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setNotificationsOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-40 transform transition-transform animate-in slide-in-from-right flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">Alerts</h2>
              <button onClick={() => setNotificationsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {activeAlerts.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">No active alerts</div>
              ) : (
                activeAlerts.map(alert => (
                  <div key={alert.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      alert.type === 'Energy' ? 'bg-[var(--color-brand-red)]' : 
                      alert.type === 'Maintenance' ? 'bg-[var(--color-brand-amber)]' : 'bg-blue-500'
                    )} />
                    <p className="font-medium text-gray-900 pr-4">{alert.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(alert.created_at).toLocaleDateString()} • ₹{alert.loss_inr} lost
                    </p>
                    <button 
                      onClick={() => { setNotificationsOpen(false); navigate(`/actions?alertId=${alert.id}`); }}
                      className="mt-3 text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
                    >
                      Take Action →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
