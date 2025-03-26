import { getCurrentUser, logout } from '@/service/parseService'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    async function fetchUser() {
        const currentUser = await getCurrentUser()
        setIsAuthenticated(!!currentUser)  // Sets to true if user exists
    }
    fetchUser()
  }, [])

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  // logout the user
  const handleLogout = async () => {
    try {
      await logout()
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }
  
  return (
    <nav className="bg-white p-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-black font-bold text-2xl">
          <button onClick={() => handleNavigate('/')}>Devadory</button>
        </div>
        <div className="flex space-x-6">
          <button
            onClick={() => handleNavigate('/projects')}
            className="text-black hover:bg-black hover:text-white px-3 py-2 rounded-md text-lg"
          >
            Projects
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="text-black hover:bg-black hover:text-white px-3 py-2 rounded-md text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate('/login')}
                className="text-black hover:bg-black hover:text-white px-3 py-2 rounded-md text-lg"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
