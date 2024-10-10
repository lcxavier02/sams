import React, { useEffect, useRef, useState } from 'react';

interface ProfileProps {
  username: string;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ username, onLogout }) => {
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials = username
    .split(' ')
    .map((name) => name[0].toUpperCase())
    .join('');

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  // Manejar el clic fuera del área del perfil para cerrar el menú de logout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowLogout(false); // Cerrar el menú de logout si se hace clic fuera
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={profileRef}
      className="relative flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition duration-300 cursor-pointer"
      onClick={handleProfileClick}
    >
      <div
        className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full"
      >
        {initials}
      </div>

      <span className="text-white font-medium">{username}</span>

      {showLogout && (
        <button
          onClick={onLogout}
          className="absolute top-12 right-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Profile;
