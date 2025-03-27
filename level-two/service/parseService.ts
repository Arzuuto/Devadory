import Parse from 'parse'
import { Project } from '@/interface/project';

// Initialize Parse SDK
Parse.initialize(
  process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY!
)
Parse.serverURL = process.env.NEXT_PUBLIC_PARSE_HOST_URL!
Parse.masterKey = process.env.NEXT_PUBLIC_PARSE_MASTER_KEY

// Sign-in function
export async function signIn(username: string, password: string) {
  try {
    const user = await Parse.User.logIn(username, password)
    return user;
  } catch (error) {
    throw error;
  }
}

// Sign-up function
export async function signUp(username: string, email: string, password: string) {
  try {
    const user = new Parse.User()
    user.set('username', username)
    user.set('email', email)
    user.set('password', password)

    await user.signUp()
    return user
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await Parse.User.logOut()
    return { ok: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { ok: false, error }
  }
}

export function getCurrentUser() {
  return Parse.User.current()
}

export async function createProject(name: string, description: string, dueDate: string, status: string) {
  const newProject = new Parse.Object('Project');
  const user = Parse.User.current();

  if (!user) {
    throw new Error("No current user found")
  }

  newProject.set("name", name);
  newProject.set("description", name);
  newProject.set("dueDate", dueDate);
  newProject.set("status", status);
  newProject.set("owner", user);

  const relation = newProject.relation("teamMember")
  relation.add(user);
  
  try {
    const result = await newProject.save();
    console.log('project created', result);
  } catch (error) {
    throw error;
  }
}

export async function getProjects() {
  const Project = Parse.Object.extend('Project')

  try {
    const currentUser = Parse.User.current()
    if (!currentUser) throw new Error('User not logged in.')

    const userQuery = new Parse.Query(Project)
    userQuery.equalTo('teamMembers', currentUser)

    const results = await userQuery.find()

    return results.map((project) => ({
      id: project.id,
      name: project.get('name'),
      status: project.get('status'),
    }))
  } catch (error) {
    throw error
  }
}


export async function getProjectById(projectId: string) {
  const Project = Parse.Object.extend('Project')
  const query = new Parse.Query(Project)

  try {
    const project = await query.get(projectId)
    return {
      id: project.id,
      name: project.get('name'),
      description: project.get('description'),
      dueDate: project.get('dueDate'),
      status: project.get('status'),
      members: project.get('members')
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  const Project = Parse.Object.extend('Project')
  const query = new Parse.Query(Project)

  try {
    const project = await query.get(projectId)
    await project.destroy()
  } catch (error) {
    throw error;
  }
}

export async function updateProject(updatedProject: Project) {
  const Project = Parse.Object.extend('Project')
  const query = new Parse.Query(Project)
  
  try {
    const project = await query.get(updatedProject.id as string)
    project.set('name', updatedProject.name)
    project.set('description', updatedProject.description)
    project.set('dueDate', updatedProject.dueDate)
    project.set('status', updatedProject.status)

    await project.save()
    return project
  } catch (err) {
    throw new Error('Failed to update project')
  }
}
