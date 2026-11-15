import { useState, useEffect } from 'react';
import axios from 'axios';
import { Store, MapPin, Grid3X3, ChefHat, TrendingUp, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://https://restro-nine-tau.vercel.app//api/analytics/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="text-center mt-20 loading-spinner">Loading stats...</div>;

  const data = stats.chartData || [];

  const cards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'text-amber-700', bg: 'bg-amber-50' },
    { title: 'Total Orders', value: stats.totalOrders || 0, icon: ChefHat, color: 'text-stone-700', bg: 'bg-stone-100' },
    { title: 'Restaurants', value: stats.totalRestaurants || 0, icon: Store, color: 'text-stone-700', bg: 'bg-stone-100' },
    { title: 'Branches', value: stats.totalBranches || 0, icon: MapPin, color: 'text-stone-700', bg: 'bg-stone-100' },
    { title: 'Peak Time', value: stats.peakTime || 'N/A', icon: Clock, color: 'text-stone-700', bg: 'bg-stone-100' },
    { title: 'Top Table', value: stats.topTable || 'N/A', icon: Grid3X3, color: 'text-stone-700', bg: 'bg-stone-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="card group hover:shadow-lg transition-all duration-300 border-none bg-white/70 backdrop-blur-xl shrink-0 overflow-hidden relative">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${c.bg} shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                <c.icon className={c.color} size={32} />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1 truncate">{c.title}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight truncate">{c.value}</h3>
              </div>
            </div>
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${c.bg} rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card min-w-0">
          <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={20} className="text-amber-700" /> Revenue Overview
          </h3>
          <div className="w-full min-w-0 mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#b45309" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="name" stroke="#a8a29e" tick={{ fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#a8a29e" tick={{ fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#b45309" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
            <ChefHat size={20} className="text-stone-500" /> Recent Orders
          </h3>
          <div className="space-y-4">
            {stats.recentOrders?.length === 0 ? (
              <p className="text-sm text-slate-500">No recent orders yet.</p>
            ) : (
              stats.recentOrders?.map(order => (
                <div key={order._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Table {order.tableNumber}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-800">₹{order.totalAmount?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-sm font-semibold tracking-wide uppercase ${order.status === 'completed' ? 'bg-stone-200 text-stone-700' :
                        order.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                          'bg-stone-100 text-stone-600'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
