import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Mail, ArrowRight, Store, LockKeyhole } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://https://restro-nine-tau.vercel.app//api/auth/forgotpassword', { email });
      toast.success('Reset link generated!');
      setResetLink(res.data.resetUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request reset');
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
            <LockKeyhole className="text-pink-600 drop-shadow-md" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Recover <span className="text-pink-600">Access</span></h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Enter your account email to receive a recovery link.</p>
        </div>

        {resetLink ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-4 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail size={24} />
            </div>
            <h3 className="text-emerald-800 font-bold">Simulation Environment</h3>
            <p className="text-sm text-emerald-600 font-medium">Since this is a local environment without SMTP email delivery configured, click the securely generated button below to proceed directly:</p>
            <Link to={resetLink.replace('http://localhost:5173', '')} className="inline-block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95">
              Proceed to Reset Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Account Email Address"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none transition-all bg-white/50 focus:bg-white text-slate-800"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? 'Searching...' : 'Find Account'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          Remembered your password? <Link to="/login" className="text-pink-600 hover:text-pink-700 font-bold hover:underline underline-offset-4 transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
