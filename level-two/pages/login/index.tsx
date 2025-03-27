import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from '../../service/parseService'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await signIn(username, password)
      if (response) {
        router.push('/projects')
      } else {
        setError('Registration failed. Try again.')
      }
    } catch (err) {
      setError('Username or Password is incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">Sign In</h2>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            <p className="text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } transition`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-black mt-4">
          No account?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create one.
          </span>
        </p>
      </div>
    </div>
  )
}
