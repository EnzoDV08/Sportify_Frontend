// TEMP FIX: Hardcode the backend URL for Electron
const API_URL = "http://localhost:5000"; // ✅ make sure backend is running

export const getUsers = async () => {
  console.log("Fetching from:", `${API_URL}/api/users`);
  const response = await fetch(`${API_URL}/api/users`);
  return await response.json();
};

export const createUser = async (userData: {
  name: string
  email: string
  password: string
}) => {
  const response = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error('Failed to create user')
  }

  return response.json()
}

export async function loginUser(email: string, password: string) {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Invalid credentials')
  }

  return response.json()
}