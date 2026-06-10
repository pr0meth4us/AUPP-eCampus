import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Video, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-[90vh] bg-brutal-bg px-6 py-12 md:py-24 border-x-4 border-brutal-black max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-32">
        <div className="flex-1 space-y-8">
          <div className="inline-block bg-brutal-yellow border-4 border-brutal-black px-4 py-2 brutal-card rotate-2">
            <span className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap size={16} /> Beta Version Live
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none border-b-8 border-brutal-black pb-6">
            Master <br/>
            Your <br/>
            <span className="text-brutal-red bg-brutal-black px-4 text-white inline-block -rotate-1 mt-2 shadow-brutal">Future.</span>
          </h1>
          
          <p className="text-xl md:text-3xl font-bold max-w-2xl border-l-8 border-brutal-blue pl-6 py-2 bg-white/50">
            ED/CORE is the brutalist approach to modern education. No fluff, just pure learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <Link to="/catalog" className="bg-brutal-blue text-white text-center py-4 px-8 text-xl brutal-button">
              Explore Courses →
            </Link>
            <Link to="/signup" className="bg-white text-brutal-black text-center py-4 px-8 text-xl brutal-button">
              Start Now
            </Link>
          </div>
        </div>
        
        <div className="flex-1 relative w-full aspect-square md:aspect-[4/3] bg-brutal-yellow border-4 border-brutal-black shadow-brutal-lg brutal-card overflow-hidden group">
          <div className="absolute inset-0 bg-brutal-black text-white p-8 flex flex-col justify-end translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
            <h3 className="text-4xl font-black uppercase">CS301: Digital Architectures</h3>
            <p className="text-xl font-bold mt-2">Enrollment closing soon.</p>
          </div>
          {/* Mock image placeholder using brutalist solid colors */}
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 bg-brutal-red border-b-4 border-brutal-black"></div>
            <div className="flex-1 bg-brutal-blue"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white border-4 border-brutal-black rounded-full shadow-brutal flex items-center justify-center">
              <span className="font-black text-4xl">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="border-t-8 border-brutal-black pt-16">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">
          Why Learn Here?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-brutal-yellow p-8 brutal-card">
            <div className="w-16 h-16 bg-white border-4 border-brutal-black rounded-full flex items-center justify-center mb-6 shadow-brutal">
              <Video className="text-brutal-black" size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">Raw Content</h3>
            <p className="text-lg font-bold">Thousands of hours of unedited, pure academic lectures. No cinematic fluff.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-brutal-red p-8 brutal-card text-white">
            <div className="w-16 h-16 bg-brutal-black border-4 border-white rounded-full flex items-center justify-center mb-6 shadow-brutal">
              <BookOpen className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">Brutal Exams</h3>
            <p className="text-lg font-bold">Test your knowledge with hands-on assignments that actually challenge you.</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-brutal-blue p-8 brutal-card text-white">
            <div className="w-16 h-16 bg-white border-4 border-brutal-black rounded-full flex items-center justify-center mb-6 shadow-brutal">
              <Users className="text-brutal-black" size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4">Global Network</h3>
            <p className="text-lg font-bold">Connect with peers globally. Build projects that matter.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
