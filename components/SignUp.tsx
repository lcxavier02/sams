import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

/**
 * SignUp component for creating a new user account.
 * Includes form fields for first name, last name, username, password, and confirm password.
 * Displays success or error messages based on the outcome of the registration process.
 * 
 * @component
 * @example
 * return (
 *   <SignUp />
 * )
 * 
 * @returns {JSX.Element} The SignUp component renders a form for user registration.
 */
function SignUp(): JSX.Element {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (user.password !== user.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      // Enviar los datos de registro a la API
      const response = await axios.post('/api/auth/signup', {
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        password: user.password,
      });

      setSuccess('Sig up successful.');
      setUser({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      setError(error.response?.data?.message || 'Error in the sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogInRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              name='first_name'
              type='text'
              placeholder='First name'
              value={user.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              name='last_name'
              type='text'
              placeholder='Last name'
              value={user.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              name='username'
              type='text'
              placeholder='Username'
              value={user.username}
              onChange={handleChange}
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
              value={user.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              name='confirmPassword'
              type='password'
              placeholder='Confirm password'
              value={user.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registrando...' : 'Sign Up'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">{success}</p>}
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleLogInRedirect}
              className="text-blue-500 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
