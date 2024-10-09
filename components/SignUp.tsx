import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
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

    // Verificar si las contraseñas coinciden
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

      setSuccess('Registro exitoso. ¡Ahora puedes iniciar sesión!');
      setUser({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name='first_name'
          type='text'
          placeholder='First name'
          value={user.first_name}
          onChange={handleChange}
          required
        />
        <input
          name='last_name'
          type='text'
          placeholder='Last name'
          value={user.last_name}
          onChange={handleChange}
          required
        />
        <input
          name='username'
          type='text'
          placeholder='Username'
          value={user.username}
          onChange={handleChange}
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          value={user.password}
          onChange={handleChange}
          required
        />
        <input
          name='confirmPassword'
          type='password'
          placeholder='Confirm password'
          value={user.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Registrando...' : 'Sign Up'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  )
}

export default SignUp;