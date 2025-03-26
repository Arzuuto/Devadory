import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getProjectById, updateProject } from '@/service/parseService'
import { Project } from '@/interface/project'

export default function EditProjectPage() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState<Project | null>(null)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [status, setStatus] = useState<string>('À faire')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchProject() {
      try {
        const data = await getProjectById(id as string)
        setProject(data)
        setName(data.name)
        setDescription(data.description)
        setDueDate(data.dueDate)
        setStatus(data.status)
      } catch (err) {
        setError('Failed to fetch project.')
      }
    }

    fetchProject()
  }, [id])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const updatedProject = {
        id: project?.id,
        name,
        description,
        dueDate,
        status,
      }

      const response = await updateProject(updatedProject)
      if (response) {
        router.push(`/projects/${id}`)
      } else {
        setError('Failed to update project.')
      }
    } catch (err) {
      setError('An error occurred while updating the project.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!project) return <div>Project not found.</div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">Edit Project</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black"
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="border border-gray-300 px-4 py-2 rounded-lg placeholder-black text-black"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg text-black"
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } transition`}
          >
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </form>
      </div>
    </div>
  )
}
