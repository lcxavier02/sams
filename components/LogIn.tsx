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

  const handleSignUpRedirect = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              name='username'
              type='text'
              placeholder='Username'
              onChange={handleChange}
              value={credentials.username}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              name='password'
              type='password'
              placeholder='Password'
              onChange={handleChange}
              value={credentials.password}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Iniciando sesión...' : 'Log In'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">{success}</p>}
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Doesn&apos;t have an account?{' '}
            <button
              type="button"
              onClick={handleSignUpRedirect}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LogIn;