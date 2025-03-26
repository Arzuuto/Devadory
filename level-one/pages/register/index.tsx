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
        } else {
          setError('Registration failed. Try again.')
        }
      } catch (err) {
        setError('An error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-blac-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
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
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}
