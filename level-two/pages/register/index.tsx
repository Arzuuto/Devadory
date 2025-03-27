import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { signUp } from '../../service/parseService'
 
export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await signUp(username, email, password)
      if (response) {
        router.push('/projects') // Redirect to projects after successful signup
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please check your inputs and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">Sign Up</h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black w-full"
            />
            {error && <p className="text-red-500 text-sm mt-1">Please enter a valid username.</p>}
          </div>

          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black w-full"
            />
            {error && <p className="text-red-500 text-sm mt-1">Please enter a valid email.</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black w-full"
            />
            {error && <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters.</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } transition w-full`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-black mt-4">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  )
}
