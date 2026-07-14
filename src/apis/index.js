import { api } from "~/apis/config"

// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await api.get(`/v1/boards/${boardId}`)
//   return response.data
// }
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await api.put(`/v1/boards/${boardId}`, updateData)
  return response.data
}

// Column
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await api.put(`/v1/columns/${columnId}`, updateData)
  return response.data
}
export const createNewColumnAPI = async (data) => {
  const response = await api.post(`/v1/columns`, data)
  return response.data
}
export const deleteColumnDetailAPI = async (columnId) => {
  const response = await api.delete(`/v1/columns/${columnId}`)
  return response.data
}
// Card
export const createNewCardAPI = async (data) => {
  const response = await api.post(`/v1/cards`, data)
  return response.data
}
export const moveCardToDifferentColumnsAPI = async (updateData) => {
  const response = await api.put('/v1/boards/supports/moving_card', updateData)
  return response.data
}

