import React, { FormEventHandler, ChangeEvent, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';

function LogIn() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!credentials.username || !credentials.password) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      // Enviar los datos de inicio de sesión
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess('Inicio de sesión exitoso');
        router.push('/');
      } else {
        setError('Error al iniciar sesión');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name='username'
          type='text'
          placeholder='Username'
          onChange={handleChange}
          value={credentials.username}
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          onChange={handleChange}
          value={credentials.password}
          required
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Log In'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  )
}

export default LogIn;