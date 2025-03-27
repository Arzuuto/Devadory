import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getProjectById, deleteProject, getCurrentUser } from '@/service/parseService'
import { Edit, Trash2, Users, ArrowLeft } from 'lucide-react'
import { Project } from '@/interface/project'
import Parse from 'parse'

export default function ProjectDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState<Project | null>(null)
  const [members, setMembers] = useState<Parse.User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function checkUser() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.replace('/login') // Redirect to login if no user
      } else {
        setLoading(false) // Allow rendering if user is authenticated
      }
    }
    
    async function fetchProject() {
      try {
        const data = await getProjectById(id as string)
        setProject(data)

        // Fetch Members
        const Project = Parse.Object.extend("Project")
        const query = new Parse.Query(Project)
        const projectObject = await query.get(id as string)
        
        const relation = projectObject.relation("teamMember")
        const membersList = await relation.query().find({ useMasterKey: true })
        setMembers(membersList as unknown as Parse.User[])
      } catch (err) {
        setError('Failed to fetch project details.')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
    fetchProject()
  }, [id])

  const handleDelete = async () => {
    if (!project || !project.id) return
    try {
      await deleteProject(project.id)
      router.push('/projects')
    } catch (err) {
      setError('Failed to delete project.')
    }
  }

  const handleEdit = () => {
    if (!project) return
    router.push(`/projects/${project.id}/edit`)
  }

  const handleMembers = () => {
    if (!project) return
    router.push(`/projects/${project.id}/members`)
  }

  const goBack = () => {
    router.push('/projects')
  }

  if (loading) return <div className="flex justify-center">
  <h1 className="pt-10">
    Loading...
  </h1>
  </div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">

        <button
          onClick={goBack}
          className="absolute left-4 top-4 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={24} />
        </button>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {project ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4 text-black">{project.name}</h2>
            <p className="text-black"><strong>Description:</strong> {project.description}</p>
            <p className="text-black"><strong>Due date:</strong> {project.dueDate}</p>
            <p className="text-black"><strong>Status:</strong> {project.status}</p>

            <h3 className="text-lg font-semibold mt-4 text-black">Team Members</h3>
            {members.length > 0 ? (
              <ul className="list-disc list-inside text-black mt-2">
                {members.map((member) => (
                  <li key={member.id}>{member.get("username")}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No team members yet.</p>
            )}

            <div className="flex items-center space-x-40 mt-6">
              <button
                onClick={handleEdit}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <Edit className="mr-2" />
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center text-red-500 hover:text-red-700"
              >
                <Trash2 className="mr-2" />
                Delete
              </button>
            </div>

            <button
              onClick={handleMembers}
              className="mt-6 flex items-center bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-lg w-full"
            >
              <Users className="mr-2" />
              Manage Members
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">Project not found.</div>
        )}
      </div>
    </div>
  )
}
