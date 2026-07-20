import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "~/apis/config";


// Khởi tạo giá trị trong redux
const initialState = {
  currentUser: null
}

// Các hành động goi api (bất đồng bộ) và cập nhật dữ liêu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await api.post(`/v1/users/login`, data)

    return response.data
  }
)
export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI', async (data) => {
    const response = await api.put(`/v1/users/update`, data)
    return response.data
  }
)
export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await api.delete('/v1/users/logout')
    if (showSuccessMessage) {
      toast.success('Logged out successfully')
    }
    return response.data
  }
)

// Khởi tạo một cái slice trong kho lưu trữ redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers nơi xử lý dữ liệu đồng bộ
  reducers: {

    // extraReducers: Nơi sử lý dữ liệu bất đồng bộ
  }, extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {

      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const infoUserNew = action.payload

      state.currentUser = infoUserNew
    })
  }
})
// export const { updateCurrentActiveBoard } = userSlice.actions
// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
// Cái file này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer
export default userSlice.reducer