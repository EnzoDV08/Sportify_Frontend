import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Style/Login.css'
import { loginUser } from '../api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await loginUser(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex">
        {/* Left image panel */}
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('https://i.imgur.com/4M7IWwP.jpeg')` }} />

        {/* Right login form */}
        <form onSubmit={handleSubmit} className="w-1/2 p-10 space-y-4">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">LOG IN</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-full font-semibold hover:bg-orange-600"
          >
            Log In
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{' '}
            <a href="/signup" className="text-orange-500 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
