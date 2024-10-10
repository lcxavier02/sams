import { UserPayload } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ArticlesContainer from "@/components/ArticlesContainer";
import { FaPlus } from "react-icons/fa";

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

  const handleSearch = (term: string, searchBy: string) => {
    console.log(`Searching for "${term}" by ${searchBy}`);
    // Aquí irá la lógica para realizar la búsqueda
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <Navbar username={user.username} onLogout={handleLogout} />
          <div className="p-6 flex justify-between items-center">
            <SearchBar onSearch={handleSearch} />

            <button
              onClick={() => router.push('/articles/new')}
              className="flex items-center p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaPlus className="mr-2" /> Add Article
            </button>

          </div>

          <ArticlesContainer />
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
