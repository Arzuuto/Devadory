import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser, getProjects } from '@/service/parseService'

interface Project {
  id: string | undefined,
  name: string,
  status: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {

    async function checkUser() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.replace('/login') // Redirect to login if no user
      } else {
        setLoading(false) // Allow rendering if user is authenticated
      }
    }

    async function fetchProjects() {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (err) {
        setError('Failed to fetch projects.')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
    fetchProjects()
  }, [])

  const handleCreateProject = () => {
    router.push('/projects/new')
  }
  if (loading) return <div className="flex justify-center">
    <h1 className="pt-10">
      Loading...
    </h1>
    </div>;
  if (error) return <div>{error}</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">Projects</h2>
        {projects.length === 0 ? (
          <p className="text-black text-xl text-center">No projects available</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="border-b border-black-100 pb-4 text-black">
                <h3 className="font-semibold text-xl">{project.name}</h3>
                <p><strong>status: </strong> {project.status}</p>
                <button
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="mt-4 px-8 py-2 bg-blue-500 text-white rounded-lg"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-center w-full mt-6">
            <button
              onClick={handleCreateProject}
              className="px-4 py-2  bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Create Project
            </button>
        </div>
      </div>
    </div>
  )
}
