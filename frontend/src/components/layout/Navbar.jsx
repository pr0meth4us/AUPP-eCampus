import React from 'react';
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <HeroNavbar maxWidth="full" className="bg-brutal-bg border-b-4 border-brutal-black sticky top-0 z-50 h-20">
      <NavbarBrand>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brutal-yellow border-2 border-brutal-black brutal-card flex items-center justify-center font-black">
            e
          </div>
          <p className="font-black text-2xl tracking-tighter uppercase text-brutal-black">
            ED/CORE
          </p>
        </Link>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem isActive={location.pathname === '/'}>
          <Link to="/" className={`font-bold text-lg uppercase tracking-wide border-b-4 ${location.pathname === '/' ? 'border-brutal-black' : 'border-transparent hover:border-brutal-blue'}`}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === '/catalog'}>
          <Link to="/catalog" className={`font-bold text-lg uppercase tracking-wide border-b-4 ${location.pathname === '/catalog' ? 'border-brutal-black' : 'border-transparent hover:border-brutal-blue'}`}>
            Catalog
          </Link>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden lg:flex">
          <Link to="/login" className="font-bold text-lg uppercase hover:underline decoration-4 underline-offset-4">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/signup" className="px-6 py-2 bg-brutal-yellow text-brutal-black brutal-button">
            Sign Up
          </Link>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
};

export default Navbar;
