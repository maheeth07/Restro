import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Menu as MenuIcon, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function ManageMenu() {
  const [menus, setMenus] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) fetchMenus();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://https://restro-nine-tau.vercel.app//api/branches');
      setBranches(res.data);
      if (res.data.length > 0) setSelectedBranch(res.data[0]._id);
    } catch (err) { console.error(err); }
  };

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`http://https://restro-nine-tau.vercel.app//api/menu/${selectedBranch}`);
      setMenus(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploadedImageUrl = image;

      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await axios.post('http://https://restro-nine-tau.vercel.app//api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      await axios.post('http://https://restro-nine-tau.vercel.app//api/menu', { branchId: selectedBranch, name, price: Number(price), category, image: uploadedImageUrl });
      toast.success('Item added!');
      setName(''); setPrice(''); setCategory(''); setImage(''); setFile(null);
      fetchMenus();
    } catch (err) {
      toast.error('Error adding item');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://https://restro-nine-tau.vercel.app//api/menu/${id}`);
      fetchMenus();
      toast.success('Deleted');
    } catch (err) { toast.error('Error deleting item'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-stone-100 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-stone-800 uppercase tracking-widest"><MenuIcon className="text-amber-700" size={24} /> Menu Management</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-widest shrink-0">Select Branch:</label>
          <select className="px-5 py-2.5 bg-[#fcfcfb] border border-stone-200 rounded-lg outline-none focus:ring-4 focus:ring-amber-700/5 focus:bg-white text-stone-800 font-medium transition-all"
            value={selectedBranch || ""} onChange={e => setSelectedBranch(e.target.value)}>
            {branches.length === 0 && <option value="" disabled>No Branches Found</option>}
            {branches.map(b => <option key={b._id} value={b._id}>{b.restaurantId?.name} - {b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 card h-fit">
          <h3 className="text-lg font-bold mb-4">Add Menu Item</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Item Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Price ($)</label>
                <input type="number" step="0.01" className="input-field" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Category</label>
                <input type="text" className="input-field" placeholder="e.g. Mains" value={category} onChange={e => setCategory(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Image Upload (or paste URL)</label>
              <div className="flex flex-col gap-2">
                <input type="file" accept="image/*" className="input-field" onChange={e => setFile(e.target.files[0])} />
                <span className="text-xs text-slate-400 text-center">OR</span>
                <input type="text" className="input-field" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={uploading} className="btn-primary w-full flex items-center justify-center gap-2 !bg-indigo-500 hover:!bg-indigo-600 shadow-indigo-500/30 disabled:opacity-50">
              <Plus size={18} /> {uploading ? 'Uploading...' : 'Add Item'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          {menus.length === 0 ? (
            <div className="card text-center py-20 bg-slate-50 border-dashed border-2 border-slate-200">
              <MenuIcon size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg font-medium">No items in this branch yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {menus.map(m => (
                <div key={m._id} className="card p-0 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {m.category}
                    </span>
                  </div>
                  <div className="p-5 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{m.name}</h4>
                      <p className="text-indigo-600 font-bold text-xl mt-1">₹{m.price?.toFixed(2)}</p>
                    </div>
                    <button onClick={() => handleDelete(m._id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
