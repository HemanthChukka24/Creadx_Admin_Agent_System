import axios from 'axios';

// This links the admin web panel directly to your localtunnel backend URL!
const API_BASE_URL = 'http://localhost:3000/api';

export const adminApi = axios.create({
  baseURL: API_BASE_URL, //
  headers: {
    'Content-Type': 'application/json', //
    'Bypass-Tunnel-Reminder': 'true' // 🔥 This stops localtunnel from blocking your API calls!
  },
});

// A quick helper function to fetch data from your backend
export const fetchDashboardData = async (endpoint: string) => {
  try {
    const response = await adminApi.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};