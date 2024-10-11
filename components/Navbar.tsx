import React from 'react';
import Profile from './Profile';
import Link from 'next/link';

interface NavBarProps {
  username: string;
  onLogout: () => void;
}

/**
 * Navbar component renders a navigation bar with a logo and user profile.
 * 
 * @component
 * @example
 * return (
 *   <Navbar username="JohnDoe" onLogout={handleLogout} />
 * )
 * 
 * @param {Object} props - Component properties
 * @param {string} props.username - The username of the logged-in user
 * @param {Function} props.onLogout - Function to handle user logout
 * 
 * @returns {JSX.Element} The Navbar component
 */
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
