// TEMP FIX: Hardcode the backend URL for Electron
const API_URL = "http://localhost:5000"; // ✅ make sure backend is running

export const getUsers = async () => {
  console.log("Fetching from:", `${API_URL}/api/users`);
  const response = await fetch(`${API_URL}/api/users`);
  return await response.json();
};
