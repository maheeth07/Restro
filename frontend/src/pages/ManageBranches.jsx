// Force Vite HMR reload
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Plus, Building2, UploadCloud, ImageIcon, CheckCircle2, X } from 'lucide-react';

export default function ManageBranches() {
  const [branches, setBranches] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  const [uploadingBranchId, setUploadingBranchId] = useState(null);

  const { user } = useContext(AuthContext);

  const handleImageUpload = async (e, branchId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBranchId(branchId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await axios.post('https://restro-backend-production.up.railway.app/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.imageUrl;

      const res = await axios.post(`https://restro-backend-production.up.railway.app/api/branches/${branchId}/images`, { imageUrl });
      setBranches(branches.map(b => b._id === branchId ? res.data : b));
      toast.success('Image added to gallery!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingBranchId(null);
    }
  };

  const handleRemoveImage = async (branchId, imageUrl) => {
    if (!window.confirm('Delete this image from gallery?')) return;
    try {
      const res = await axios.put(`https://restro-backend-production.up.railway.app/api/branches/${branchId}/images/remove`, { imageUrl });
      setBranches(branches.map(b => b._id === branchId ? res.data : b));
      toast.success('Image removed from gallery!');
    } catch (err) {
      toast.error('Failed to remove image');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resB, resR] = await Promise.all([
        axios.get('https://restro-backend-production.up.railway.app/api/branches'),
        axios.get('https://restro-backend-production.up.railway.app/api/restaurants')
      ]);
      setBranches(resB.data);
      setRestaurants(resR.data);
      if (resR.data.length > 0) setRestaurantId(resR.data[0]._id);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://restro-backend-production.up.railway.app/api/branches', { name, address, restaurantId });
      toast.success('Branch added!');
      setName(''); setAddress('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin className="text-amber-500" /> Manage Branches</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card h-fit">
          <h3 className="text-lg font-bold mb-4">Add New Branch</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Select Restaurant</label>
              <select className="input-field" value={restaurantId || ""} onChange={e => setRestaurantId(e.target.value)} required>
                {restaurants.length === 0 && <option value="" disabled>No Restaurants Found</option>}
                {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Branch Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Address</label>
              <textarea className="input-field" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 !bg-amber-500 hover:!bg-amber-600 shadow-amber-500/30">
              <Plus size={18} /> Add Branch
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map(branch => (
            <div key={branch._id} className="card hover:border-amber-500 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{branch.name}</h4>
                  <p className="text-sm text-slate-500 truncate w-48">{branch.address}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">
                  {branch.restaurantId?.name || 'Unknown Restaurant'}
                </span>
                <p className="text-xs text-slate-400">ID: {branch._id.substring(branch._id.length - 6)}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h5 className="text-sm font-bold text-slate-700 mb-2">Image Gallery</h5>
                {branch.images && branch.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {branch.images.map((img, idx) => (
                      <div key={idx} className="h-28 rounded-lg overflow-hidden border border-slate-200 relative group">
                        <img src={img} alt="branch" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        {/* Delete Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveImage(branch._id, img)}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-500/90 text-white flex items-center justify-center transition-all backdrop-blur-md active:scale-95"
                            title="Delete image"
                          >
                            <X size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mb-2">No images yet</p>
                )}

                <label className="cursor-pointer inline-block w-full text-center py-2 px-3 mt-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  {uploadingBranchId === branch._id ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, branch._id)} disabled={uploadingBranchId === branch._id} />
                </label>
              </div>
            </div>
          ))}
          {branches.length === 0 && <div className="col-span-full text-center py-10 text-slate-500 card">No branches found.</div>}
        </div>
      </div>
    </div>
  );
}
