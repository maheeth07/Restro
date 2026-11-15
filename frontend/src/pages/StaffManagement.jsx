import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Users, UserPlus, Shield } from 'lucide-react';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff_waiter');
  const [selectedBranches, setSelectedBranches] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resStaff, resBranch] = await Promise.all([
        axios.get('http://https://restro-nine-tau.vercel.app//api/auth/staff'),
        axios.get('http://https://restro-nine-tau.vercel.app//api/branches')
      ]);
      setStaff(resStaff.data);
      setBranches(resBranch.data);
    } catch (err) { console.error(err); }
  };

  const handleBranchToggle = (id) => {
    setSelectedBranches(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://https://restro-nine-tau.vercel.app//api/auth/staff', {
        name, email, password, role, branchIds: selectedBranches
      });
      toast.success('Staff added successfully!');
      setName(''); setEmail(''); setPassword(''); setRole('staff_waiter'); setSelectedBranches([]);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding staff');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-violet-500" /> Staff Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card h-fit">
          <h3 className="text-lg font-bold mb-4">Add Staff Member</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Full Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Password</label>
              <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Role</label>
              <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                <option value="staff_manager">Manager</option>
                <option value="staff_waiter">Waiter</option>
                <option value="staff_kitchen">Kitchen Staff</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-2">Assign to Branches (Optional)</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2">
                {branches.map(b => (
                  <label key={b._id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input type="checkbox" checked={selectedBranches.includes(b._id)} onChange={() => handleBranchToggle(b._id)} className="rounded text-violet-500" />
                    {b.restaurantId?.name} - {b.name}
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 !bg-violet-500 hover:!bg-violet-600 shadow-violet-500/30">
              <UserPlus size={18} /> Add Staff
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map(s => (
              <div key={s._id} className="card hover:shadow-lg transition-all border-l-4 border-l-violet-400">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xl uppercase">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{s.name}</h4>
                    <p className="text-sm text-slate-500">{s.email}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Shield size={14} className="text-slate-400" />
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold capitalize">
                        {s.role.replace('staff_', '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {staff.length === 0 && <div className="col-span-full card text-center py-10 text-slate-500">No staff added yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
