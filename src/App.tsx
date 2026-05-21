import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Search, Heart, MapPin, MessageCircle, Truck, Shield, Star, Instagram, Facebook, Plus, Minus, Trash2 } from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Premium Black Abaya',
    price: '8,500',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Abayas',
    badge: 'NEW',
    colors: ['#000000', '#2d2d2d']
  },
  {
    id: 2,
    name: 'Dubai Style Silk Abaya',
    price: '12,000',
    image: 'https://images.pexels.com/photos/975250/pexels-photo-975250.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Premium Collection',
    colors: ['#000000', '#1a365d', '#4a5568']
  },
  {
    id: 3,
    name: 'Everyday Chiffon Hijab',
    price: '1,500',
    image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Hijabs',
    badge: 'BESTSELLER',
    colors: ['#d2b48c', '#8b4513', '#a0522d']
  },
  {
    id: 4,
    name: 'Luxury Embellished Abaya',
    price: '15,500',
    image: 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Eid Collection',
    colors: ['#000000']
  }
];

const CATEGORIES = [
  'Abayas', 'Hijabs', 'Eid Collection', 'Casual Wear', 'Premium Collection'
];

const GALLERY = [
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/247204/pexels-photo-247204.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/794062/pexels-photo-794062.jpeg?auto=compress&cs=tinysrgb&w=600'
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<{product: typeof PRODUCTS[0], quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, {product, quantity: 1}];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? {...item, quantity: newQ} : item;
      }
      return item;
    }));
  };

  const getTotalCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const priceNum = parseInt(item.product.price.replace(/,/g, ''), 10);
      return total + (priceNum * item.quantity);
    }, 0).toLocaleString();
  };

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    let msg = `Hello Zaland Collection! I would like to order:\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.product.name} (x${item.quantity}) - Rs. ${item.product.price}\n`;
    });
    msg += `\nTotal Amount: Rs. ${getTotalPrice()}`;
    const url = `https://wa.me/923329260721?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-[#c8a96a] selection:text-black pb-[70px] lg:pb-0">
      
      {/* NAVBAR */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'glass-dark py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex-1 flex items-center">
             <button 
              className={`lg:hidden mr-6 transition hover:text-[#c8a96a] text-white`} 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <a 
              href="#" 
              className={`font-[Poppins] font-medium text-2xl tracking-[0.2em] transition text-white hover:text-[#c8a96a]`}
            >
              ZALAND
            </a>
          </div>

          <div className="hidden lg:flex flex-1 justify-center gap-10 items-center text-[12px] font-medium tracking-[0.15em] uppercase">
            <a href="#about" className={`transition hover:text-[#c8a96a] text-gray-300`}>About</a>
            <a href="#categories" className={`transition hover:text-[#c8a96a] text-gray-300`}>Categories</a>
            <a href="#shop" className={`transition hover:text-[#c8a96a] text-gray-300`}>Shop</a>
            <a href="#contact" className={`transition hover:text-[#c8a96a] text-gray-300`}>Contact</a>
          </div>

          <div className={`flex flex-1 justify-end items-center gap-6 transition text-white`}>
            <button className="hover:text-[#c8a96a] transition"><Search size={20} strokeWidth={1.5} /></button>
            <button className="hover:text-[#c8a96a] transition hidden sm:block"><Heart size={20} strokeWidth={1.5} /></button>
            <button className="hover:text-[#c8a96a] transition relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {getTotalCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c8a96a] text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {getTotalCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-[300px] z-[70] bg-[#0a0a0a] lg:hidden flex flex-col pt-6 px-8 shadow-2xl border-r border-[#ffffff10]"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-[Poppins] font-medium text-xl tracking-[0.2em] text-white">ZALAND</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white transition">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col gap-8 text-[13px] font-medium tracking-[0.15em] uppercase">
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-[#c8a96a] transition">About Us</a>
                <a href="#categories" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-[#c8a96a] transition">Categories</a>
                <a href="#shop" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-[#c8a96a] transition">Shop</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-[#c8a96a] transition">Contact</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 w-full h-[100dvh] sm:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#050505] shrink-0">
                <h2 className="font-[Poppins] font-medium tracking-wider text-xl">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-light">Your cart is empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover rounded-sm" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{item.product.name}</h4>
                        <p className="text-[#c8a96a] text-sm mb-2">Rs. {item.product.price}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 glass-dark hover:bg-white/10 rounded-sm">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 glass-dark hover:bg-white/10 rounded-sm">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-gray-500 hover:text-red-400 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-[#050505] border-t border-white/10 shrink-0 pb-safe sm:pb-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 uppercase tracking-widest text-xs font-medium">Total</span>
                    <span className="font-[Poppins] text-xl text-[#c8a96a]">Rs. {getTotalPrice()}</span>
                  </div>
                  <button 
                    onClick={checkoutWhatsApp}
                    className="w-full py-4 bg-[#c8a96a] hover:bg-[#b6985a] text-black font-medium uppercase tracking-[0.1em] text-[13px] transition flex items-center justify-center gap-2 rounded-sm"
                  >
                    <MessageCircle size={18} />
                    Order via WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=2000" 
            alt="Hero Zaland" 
            className="w-full h-full object-cover object-[center_30%] md:object-[center_top]"
          />
          {/* Refined gradient overlay: dark bottom/top, soft gold hue in middle */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80" />
          <div className="absolute inset-0 bg-[#c8a96a]/5 mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center mt-[-40px]">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[#c8a96a] tracking-[0.25em] text-[12px] md:text-[14px] font-medium uppercase mb-4"
          >
            New Season
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-[Poppins] font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] text-white mb-6 uppercase tracking-wide"
          >
            Premium Abayas <br className="hidden md:block"/> & Modest Fashion
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto"
          >
            <a 
              href="#shop" 
              className="w-full sm:w-auto px-10 py-4 bg-[#c8a96a] text-black font-semibold tracking-[0.1em] uppercase text-[13px] hover:bg-white hover:-translate-y-1 transition-all duration-300 rounded-sm"
            >
              Shop Now
            </a>
            <a 
              href="https://wa.me/923329260721" target="_blank" rel="noreferrer"
              className="w-full sm:w-auto px-10 py-4 border border-[#c8a96a] text-[#c8a96a] font-semibold tracking-[0.1em] uppercase text-[13px] hover:bg-[#c8a96a] hover:text-black hover:-translate-y-1 transition-all duration-300 rounded-sm"
            >
              WhatsApp Order
            </a>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#c8a96a] tracking-[0.2em] text-xs font-medium uppercase mb-4">The Brand</p>
            <h2 className="font-[Poppins] text-3xl md:text-4xl font-medium mb-6 tracking-wide">Zaland Collection</h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 font-light">
              Elevate your modest wardrobe with our carefully curated collection of premium abayas and hijabs. Designed for the modern woman who values elegance, quality, and comfort.
            </p>
            <div className="flex items-start gap-4 mb-8 bg-white/5 p-6 rounded-sm border border-white/10 hover:border-[#c8a96a]/30 transition-colors">
              <Truck className="text-[#c8a96a] shrink-0 mt-1" />
              <div>
                <h4 className="font-medium mb-1 tracking-wide">Nationwide Delivery</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">Online delivery available securely across all cities in Pakistan.</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] relative max-w-sm mx-auto lg:max-w-none">
              <img 
                src="https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="About Zaland" 
                className="w-full h-full object-cover rounded-sm shadow-2xl"
              />
              <div className="absolute inset-0 border border-[#c8a96a]/30 rounded-sm transform translate-x-4 translate-y-4 -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section id="categories" className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
          <h2 className="font-[Poppins] text-3xl font-medium mb-4 tracking-wide">Shop by Category</h2>
          <div className="w-12 h-[2px] bg-[#c8a96a] mx-auto" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x">
            {CATEGORIES.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="snap-center shrink-0 w-64 aspect-[4/5] relative group cursor-pointer overflow-hidden rounded-sm"
              >
                <img 
                  src={PRODUCTS[idx % PRODUCTS.length].image} 
                  alt={cat} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-0 right-0 text-center transform group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="font-[Poppins] text-lg font-medium mb-1 tracking-wide">{cat}</h3>
                  <p className="text-[#c8a96a] text-[11px] tracking-[0.2em] uppercase font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-16 px-4">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <p className="text-[#c8a96a] tracking-[0.2em] text-xs font-medium uppercase mb-3">Curated For You</p>
            <h2 className="font-[Poppins] text-3xl md:text-3xl font-medium tracking-wide">Featured Collection</h2>
          </div>
          <a href="#" className="hidden sm:inline-block text-[11px] uppercase tracking-[0.15em] font-medium border-b border-[#c8a96a]/50 pb-1 hover:text-[#c8a96a] hover:border-[#c8a96a] transition-all">View All</a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
          {PRODUCTS.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group flex flex-col hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111] mb-4 sm:mb-5 rounded-sm">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {product.badge && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#c8a96a] px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase text-black z-10 shadow-sm rounded-sm">
                    {product.badge}
                  </div>
                )}
                
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden md:block">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 sm:py-3 bg-white text-black font-semibold tracking-widest uppercase text-[10px] sm:text-[11px] hover:bg-[#c8a96a] hover:text-black transition-colors duration-300 pointer-events-auto rounded-sm line-clamp-1"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-1">
                <p className="text-gray-500 text-[9px] sm:text-[11px] uppercase tracking-wider mb-1.5 sm:mb-2">{product.category}</p>
                <h3 className="font-[Poppins] font-medium text-[13px] sm:text-sm text-gray-100 mb-1 sm:mb-2 leading-tight tracking-wide line-clamp-2">{product.name}</h3>
                
                <div className="flex items-center justify-between mb-2 sm:mb-0 mt-auto">
                  <p className="text-[#c8a96a] text-[13px] sm:text-sm font-medium">Rs. {product.price}</p>
                  <div className="flex -space-x-1 sm:space-x-1 sm:-space-x-0">
                    {product.colors?.map((color, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 md:hidden">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-2 sm:py-3 bg-transparent text-white font-medium text-[9px] sm:text-[11px] tracking-widest uppercase border border-white/20 hover:bg-[#c8a96a] hover:text-black hover:border-transparent transition-colors duration-300 rounded-sm flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={12} className="sm:hidden" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center sm:hidden">
          <a href="#all" className="inline-block px-10 py-4 border border-[#c8a96a] text-[#c8a96a] font-medium tracking-[0.1em] uppercase text-xs hover:bg-[#c8a96a] hover:text-black transition-all duration-300 rounded-sm">
            View All Products
          </a>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Secure across Pakistan' },
              { icon: Star, title: 'Premium Quality', desc: 'Finest handpicked fabrics' },
              { icon: Shield, title: 'Trusted Brand', desc: 'Secure ordering process' },
              { icon: MessageCircle, title: 'Easy WhatsApp', desc: 'Instant dedicated support' }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center group">
                  <div className="w-14 h-14 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-5 group-hover:border-[#c8a96a] group-hover:bg-[#c8a96a]/10 transition-colors duration-300">
                    <Icon size={20} className="text-[#c8a96a]" />
                  </div>
                  <h4 className="font-[Poppins] font-medium text-[15px] mb-2 tracking-wide">{feature.title}</h4>
                  <p className="text-[13px] text-gray-400 font-light">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-2 pt-24 bg-[#050505] overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="font-[Poppins] text-3xl font-medium tracking-wide mb-4">@ZalandCollection</h2>
          <p className="text-gray-400 font-light text-sm">Follow us on Instagram for daily inspiration</p>
        </div>
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex gap-2 w-max pb-12"
        >
          {[...GALLERY, ...GALLERY, ...GALLERY, ...GALLERY].map((img, idx) => (
            <div key={idx} className="w-48 sm:w-64 md:w-80 aspect-square group relative shrink-0">
               <img 
                 src={img} 
                 alt="Instagram gallery" 
                 loading="lazy"
                 className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-700" 
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300 flex items-center justify-center">
                 <Instagram className="text-white opacity-0 group-hover:opacity-100 transition transform scale-50 group-hover:scale-100 duration-300" size={32} strokeWidth={1.5} />
               </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CONTACT & FOOTER */}
      <section id="contact" className="pt-24 pb-12 px-6 md:px-12 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="font-[Poppins] text-3xl font-medium tracking-wide mb-6">Get in Touch</h2>
            <p className="text-gray-400 font-light leading-relaxed mb-10 max-w-sm">
              Have a question about our collections or need help with your order? Our dedicated team is available to assist you.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#c8a96a] mt-1 shrink-0" size={24} strokeWidth={1.5} />
                <div>
                  <h4 className="font-medium tracking-wide mb-1">Store Location</h4>
                  <p className="text-gray-400 font-light text-[13px] leading-relaxed">Sadar Bazar Deans<br/>Shop No UG-239</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="text-[#c8a96a] mt-1 shrink-0" size={24} strokeWidth={1.5} />
                <div>
                  <h4 className="font-medium tracking-wide mb-1">WhatsApp Order</h4>
                  <p className="text-gray-400 font-light text-[13px]">0332-9260721</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a href="https://wa.me/923329260721" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#c8a96a] text-[#c8a96a] hover:bg-[#c8a96a] hover:text-black font-semibold rounded-sm transition-colors uppercase tracking-[0.1em] text-[12px]">
                <MessageCircle size={18} />
                Message Us
              </a>
            </div>
          </div>

          <div className="bg-[#111] p-8 md:p-10 rounded-sm border border-white/5">
            <h3 className="font-[Poppins] text-xl font-medium tracking-wide mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div>
                <input type="text" placeholder="Full Name" className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-[#c8a96a] transition-colors text-[13px] font-light placeholder:text-gray-500" />
              </div>
              <div>
                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-[#c8a96a] transition-colors text-[13px] font-light placeholder:text-gray-500" />
              </div>
              <div>
                <textarea rows={4} placeholder="Your Message" className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-[#c8a96a] transition-colors resize-none text-[13px] font-light placeholder:text-gray-500"></textarea>
              </div>
              <button type="button" className="w-full bg-[#c8a96a] hover:bg-[#b6985a] text-black font-semibold py-4 transition uppercase tracking-[0.1em] text-[12px] rounded-sm mt-4">
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto border-t border-white/10 pt-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="font-[Poppins] font-medium text-xl tracking-[0.2em] mb-2 text-white">ZALAND</h1>
            <p className="text-gray-500 text-[12px] font-light">Premium Abayas & Modest Fashion.</p>
          </div>
          
          <div className="flex gap-8 text-[12px] text-gray-400 font-light uppercase tracking-wider">
            <a href="#" className="hover:text-[#c8a96a] transition">Privacy</a>
            <a href="#" className="hover:text-[#c8a96a] transition">Terms</a>
            <a href="#" className="hover:text-[#c8a96a] transition">Shipping</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#c8a96a] hover:border-[#c8a96a] hover:text-black transition-colors text-gray-400">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#c8a96a] hover:border-[#c8a96a] hover:text-black transition-colors text-gray-400">
              <Facebook size={16} />
            </a>
          </div>
        </footer>
        <div className="text-center mt-8 text-[11px] text-gray-600 font-light tracking-wide pb-safe sm:pb-0">
          &copy; {new Date().getFullYear()} Zaland Collection. All rights reserved.
        </div>
      </section>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 z-50 px-6 py-4 flex justify-between items-center pb-safe">
        <a href="#" className="flex flex-col items-center gap-1.5 text-[#c8a96a]">
          <Menu size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-medium uppercase tracking-wider">Home</span>
        </a>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#c8a96a] transition relative"
        >
          <div className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {getTotalCount() > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#c8a96a] text-black text-[9px] font-bold h-3 w-3 flex items-center justify-center rounded-full"></span>
            )}
          </div>
          <span className="text-[9px] font-medium uppercase tracking-wider">Cart</span>
        </button>
        <a href="https://wa.me/923329260721" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#c8a96a] transition">
          <MessageCircle size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-medium uppercase tracking-wider">Order</span>
        </a>
        <a href="#contact" className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#c8a96a] transition">
          <MapPin size={20} strokeWidth={1.5} />
          <span className="text-[9px] font-medium uppercase tracking-wider">Visit</span>
        </a>
      </div>
    </div>
  );
}

