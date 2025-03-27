import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Parse from "parse";
import { X, ArrowLeft } from "lucide-react";

export default function ProjectMembersPage() {
  const router = useRouter();
  const { id } = router.query;

  const [members, setMembers] = useState<Parse.User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
  
    async function fetchMembers() {
      try {
        setLoading(true);
        const Project = Parse.Object.extend("Project");
        const query = new Parse.Query(Project);
        const project = await query.get(id as string);
  
        // Fetching project members
        const relation = project.relation("teamMember");
        const membersList = await relation.query().find({useMasterKey: true});
        setMembers(membersList as unknown as Parse.User[]);

      } catch (err) {
        setError("An error occurred while fetching project members. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchMembers();
  }, [id]);

  async function addMember() {
    if (!selectedUser) return;
  
    try {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      const project = await query.get(id as string);
  
      const relation = project.relation("teamMember");
      const userQuery = new Parse.Query(Parse.User);
      const userToAdd = await userQuery.equalTo("username", selectedUser).first({ useMasterKey: true });
      if (!userToAdd)
        throw new Error()
      relation.add(userToAdd);
      console.log(userToAdd);
      await project.save(null, { useMasterKey: true }); // Save with master key
      setMembers([...members, userToAdd]);
      setSelectedUser(null); // Reset the selection
    } catch (error) {
      setError("Failed to add member. Please ensure the username is correct and try again.");
    }
  }

  async function removeMember(userId: string) {
    try {
      const Project = Parse.Object.extend("Project");
      const query = new Parse.Query(Project);
      const project = await query.get(id as string);

      const relation = project.relation("teamMember");
      const userQuery = new Parse.Query(Parse.User);
      const userToRemove = await userQuery.get(userId, {useMasterKey: true});

      relation.remove(userToRemove);
      await project.save();
      setMembers(members.filter((user) => user.id !== userId));
    } catch (error) {
      setError("Failed to remove member. Please try again later.");
    }
  }

  function goBack() {
    router.push(`/projects/${id}`);
  }

  if (loading) return <div className="flex justify-center">
    <h1 className="pt-10">
      Loading...
    </h1>
    </div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">

        <button 
          onClick={goBack}
          className="text-black p-2 rounded-full mb-6 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-10 text-black">Manage Members</h2>

        {error && (
          <div className="text-red-600 text-center mb-4">
            <strong>{error}</strong>
          </div>
        )}

        <ul className="space-y-3">
          {members.map((member) => (
            <li key={member.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-lg">
              <span className="text-black">{member.get("username")}</span>
              <button onClick={() => removeMember(member.id)} className="text-red-500">
                <X className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex space-x-4">
          <input
            type="text"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
            placeholder="Enter username"
            className="border border-gray-300 px-4 py-2 rounded-lg w-full text-black"
          />
          <button onClick={addMember} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
