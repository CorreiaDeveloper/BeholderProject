import axios from 'axios';

const EXCHANGE_URL = `${process.env.REACT_APP_API_URL}/exchange/`;

export const STOP_TYPES = ["STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT", "TAKE_PROFIT_LIMIT"];

export const FINISHED_STATUS = ["FILLED", "REJECTED", "CANCELED"];

export async function getBalance(token) {
    const headers = { 'authorization': token };
    const response = await axios.get(EXCHANGE_URL + 'balance', { headers });
    return response.data;
}

