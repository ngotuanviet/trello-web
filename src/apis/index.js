import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}
export const CreateNewColumnAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, data)
  return response.data
}
export const CreateNewCardAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, data)
  return response.data
}
