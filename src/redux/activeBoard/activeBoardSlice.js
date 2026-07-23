import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { api } from "~/apis/config";
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from "~/utils/Formatters";

// Khởi tạo giá trị trong redux
const initialState = {
  currentActiveBoard: null,

}

// Các hành động goi api (bất đồng bộ) và cập nhật dữ liêu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailAPI',
  async (boardId) => {
    const response = await api.get(`/v1/boards/${boardId}`)

    return response.data.board
  }
)


// Khởi tạo một cái slice trong kho lưu trữ redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Luôn luôn cần dấu ngoặc nhọn cho func trong reducer cho dù code chỉ 1 dòng, đây là rule của redux
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload;
      // Xử lý dữ liệu nếu cần thiết
      //...

      // update lại dữ liệu currentÁctiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      // updated nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload
      // tìm dần từ board > column > card
      const column = state.currentActiveBoard.columns.find((c) => c._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find((c) => c._id === incomingCard._id)
        console.log(current(card));
        /**
        * Giải thích đoạn dưới, các bạn mới lần đầu sẽ dễ bị lú :D
        * Đơn giản là dùng Object.keys để lấy toàn bộ các properties (keys) của incomingCard về một Array
        rồi forEach no ra.
        * Sau đó tùy vào trường hợp cần thì kiểm tra thêm còn không thì cập nhật ngược lại giá trị vào
        card luôn như bên dưới.
        */
        if (card) {
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
    // extraReducers: Nơi sử lý dữ liệu bất đồng bộ
  }, extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailAPI.fulfilled, (state, action) => {
      let board = action.payload
      // Thành viên trong board sẽ là gộp lại của 2 mảng owners và members
      board.FE_allUsers = board.owners.concat(board.members)
      // action.payload chính là response.data
      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ Liệu xuống bên dưới các component con
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // SỬA LỖI COLUMN RỖNG: Khi tải dữ liệu board từ API về, nếu một column không có card nào,
        // ta cần khởi tạo cho nó một placeholder card ẩn để dnd-kit có thể nhận diện và cho phép thả card vào cột này.
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ Liệu xuống bên dưới các component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      state.currentActiveBoard = board
    })
  }
})
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions
// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}
// Cái file này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer
export default activeBoardSlice.reducer