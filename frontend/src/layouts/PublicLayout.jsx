import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export function PublicLayout({ children }) {
  return <div className="public-layout"><Navbar />{children}<Footer /></div>;
}
