import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ChefHat, CheckCircle2, Clock, Search } from 'lucide-react';

export default function LiveOrders() {
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchBranches(); }, []);
  useEffect(() => {
    if (selectedBranch) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedBranch, statusFilter]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('https://restro-backend-production.up.railway.app/api/branches');
      setBranches(res.data);
      if (res.data.length > 0) setSelectedBranch(res.data[0]._id);
    } catch (err) { }
  };

  const fetchOrders = async () => {
    try {
      let url = `https://restro-backend-production.up.railway.app/api/orders?branchId=${selectedBranch}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) { }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://restro-backend-production.up.railway.app/api/orders/${id}`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) { toast.error('Error updating status'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-stone-100 gap-4">
        <h2 className="text-2xl flex items-center gap-3 text-stone-800 uppercase tracking-widest font-bold">
          <ChefHat className="text-stone-700" size={24} /> Live Kitchen Orders
        </h2>

        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-500 whitespace-nowrap">Filter:</label>
          <select className="px-5 py-2.5 bg-[#fcfcfb] border border-stone-200 rounded-lg outline-none font-medium text-stone-800 text-sm tracking-wide focus:bg-white focus:border-amber-700/50"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
          </select>
          <div className="w-px h-6 bg-stone-200 mx-1"></div>
          <select className="px-5 py-2.5 bg-[#fcfcfb] border border-stone-200 rounded-lg outline-none font-medium text-stone-800 text-sm tracking-wide focus:bg-white focus:border-amber-700/50"
            value={selectedBranch || ""} onChange={e => setSelectedBranch(e.target.value)}>
            {branches.length === 0 && <option value="" disabled>No Branches Found</option>}
            {branches.map(b => <option key={b._id} value={b._id}>{b.restaurantId?.name} - {b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map(o => (
          <div key={o._id} className={`card transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${o.status === 'pending' ? 'border-t-[6px] border-t-amber-600' :
              o.status === 'preparing' ? 'border-t-[6px] border-t-zinc-800' :
                o.status === 'served' ? 'border-t-[6px] border-t-stone-500' :
                  'opacity-50 hover:opacity-100 border-t-stone-200 border-t-[6px]'
            }`}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-3xl font-black text-stone-800 tracking-tighter">Table {o.tableNumber}</h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mt-2 flex items-center gap-1.5">
                  <Clock size={12} /> {new Date(o.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs font-bold rounded-sm uppercase tracking-widest block mb-2 ${o.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    o.status === 'preparing' ? 'bg-zinc-100 text-zinc-800' :
                      o.status === 'served' ? 'bg-stone-200 text-stone-800' :
                        'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}>
                  {o.status}
                </span>
                <p className="font-bold text-lg text-stone-800">₹{o.totalAmount?.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-[#fcfcfb] border-y border-stone-100 py-3 mb-5 max-h-48 overflow-y-auto px-1 -mx-2">
              {o.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 py-2 px-3 hover:bg-white rounded-md transition-colors border-b border-stone-100/50 last:border-0 group">
                  <span className="w-7 h-7 shrink-0 rounded bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-bold flex items-center justify-center">
                    {item.quantity}x
                  </span>
                  <span className="font-semibold text-stone-600 text-sm tracking-wide mt-0.5 group-hover:text-amber-700 transition-colors">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              {o.status === 'pending' && (
                <button onClick={() => updateStatus(o._id, 'preparing')} className="col-span-2 py-3 bg-zinc-900 border-zinc-800 text-amber-500 uppercase tracking-widest text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.98] transition-all">
                  Start Preparing
                </button>
              )}
              {o.status === 'preparing' && (
                <button onClick={() => updateStatus(o._id, 'served')} className="col-span-2 py-3 bg-white border border-stone-200 text-stone-800 uppercase tracking-widest text-xs font-bold rounded-lg shadow-sm flex justify-center gap-2 items-center hover:bg-stone-50 active:scale-[0.98] transition-all">
                  Mark as Served
                </button>
              )}
              {o.status === 'served' && (
                <button onClick={() => updateStatus(o._id, 'completed')} className="col-span-2 py-3 bg-stone-100 border border-stone-200 text-stone-600 uppercase tracking-widest text-xs font-bold rounded-lg flex justify-center gap-2 items-center hover:bg-stone-200 active:scale-[0.98] transition-all">
                  <CheckCircle2 size={16} /> Mark Completed
                </button>
              )}
              {o.status === 'completed' && (
                <p className="col-span-2 text-center text-xs font-semibold text-stone-400 py-2 uppercase tracking-widest">Order Finalized</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-xl border border-stone-200 text-stone-400 font-medium uppercase tracking-widest text-sm shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <Search size={32} className="mx-auto mb-4 opacity-40" />
          No orders currently matching. Kitchen is resting.
        </div>
      )}
    </div>
  );
}
