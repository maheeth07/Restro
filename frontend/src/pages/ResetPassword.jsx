import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
      toast.success('Password successfully reset!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl shadow-2xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl shadow-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white relative z-10 transition-transform hover:scale-105 duration-500">
        <div className="text-center mb-8">
          <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner shadow-pink-200">
            <ShieldCheck className="text-pink-600 drop-shadow-md" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Secure <span className="text-pink-600">Reset</span></h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Please enter a new, secure password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="New Password" 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all bg-white/50 focus:bg-white text-slate-800"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all bg-white/50 focus:bg-white text-slate-800"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? 'Securing Account...' : 'Confirm Reset'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          <Link to="/login" className="text-slate-400 hover:text-slate-600 font-bold hover:underline underline-offset-4 transition-all">Cancel and Return</Link>
        </p>
      </div>
    </div>
  );
}
