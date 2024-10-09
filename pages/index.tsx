import { UserPayload } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const router = useRouter();

  const getProfile = async () => {
    try {
      const profile = await axios.get('/api/profile', {
        withCredentials: true,
      });
      setUser(profile.data);
    } catch (error) {
      console.error('Error obteniendo el perfil:', error);
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
      });

      router.push('/login');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };


  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <h1>Hola {user ? user.username : 'Invitado'}</h1>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
