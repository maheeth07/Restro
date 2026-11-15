import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Grid3X3, Plus, QrCode } from 'lucide-react';

export default function ManageTables() {
  const [tables, setTables] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [editingTable, setEditingTable] = useState(null);

  const [qrModal, setQrModal] = useState({ show: false, img: '', link: '' });

  useEffect(() => { fetchBranches(); }, []);
  useEffect(() => { if (selectedBranch) fetchTables(); }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://https://restro-nine-tau.vercel.app//api/branches');
      setBranches(res.data);
      if (res.data.length > 0) setSelectedBranch(res.data[0]._id);
    } catch (err) { }
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get(`http://https://restro-nine-tau.vercel.app//api/tables/${selectedBranch}`);
      setTables(res.data);
    } catch (err) { }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await axios.put(`http://https://restro-nine-tau.vercel.app//api/tables/${editingTable}`, { tableNumber, capacity: Number(capacity) });
        toast.success('Table updated!');
        setEditingTable(null);
      } else {
        await axios.post('http://https://restro-nine-tau.vercel.app//api/tables', { branchId: selectedBranch, tableNumber, capacity: Number(capacity) });
        toast.success('Table added!');
      }
      setTableNumber(''); setCapacity('');
      fetchTables();
    } catch (err) { toast.error('Error saving table details.'); }
  };

  const handleEdit = (t) => {
    setEditingTable(t._id);
    setTableNumber(t.tableNumber);
    setCapacity(t.capacity);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await axios.delete(`http://https://restro-nine-tau.vercel.app//api/tables/${id}`);
      fetchTables();
      toast.success('Table deleted!');
    } catch (err) { toast.error('Error deleting table'); }
  };

  const generateQR = async (tNum) => {
    try {
      const res = await axios.get(`http://https://restro-nine-tau.vercel.app//api/tables/qr?branchId=${selectedBranch}&tableNumber=${tNum}`);
      setQrModal({ show: true, img: res.data.qrCodeImage, link: res.data.link });
    } catch (err) { }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Grid3X3 className="text-emerald-500" /> Tables & QR Manager</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <label className="text-sm font-semibold text-slate-500 shrink-0">Select Branch:</label>
          <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={selectedBranch || ""} onChange={e => setSelectedBranch(e.target.value)}>
            {branches.length === 0 && <option value="" disabled>No Branches Found</option>}
            {branches.map(b => <option key={b._id} value={b._id}>{b.restaurantId?.name} - {b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 card h-fit">
          <h3 className="text-lg font-bold mb-4">{editingTable ? 'Edit Table' : 'Add Table'}</h3>
          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Table Number/Name</label>
              <input type="text" className="input-field" value={tableNumber} onChange={e => setTableNumber(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Capacity (Seats)</label>
              <input type="number" className="input-field" value={capacity} onChange={e => setCapacity(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 !bg-emerald-500 hover:!bg-emerald-600 shadow-emerald-500/30">
              <Plus size={18} /> {editingTable ? 'Update Table' : 'Add Table'}
            </button>
            {editingTable && (
              <button type="button" onClick={() => { setEditingTable(null); setTableNumber(''); setCapacity(''); }} className="w-full text-slate-500 font-semibold hover:text-slate-700 text-sm mt-2">
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map(t => (
            <div key={t._id} className="card text-center group hover:-translate-y-1 transition-transform border-t-4 border-t-emerald-400 relative overflow-hidden">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(t)} className="w-7 h-7 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white flex items-center justify-center text-xs font-bold transition-colors">✎</button>
                <button onClick={() => handleDelete(t._id)} className="w-7 h-7 bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white flex items-center justify-center text-xs font-bold transition-colors">✕</button>
              </div>
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 mt-4">
                <h2 className="text-2xl font-black text-emerald-600">{t.tableNumber}</h2>
              </div>
              <p className="text-sm text-slate-500 font-semibold">{t.capacity} Seats</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${t.status === 'occupied' ? 'bg-red-100 text-red-600' :
                  t.status === 'booked' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                }`}>
                {t.status.toUpperCase()}
              </span>
              <button onClick={() => generateQR(t.tableNumber)} className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex justify-center items-center gap-2 transition-colors">
                <QrCode size={16} /> View QR
              </button>
            </div>
          ))}
        </div>
      </div>

      {qrModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative pointer-events-auto">
            <button onClick={() => setQrModal({ show: false })} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full">✕</button>
            <h3 className="text-xl font-bold mb-2">Scan to Order</h3>
            <p className="text-sm text-slate-500 mb-6">Print this for the table</p>
            <img src={qrModal.img} alt="QR Code" className="mx-auto w-64 h-64 border-4 border-slate-100 rounded-xl mb-6 shadow-inner" />
            <a href={qrModal.link} target="_blank" className="text-emerald-500 hover:underline text-sm font-semibold truncate block max-w-full overflow-hidden mb-4">{qrModal.link}</a>
            <button onClick={() => setQrModal({ show: false })} className="btn-primary w-full !bg-slate-800">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
