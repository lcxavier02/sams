import React from 'react';
import Profile from './Profile';
import Link from 'next/link';

interface NavBarProps {
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ username, onLogout }) => {
  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold">
        SAMS
      </Link>
      <Profile username={username} onLogout={onLogout} />
    </nav>
  );
};

export default Navbar;
