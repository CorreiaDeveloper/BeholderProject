import axios from './BaseService';

const API_URL = process.env.REACT_APP_API_URL;
const MONITORS_URL = `${API_URL}/monitors/`;

export async function getMonitors(page, token) {
    const monitorsUrl = `${MONITORS_URL}?page=${page}`;
    const headers = { 'authorization': token }
    const response = await axios.get(monitorsUrl, { headers });
    return response.data;
}