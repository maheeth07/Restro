import { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, ChevronRight, Plus, Minus, Search, Trash2, CheckCircle2, UtensilsCrossed, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResponsiveGallery = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="w-full text-center py-24 flex flex-col items-center opacity-60">
        <span className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">📸</span>
        <h3 className="font-bold text-stone-600 uppercase tracking-widest">No Gallery Added</h3>
        <p className="text-sm font-medium text-stone-400 mt-2">The restaurant hasn't uploaded interior photos yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 w-full animate-[fadeIn_1s_ease-out]">

      {/* 1 Image Layout */}
      {images.length === 1 && (
        <div className="h-48 sm:h-72 w-full rounded-[2rem] overflow-hidden shadow-lg border border-stone-200/50">
          <img src={images[0]} alt="Restaurant" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </div>
      )}

      {/* 2 Images Layout */}
      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 h-48 sm:h-72">
          <div className="rounded-[2rem] overflow-hidden shadow-md border border-stone-200/50"><img src={images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
          <div className="rounded-[2rem] overflow-hidden shadow-md border border-stone-200/50"><img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
        </div>
      )}

      {/* 3 Images Layout */}
      {images.length === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-[400px] sm:h-80">
          <div className="rounded-[2rem] overflow-hidden shadow-md border border-stone-200/50 sm:h-full h-48">
            <img src={images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="grid grid-rows-2 gap-3 sm:gap-4 h-48 sm:h-full">
            <div className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-stone-200/50"><img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
            <div className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-stone-200/50"><img src={images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
          </div>
        </div>
      )}

      {/* 4+ Images Bento Layout */}
      {images.length >= 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-3 sm:gap-4 h-[350px] sm:h-[400px]">
          <div className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden shadow-lg border border-stone-200/50">
            <img src={images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 delay-75" />
          </div>
          <div className="rounded-[1.5rem] overflow-hidden shadow-sm border border-stone-200/50"><img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 delay-100" /></div>
          <div className="rounded-[1.5rem] overflow-hidden shadow-sm border border-stone-200/50"><img src={images[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 delay-150" /></div>

          <div className="rounded-[1.5rem] overflow-hidden shadow-sm border border-stone-200/50 h-full"><img src={images[3]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 delay-200" /></div>

          <div className="rounded-[1.5rem] overflow-hidden shadow-sm border border-stone-200/50 relative group cursor-pointer h-full">
            <img src={images[4] || images[0]} className={`w-full h-full object-cover ${images.length > 4 ? '' : 'hidden'}`} />
            {images.length > 4 ? (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl flex-col group-hover:bg-stone-900/40 transition-colors">
                <span>+{images.length - 4}</span>
                <span className="text-xs uppercase tracking-widest mt-1 opacity-80">More</span>
              </div>
            ) : (
              <img src={images[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 delay-300" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CustomerMenu() {
  const { branchId } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');

  const [branch, setBranch] = useState(null);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { cart, addToCart, removeFromCart, decrementQty, clearCart, totalAmount } = useContext(CartContext);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [activeBill, setActiveBill] = useState(null);
  const [activeTab, setActiveTab] = useState('Menu'); // 'Menu' | 'Venue'

  useEffect(() => {
    fetchData();
    fetchActiveBill();
  }, [branchId]);

  const fetchActiveBill = async () => {
    if (!tableNumber) return;
    try {
      const res = await axios.get(`http://https://restro-nine-tau.vercel.app//api/orders/active/${branchId}/${tableNumber}`);
      setActiveBill(res.data);
      if (res.data?.customerName) setCustomerName(res.data.customerName);
    } catch (err) { console.error('Failed to fetch running bill'); }
  };

  const fetchData = async () => {
    try {
      const [resBranch, resMenu] = await Promise.all([
        axios.get(`http://https://restro-nine-tau.vercel.app//api/branches/public/${branchId}`),
        axios.get(`http://https://restro-nine-tau.vercel.app//api/menu/${branchId}`)
      ]);
      setBranch(resBranch.data);
      setMenus(resMenu.data);

      const cats = ['All', ...new Set(resMenu.data.map(m => m.category))];
      setCategories(cats);
    } catch (err) { console.error('Error fetching data'); }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Cart is empty!');
    if (!tableNumber) return toast.error('Table number missing in URL!');

    setOrdering(true);
    try {
      await axios.post('http://https://restro-nine-tau.vercel.app//api/orders', {
        branchId,
        tableNumber,
        customerName: customerName || 'Guest',
        items: cart.map(i => ({ name: i.name, quantity: i.qty, price: i.price, menuId: i._id })),
        totalAmount
      });
      toast.success('Order placed successfully! We are preparing it.');
      clearCart();
      setCartOpen(false);
      fetchActiveBill(); // Instantly refresh the running bill with the fresh aggregates
    } catch (err) {
      toast.error('Failed to place order.');
    } finally {
      setOrdering(false);
    }
  };

  const filteredMenu = menus.filter(m => {
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!branch) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <UtensilsCrossed size={48} className="text-amber-600 animate-bounce" />
        <div className="text-lg font-black tracking-[0.3em] text-white uppercase animate-pulse">Loading Menu</div>
      </div>
    </div>
  );

  const cartItemCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <div className="min-h-screen bg-[#f8f8f6] font-sans pb-24 selection:bg-amber-700/20 selection:text-amber-900">
      {/* Hero Header with Restaurant Name Overlap */}
      <div className="relative bg-zinc-950 text-white pt-12 pb-28 px-6 sm:px-10 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(180,83,9,0.3),_transparent_60%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(120,113,108,0.2),_transparent_50%)]"></div>
        </div>
        <div className="relative z-10 flex justify-between items-start max-w-7xl mx-auto">
          <div>
            <p className="text-amber-500 font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase flex items-center gap-2">
              <MapPin size={14} /> {branch.name}
            </p>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-400 drop-shadow-sm">
              {branch.restaurantId?.name || 'Restaurant'}
            </h1>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg cursor-default hover:bg-white/15 transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
              <span className="text-sm font-bold tracking-widest uppercase text-stone-100">Table {tableNumber || 'Unknown'}</span>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full flex items-center justify-center relative hover:bg-white/20 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl group animate-[fadeSlideDown_0.6s_ease-out_0.2s_both]"
          >
            <ShoppingBag size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
            {(cartItemCount > 0 || activeBill) && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-zinc-950 text-xs font-black rounded-full border-2 border-zinc-900 flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                {cartItemCount > 0 ? cartItemCount : '!'}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Content Wrapper (Matches Max Width and Overlaps Header) */}
      <div className="-mt-14 relative z-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out_0.2s_both]">

        {/* Main View Tabs (Segmented Control) */}
        <div className="bg-white/90 backdrop-blur-3xl border border-white/50 rounded-[2rem] p-2 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex max-w-xs mx-auto mb-8 relative z-30">
          <button
            onClick={() => setActiveTab('Menu')}
            className={`flex-1 py-3.5 text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-500 ease-out ${activeTab === 'Menu' ? 'bg-zinc-950 text-amber-500 shadow-xl shadow-zinc-900/20 scale-100' : 'text-stone-500 hover:text-stone-800 scale-95 hover:bg-stone-50/50'}`}
          >
            The Menu
          </button>
          <button
            onClick={() => setActiveTab('Venue')}
            className={`flex-1 py-3.5 text-xs sm:text-sm font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-500 ease-out ${activeTab === 'Venue' ? 'bg-zinc-950 text-amber-500 shadow-xl shadow-zinc-900/20 scale-100' : 'text-stone-500 hover:text-stone-800 scale-95 hover:bg-stone-50/50'}`}
          >
            The Venue
          </button>
        </div>

        {/* Conditional Rendering Block */}
        <div className="transition-all duration-500 min-h-[500px]">
          {activeTab === 'Menu' ? (
            <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
              {/* Search & Categories Glass Bar */}
              <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] p-2.5 shadow-[0_10px_40px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row gap-3 items-center">
                <div className="relative w-full lg:w-96 flex-shrink-0 group">
                  <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-600 transition-colors" strokeWidth={2.5} />
                  <input type="text" placeholder="Search delicious food..." className="w-full pl-14 pr-5 py-4 rounded-[1.5rem] bg-stone-50/50 border border-stone-200/60 focus:bg-white focus:border-amber-600/50 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all text-stone-800 font-bold placeholder:font-medium placeholder-stone-400"
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="flex overflow-x-auto w-full gap-2 px-2 pb-1 lg:pb-0 scrollbar-hide snap-x">
                  {categories.map(c => (
                    <button key={c} onClick={() => setActiveCategory(c)}
                      className={`whitespace-nowrap snap-center px-7 py-3.5 rounded-[1.5rem] font-bold text-sm tracking-wide transition-all duration-300 shrink-0 border ${activeCategory === c
                          ? 'bg-zinc-900 text-amber-500 border-zinc-900 shadow-lg shadow-zinc-900/20 scale-105'
                          : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200/60 hover:border-stone-300 relative overflow-hidden group/cat'
                        }`}>
                      <div className="absolute inset-0 bg-stone-100 opacity-0 group-hover/cat:opacity-100 transition-opacity"></div>
                      <span className="relative z-10">{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredMenu.map(m => (
                  <div key={m._id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 border border-stone-100/50 flex flex-col group relative">

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-white/95 backdrop-blur-md text-zinc-900 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        {m.category}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="h-56 w-full bg-stone-100 relative overflow-hidden">
                      {m.image ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent z-0 opacity-80 group-hover:opacity-0 transition-opacity duration-500"></div>
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 font-medium">
                          <UtensilsCrossed size={32} className="mb-2 opacity-50" />
                          <span className="text-sm">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-stone-50/30">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <h3 className="font-bold text-xl text-zinc-900 leading-tight group-hover:text-amber-700 transition-colors">{m.name}</h3>
                        <span className="font-black text-amber-700 text-xl tracking-tight shrink-0 flex flex-col items-end">
                          ₹{m.price?.toFixed(2)}
                        </span>
                      </div>

                      {/* Spacer to push button to bottom */}
                      <div className="mt-auto pt-6 w-full">
                        {cart.find(i => i._id === m._id) ? (
                          <div className="flex items-center justify-between bg-white border border-stone-200/80 rounded-2xl p-1.5 h-[56px] shadow-sm">
                            <button onClick={() => decrementQty(m._id)} className="w-[44px] h-[44px] bg-stone-50 rounded-[14px] text-stone-600 flex justify-center items-center hover:bg-stone-100 hover:text-red-600 active:scale-95 transition-all">
                              {cart.find(i => i._id === m._id).qty === 1 ? <Trash2 size={18} /> : <Minus size={18} strokeWidth={3} />}
                            </button>
                            <span className="font-black text-xl text-zinc-900 w-12 text-center">{cart.find(i => i._id === m._id).qty}</span>
                            <button onClick={() => addToCart(m)} className="w-[44px] h-[44px] bg-zinc-950 text-amber-500 rounded-[14px] flex justify-center items-center hover:bg-zinc-800 active:scale-95 transition-all shadow-md shadow-zinc-900/20">
                              <Plus size={18} strokeWidth={3} />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(m)} className="w-full h-[56px] bg-zinc-950 hover:bg-zinc-900 active:scale-[0.98] text-amber-500 uppercase tracking-widest font-bold text-sm rounded-2xl transition-all shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2 overflow-hidden relative group/btn">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            <Plus size={20} className="relative z-10" />
                            <span className="relative z-10">Add to Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredMenu.length === 0 && (
                <div className="py-32 text-center flex flex-col items-center animate-pulse">
                  <Search size={48} className="text-stone-300 mb-4" />
                  <h3 className="text-2xl font-bold text-stone-700">No items found</h3>
                  <p className="text-stone-500 mt-2 font-medium">Try adjusting your category or search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_60px_rgb(0,0,0,0.04)] animate-[fadeIn_0.4s_ease-out]">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">The Venue</h2>
                <p className="font-bold text-stone-400 tracking-widest uppercase text-sm mt-1">Explore our Ambiance</p>
              </div>
              <ResponsiveGallery images={branch.images} />
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/60 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-md bg-[#f8f8f6] h-full shadow-[0_0_60px_rgb(0,0,0,0.5)] flex flex-col">
            {/* Drawer Header */}
            <div className="p-6 border-b border-stone-200/60 bg-white/90 backdrop-blur-xl flex justify-between items-center z-10 sticky top-0 relative shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900 flex items-center gap-3">
                <ShoppingBag className="text-amber-600" size={24} /> Your Tray
              </h2>
              <button onClick={() => setCartOpen(false)} className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-zinc-900 rounded-full flex justify-center items-center active:scale-90 transition-all font-bold">
                ✕
              </button>
            </div>

            {/* Drawer Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* Running Bill Section */}
              {activeBill && activeBill.items?.length > 0 && (
                <div className="mb-6 bg-stone-100 rounded-[1.5rem] p-5 shadow-inner border border-stone-200/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-stone-800 uppercase tracking-widest text-sm flex items-center gap-2 px-1">
                      <CheckCircle2 size={16} className="text-emerald-500" /> Running Bill
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {activeBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl shadow-sm border border-stone-200">
                        <div className="flex-1">
                          <p className="font-bold text-stone-800 text-sm leading-tight">{item.name}</p>
                          <p className="text-xs font-bold text-stone-400 mt-0.5 uppercase tracking-widest">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-black text-stone-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-end px-1">
                    <span className="font-black text-stone-500 uppercase text-xs tracking-widest">Running Total</span>
                    <span className="font-black text-2xl text-stone-800 tracking-tight">₹{activeBill.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Cart Section */}
              {cart.length > 0 && <h3 className="font-extrabold text-stone-800 uppercase tracking-widest text-sm mb-4 px-1">{activeBill ? 'New Additions' : 'Current Order'}</h3>}

              {cart.length === 0 && (!activeBill || activeBill.items?.length === 0) ? (
                <div className="text-center text-stone-400 mt-20 flex flex-col items-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-stone-100">
                    <UtensilsCrossed size={48} className="text-stone-200" />
                  </div>
                  <h3 className="font-black text-xl text-stone-700 uppercase tracking-widest mb-2">Tray is empty</h3>
                  <p className="text-sm font-medium text-stone-500">Pick some elegant dishes to proceed.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item._id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-stone-100 relative shadow-sm group hover:border-amber-200 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-800 leading-tight mb-1 pr-2">{item.name}</h4>
                      <p className="text-amber-700 font-black tracking-tight text-lg">₹{item.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl p-1 shadow-inner shrink-0">
                      <button onClick={() => decrementQty(item._id)} className="w-8 h-8 rounded-lg text-stone-600 bg-white border border-stone-200 flex items-center justify-center active:scale-90 hover:text-red-600 transition-all">
                        {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                      </button>
                      <span className="w-8 text-center font-black text-stone-800">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg text-amber-500 bg-zinc-950 flex items-center justify-center active:scale-90 transition-all">
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 ? (
              <div className="p-6 bg-white border-t border-stone-200/60 shadow-[0_-10px_40px_rgb(0,0,0,0.03)] z-10">
                <div className="flex justify-between items-end mb-6">
                  <span className="font-semibold text-stone-500 uppercase tracking-widest text-sm">New Addition Total</span>
                  <span className="font-black text-4xl text-amber-600 tracking-tighter">₹{totalAmount?.toFixed(2)}</span>
                </div>

                <div className="mb-6 relative">
                  <input type="text" placeholder="GUEST NAME (OPTIONAL)" className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-stone-800 placeholder-stone-400 text-sm uppercase tracking-widest"
                    value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>

                <button onClick={handlePlaceOrder} disabled={ordering} className="w-full h-[60px] bg-amber-600 text-white hover:bg-amber-700 font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-amber-600/30 flex justify-center items-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 disabled:shadow-none overflow-hidden relative">
                  {ordering ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      SENDING ADD-ON...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        <CheckCircle2 size={20} strokeWidth={3} /> {activeBill ? 'SEND ADD-ON' : 'SEND TO KITCHEN'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            ) : activeBill && (
              <div className="p-6 bg-stone-100 border-t border-stone-200 text-center text-sm font-bold text-stone-500 uppercase tracking-widest pt-5 pb-8">
                Your order is being prepared
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
