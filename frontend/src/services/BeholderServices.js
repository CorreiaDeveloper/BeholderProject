import axios from './BaseService';

const API_URL = process.env.REACT_APP_API_URL;
const BEHOLDER_URL = `${API_URL}/beholder/`;

export async function getIndexes(token) {
    const indexesUrl = `${BEHOLDER_URL}memory/indexes`;
    const headers = {
        'authorization': token
    }
    const response = await axios.get(indexesUrl, { headers });
    return response.data;
}

export async function getMemoryIndex(symbol, index, interval, token) {
    const headers = {
        'authorization': token
    }
    const indexesUrl = `${BEHOLDER_URL}memory/${symbol}/${index}/${interval}`;
    const response = await axios.get(indexesUrl, { headers });
    return response.data;
}

export async function getAnalysisIndexes(token) {
    const headers = {
        'authorization': token
    }
    const analysisUrl = `${BEHOLDER_URL}analysis/`;
    const response = await axios.get(analysisUrl, { headers });
    return response.data;
}