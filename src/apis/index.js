import { toast } from "react-toastify"
import { api } from "~/apis/config"

// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await api.get(`/v1/boards/${boardId}`)
//   return response.data
// }
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await api.put(`/v1/boards/${boardId}`, updateData)
  return response.data
}
export const fetchBoardsAPI = async (searchPatch) => {
  const response = await api.get(`/v1/boards${searchPatch}`)
  return response.data
}
export const createNewBoardAPI = async (updateData) => {
  const response = await api.post(`/v1/boards`, updateData)
  toast.success('Board created successfully')
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
// users
export const registerUserAPI = async (data) => {
  const response = await api.post('/v1/users/register', data)
  toast.success(`Account created  successfully! Please check and verify your account before logging in!`, { theme: 'colored' })
  return response.data
}
export const verifyUserAPI = async (data) => {
  const response = await api.put('/v1/users/verify', data)
  toast.success(`Account verified  successfully! Now you can login to enjoy or services! Have a good day!`, { theme: 'colored' })
  return response.data
}
export const refreshTokenAPI = async () => {
  const response = await api.get('/v1/users/refresh_token')
  return response.data
}
