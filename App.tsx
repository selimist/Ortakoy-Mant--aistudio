import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchRestaurantDetails } from './services/geminiService';
import { RestaurantData } from './types';
import { MENU_ITEMS } from './constants';
import { MapPin, Star, Clock, Phone, Instagram, ChefHat, UtensilsCrossed, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const details = await fetchRestaurantDetails();
      setData(details);
      setLoading(false);
    };
    loadData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (loading || !data) return;

    const ctx = gsap.context(() => {
      // Hero Animation
      const tl = gsap.timeline();
      tl.from(".hero-text-reveal", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
      })
      .from(".hero-image", {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
      }, "-=1");

      // Story Section
      gsap.from(".story-content", {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Menu Cards Stagger
      gsap.from(".menu-card", {
        scrollTrigger: {
          trigger: menuRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      });

      // Reviews / Info
      gsap.from(".info-item", {
        scrollTrigger: {
          trigger: ".info-section",
          start: "top 85%",
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      });

    }, mainRef);

    return () => ctx.revert();
  }, [loading, data]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stone-50 text-manti-red">
        <div className="animate-pulse flex flex-col items-center">
          <ChefHat size={48} className="mb-4" />
          <span className="font-serif text-xl tracking-widest">ORTAKÖY MANTI EVİ</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div ref={mainRef} className="bg-manti-cream text-manti-dark font-sans selection:bg-manti-red selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 mix-blend-difference text-stone-100 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-2xl font-serif font-bold tracking-tighter">OME.</div>
        <div className="hidden md:flex space-x-8 text-sm font-semibold tracking-widest uppercase">
          <a href="#story" className="hover:text-manti-red transition-colors">Our Story</a>
          <a href="#menu" className="hover:text-manti-red transition-colors">Menu</a>
          <a href="#location" className="hover:text-manti-red transition-colors">Visit Us</a>
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs uppercase hover:bg-manti-red hover:text-white transition-colors duration-300">
          Book Table
        </button>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like scaling */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1604908177453-7462950a6a3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Delicious Manti" 
            className="hero-image w-full h-full object-cover brightness-[0.6]"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="hero-text-reveal text-stone-300 text-sm md:text-lg tracking-[0.3em] uppercase mb-4 font-bold">
            Traditional Taste
          </h2>
          <h1 className="hero-text-reveal text-5xl md:text-8xl lg:text-9xl font-serif text-white mb-8 leading-tight">
            Ortaköy<br/>Mantı Evi
          </h1>
          <p className="hero-text-reveal text-stone-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Experience the authentic taste of handmade Turkish dumplings in the heart of Istanbul.
          </p>
          <div className="hero-text-reveal flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#menu" className="group flex items-center gap-2 bg-manti-red text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-all">
              View Menu
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            {data.googleMapsUri && (
                <a 
                    href={data.googleMapsUri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-white border border-white/30 hover:bg-white/10 transition-all"
                >
                    <MapPin size={16} /> Locate Us
                </a>
            )}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" ref={storyRef} className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <ChefHat size={400} />
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="story-content order-2 md:order-1">
             <div className="inline-block px-3 py-1 bg-stone-100 text-manti-red text-xs font-bold tracking-widest uppercase mb-6 rounded-md">
                Est. 1999
             </div>
            <h2 className="text-4xl md:text-5xl font-serif text-manti-dark mb-8 leading-tight">
              A Symphony of Dough, <span className="text-manti-red italic">Yogurt</span> & Spice.
            </h2>
            <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
              <p>
                 {data.description}
              </p>
              <p>
                Our chefs meticulously fold each tiny dumpling by hand, ensuring the perfect ratio of dough to filling. Served with our signature garlic yogurt and sizzling red pepper butter, every bite is a tribute to Turkish culinary heritage.
              </p>
            </div>
            <div className="mt-10 flex gap-8 items-center border-t border-stone-100 pt-8">
               <div className="flex flex-col">
                  <span className="text-3xl font-serif text-manti-dark font-bold">{data.rating}</span>
                  <div className="flex text-manti-accent">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(data.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 mt-1">Based on {data.reviewCount} Reviews</span>
               </div>
               <div className="h-10 w-px bg-stone-200"></div>
               <div className="flex flex-col">
                 <span className="text-3xl font-serif text-manti-dark font-bold">100%</span>
                 <span className="text-xs text-stone-400 mt-1">Handmade Daily</span>
               </div>
            </div>
          </div>
          <div className="story-content order-1 md:order-2 relative">
             <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1647102604812-32a2251a2386?q=80&w=1200" 
                    alt="Chef preparing manti" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
             </div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-manti-cream rounded-full flex items-center justify-center p-4 shadow-xl hidden lg:flex">
                <div className="text-center">
                    <UtensilsCrossed className="mx-auto text-manti-red mb-2" size={32} />
                    <span className="block font-serif italic text-manti-dark">Authentic Recipe</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" ref={menuRef} className="py-24 px-6 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <span className="text-manti-red text-sm font-bold tracking-widest uppercase">Our Specialties</span>
             <h2 className="text-5xl font-serif text-manti-dark mt-4">The Menu</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENU_ITEMS.map((item) => (
              <div key={item.id} className="menu-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="h-64 overflow-hidden relative">
                    {item.popular && (
                        <div className="absolute top-4 right-4 bg-manti-red text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            POPULAR
                        </div>
                    )}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-manti-dark">{item.name}</h3>
                    <span className="text-manti-red font-bold font-serif text-lg">{item.price}</span>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4">{item.description}</p>
                  <button className="w-full py-2 border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider hover:bg-manti-dark hover:text-white transition-colors">
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info & Reviews Section (Grounding Data) */}
      <section id="location" className="info-section py-24 px-6 bg-manti-dark text-stone-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          
          {/* Contact & Location */}
          <div className="info-item space-y-8">
            <h2 className="text-4xl font-serif text-white mb-8">Visit Us</h2>
            
            <div className="flex items-start gap-4">
              <MapPin className="text-manti-red mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1">Address</h3>
                <p className="text-stone-400">{data.address}</p>
                {data.googleMapsUri && (
                    <a href={data.googleMapsUri} target="_blank" rel="noreferrer" className="text-xs text-manti-red uppercase font-bold mt-2 inline-block border-b border-manti-red pb-0.5">
                        Get Directions
                    </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-manti-red mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1">Opening Hours</h3>
                <p className="text-stone-400">Monday - Sunday</p>
                <p className="text-stone-400">11:00 AM - 11:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-manti-red mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1">Contact</h3>
                <p className="text-stone-400">+90 212 258 10 10</p>
                <div className="flex gap-4 mt-4">
                   <Instagram className="text-stone-400 hover:text-white cursor-pointer transition-colors" />
                   <Star className="text-stone-400 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Map / Reviews */}
          <div className="info-item">
             <h2 className="text-4xl font-serif text-white mb-8">Guest Reviews</h2>
             <div className="space-y-6">
                {data.reviews.map((review, idx) => (
                    <div key={idx} className="bg-stone-800/50 p-6 rounded-xl border border-stone-700 hover:border-manti-red/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                           <div className="flex text-manti-accent">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                ))}
                           </div>
                           <span className="text-xs text-stone-500 font-bold uppercase ml-auto">{review.source}</span>
                        </div>
                        <p className="text-stone-300 italic mb-4">"{review.text}"</p>
                        <p className="text-sm font-bold text-white">- {review.author}</p>
                    </div>
                ))}
             </div>
             
             {/* Simple Map Placeholder/Image since we can't embed real interactive map easily without separate API key loaded in script tag */}
             <div className="mt-8 h-48 w-full rounded-xl overflow-hidden relative group cursor-pointer">
                 <img 
                    src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop" 
                    alt="Istanbul Map Location" 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs uppercase flex items-center gap-2 group-hover:scale-105 transition-transform">
                        <MapPin size={14} className="text-manti-red" />
                        Open in Maps
                    </span>
                 </div>
                 {data.googleMapsUri && <a href={data.googleMapsUri} target="_blank" rel="noreferrer" className="absolute inset-0 z-10"></a>}
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-stone-600 py-12 px-6 text-center text-sm">
        <div className="flex justify-center items-center gap-2 mb-4 text-white font-serif text-xl">
           Ortaköy Mantı Evi
        </div>
        <p>© {new Date().getFullYear()} All rights reserved. Designed with ❤️ in Istanbul.</p>
      </footer>
    </div>
  );
};

export default App;