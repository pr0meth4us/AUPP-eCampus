import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brutal-yellow border-t-8 border-brutal-black mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mb-4 md:mb-0">
            <p className="font-black text-3xl tracking-tighter uppercase text-brutal-black">
              ED/CORE
            </p>
            <p className="text-xl font-bold text-brutal-black mt-2">NO FLUFF. PURE LEARNING.</p>
          </div>
          <div className="font-bold text-brutal-black uppercase tracking-wider bg-white px-4 py-2 border-4 border-brutal-black shadow-brutal">
            &copy; {new Date().getFullYear()} ED/CORE.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
