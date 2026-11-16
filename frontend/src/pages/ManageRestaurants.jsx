import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Store, Plus, Trash2 } from 'lucide-react';

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const res = await axios.get('https://restro-backend-production.up.railway.app/api/restaurants');
    setRestaurants(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://restro-backend-production.up.railway.app/api/restaurants', { name, description, type });
      toast.success('Restaurant created!');
      setName(''); setDescription(''); setType('');
      fetchRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating restaurant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Store className="text-pink-500" /> Manage Restaurants</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card h-fit">
          <h3 className="text-lg font-bold mb-4">Add New Restaurant</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Type (e.g. Fine Dining, Cafe)</label>
              <input type="text" className="input-field" value={type} onChange={e => setType(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Description</label>
              <textarea className="input-field min-h-24" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={18} /> Add Restaurant
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {restaurants.map(r => (
            <div key={r._id} className="card flex items-start justify-between hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100">
                  <Store className="text-pink-500" size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{r.name}</h4>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block mt-1 font-semibold">{r.type || 'General'}</span>
                  <p className="text-slate-500 text-sm mt-2">{r.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>
          ))}
          {restaurants.length === 0 && <div className="text-center py-10 text-slate-500 card">No restaurants found. Please add one.</div>}
        </div>
      </div>
    </div>
  );
}
