import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Store, MapPin, Menu as MenuIcon, Grid3X3, ChefHat, LogOut, Bell, Menu, X, Users } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Restaurants', icon: Store, path: '/restaurants' },
    { name: 'Branches', icon: MapPin, path: '/branches' },
    { name: 'Menus', icon: MenuIcon, path: '/menus' },
    { name: 'Tables', icon: Grid3X3, path: '/tables' },
    { name: 'Live Orders', icon: ChefHat, path: '/orders' },
    { name: 'Staff', icon: Users, path: '/staff' },
  ];

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('https://restro-backend-production.up.railway.app/api/notifications');
      setNotifications(res.data);
    } catch (err) { console.error('Failed fetching notifications'); }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`https://restro-backend-production.up.railway.app/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-stone-300 flex flex-col transform transition-transform duration-500 ease-in-out border-r border-zinc-900 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="h-16 flex items-center justify-between px-6 font-bold text-2xl text-white tracking-widest border-b border-zinc-900/50">
          <div><span className="text-amber-600 mr-2">RESTRO</span> <span className="text-sm font-light uppercase tracking-widest text-stone-400">Hotel</span></div>
          <button className="lg:hidden text-stone-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          {navLinks.map((item) => {
            const active = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${active
                    ? 'bg-zinc-900 text-amber-500 border-r-2 border-amber-600 shadow-sm'
                    : 'hover:bg-zinc-900/50 hover:text-stone-100'
                  }`}
              >
                <Icon size={18} className={active ? "text-amber-500" : "text-stone-500"} />
                <span className={`font-medium tracking-wide ${active ? 'text-amber-500' : ''}`}>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-5 border-t border-zinc-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-500 font-bold shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-stone-200 truncate">{user?.name}</p>
              <p className="text-xs text-stone-500 capitalize truncate tracking-wide">{user?.role?.replace('staff_', '')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-zinc-900 rounded-lg text-stone-400 hover:text-stone-200 transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium tracking-wide">Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full bg-[#f8f8f6]">
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-stone-200/60 flex items-center justify-between px-6 sm:px-10 z-10 shrink-0 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-medium text-stone-800 tracking-wide uppercase hidden sm:block">
              Management Portal
            </h2>
          </div>
          <div className="flex items-center gap-5 relative">
            <button
              className="relative p-2 text-stone-400 hover:text-amber-700 transition-colors rounded-full hover:bg-stone-50"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-1 right-2 w-2 h-2 bg-amber-600 rounded-full border border-white"></span>}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-white border border-stone-200 shadow-xl rounded-xl z-50 overflow-hidden">
                <div className="p-3 bg-stone-50 font-bold text-stone-700 text-sm border-b overflow-hidden">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? <p className="p-4 text-center text-stone-500 text-xs text-sm">No notifications</p> :
                    notifications.map(n => (
                      <div key={n._id} onClick={() => !n.isRead && markAsRead(n._id)} className={`p-4 border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors ${!n.isRead ? 'bg-amber-50/50' : ''}`}>
                        <p className={`text-sm ${!n.isRead ? 'font-bold text-stone-800' : 'text-stone-600'}`}>{n.message}</p>
                        <p className="text-xs text-stone-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 lg:p-10 relative">
          <div className="max-w-7xl mx-auto w-full pb-20 lg:pb-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
