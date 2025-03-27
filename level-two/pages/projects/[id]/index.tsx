import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getProjectById, deleteProject } from '@/service/parseService'
import { Edit, Trash2 } from 'lucide-react'
import { Project } from '@/interface/project'


export default function ProjectDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchProject() {
      try {
        const data = await getProjectById(id as string)
        setProject(data)
      } catch (err) {
        setError('Failed to fetch project.')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const handleDelete = async () => {
    if (!project || !project.id) return
    try {
      await deleteProject(project.id)
      router.push('/projects') // Rediriger vers la liste des projets après suppression
    } catch (err) {
      setError('Failed to delete project.')
    }
  }

  const handleEdit = () => {
    if (!project) return
    router.push(`/projects/${project.id}/edit`) // Rediriger vers la page d'édition
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  if (!project) return <div>Project not found.</div>
  return (
    <div className="flex items-center justify-center min-h-screen bg-black-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">{project.name}</h2>
        <p className="text-black"><strong>Description:</strong> {project.description}</p>
        <p className="text-black"><strong>Due date:</strong> {project.dueDate}</p>
        <p className="text-black"><strong>Status:</strong> {project.status}</p>
        
        <div className='flex items-center space-x-40'>
            <button
              onClick={handleEdit}
              className="mt-4 flex items-start text-blue-500 hover:text-blue-700"
            >
              <Edit className="mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="mt-4 flex items-end text-red-500 hover:text-red-700"
            >
              <Trash2 className="mr-2" />
              Delete
            </button>
        </div>
      </div>
    </div>
  )
}