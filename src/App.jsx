/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  ArrowLeft, 
  Maximize2, 
  Trophy, 
  Flame, 
  Clock, 
  Star,
  ChevronRight,
  Car
} from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="p-2 bg-orange-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Car className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Norris<span className="text-orange-500">Nation</span>
            </span>
          </div>

          {!selectedGame && (
            <div className="flex-1 max-w-md relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">Server Online</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div 
              key="game-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Library</span>
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedGame.category}
                  </span>
                </div>
                <button 
                  onClick={handleFullscreen}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/5">
                <iframe 
                  id="game-iframe"
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold">About {selectedGame.title}</h3>
                  <p className="text-white/60 leading-relaxed">
                    {selectedGame.description}
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                  <h4 className="font-bold uppercase tracking-widest text-xs text-white/40">Game Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Rating</span>
                      <div className="flex items-center gap-1 text-orange-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">4.8</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Players</span>
                      <span className="font-bold">12.4k</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Difficulty</span>
                      <span className="font-bold text-orange-500">Pro</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="library-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="relative h-[400px] rounded-3xl overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/racing-hero/1200/600" 
                  alt="Hero" 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-12 space-y-4">
                  <div className="flex items-center gap-2 text-orange-500">
                    <Flame className="w-5 h-5 animate-bounce" />
                    <span className="font-bold uppercase tracking-widest text-sm">Trending Now</span>
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                    Unleash the <br />
                    <span className="text-orange-500">Speed Demon</span>
                  </h1>
                  <p className="text-white/60 max-w-md text-lg">
                    Experience the most intense unblocked driving games. No downloads, no limits, just pure adrenaline.
                  </p>
                  <button 
                    onClick={() => setSelectedGame(gamesData[0])}
                    className="px-8 py-4 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    Play Featured <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </section>

              {/* Categories & Filter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat 
                        ? 'bg-orange-500 text-black' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>New Releases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>Top Rated</span>
                  </div>
                </div>
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                          onClick={() => setSelectedGame(game)}
                          className="px-6 py-3 bg-orange-500 text-black font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform flex items-center gap-2"
                        >
                          Play Now <Gamepad2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest border border-white/10">
                        {game.category}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg group-hover:text-orange-500 transition-colors">{game.title}</h3>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">4.8</span>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm line-clamp-2">
                        {game.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20 space-y-4">
                  <div className="p-6 bg-white/5 rounded-full w-fit mx-auto border border-white/10">
                    <Search className="w-12 h-12 text-white/20" />
                  </div>
                  <h3 className="text-2xl font-bold">No games found</h3>
                  <p className="text-white/40">Try searching for something else or check another category.</p>
                  <button 
                    onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                    className="text-orange-500 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-black tracking-tighter uppercase italic">
                  Norris<span className="text-orange-500">Nation</span>
                </span>
              </div>
                <p className="text-white/40 text-sm leading-relaxed">
                  The #1 destination for unblocked driving games. Built for speed, designed for fun.
                </p>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><button onClick={() => setSelectedGame(null)} className="hover:text-orange-500 transition-colors">Home</button></li>
                <li><button className="hover:text-orange-500 transition-colors">New Games</button></li>
                <li><button className="hover:text-orange-500 transition-colors">Top Rated</button></li>
                <li><button className="hover:text-orange-500 transition-colors">Categories</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Categories</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><button onClick={() => setActiveCategory('Driving')} className="hover:text-orange-500 transition-colors">Driving</button></li>
                <li><button onClick={() => setActiveCategory('Racing')} className="hover:text-orange-500 transition-colors">Racing</button></li>
                <li><button onClick={() => setActiveCategory('Drift')} className="hover:text-orange-500 transition-colors">Drift</button></li>
                <li><button onClick={() => setActiveCategory('Stunts')} className="hover:text-orange-500 transition-colors">Stunts</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Status</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-medium">All systems operational</span>
                </div>
                <p className="text-[10px] text-white/20 leading-relaxed uppercase tracking-tighter">
                  Norris Nation is a community-driven platform. All games are provided for educational and entertainment purposes.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            <div className="flex items-center gap-4">
              <span>© 2026 Norris Nation. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
