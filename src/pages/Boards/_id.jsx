// Board Detail
import Container from '@mui/material/Container'
import { useEffect } from 'react'
import AppBar from '~/components/Appbar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { cloneDeep } from 'lodash'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnsAPI, deleteColumnDetailAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardDetailAPI, selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectIsShowModalActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  // const [board, setBoard] = useState(null)
  const { boardId } = useParams()


  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const activeModalCard = useSelector(selectIsShowModalActiveCard)
  // không dùng state của component sẽ sử dụng state Redux
  useEffect(() => {
    // sử dinh dispatch để callApi bên activeBoardSlice createAsyncThunk
    //'6a4b65841f2db783506bbb9d'
    dispatch(fetchBoardDetailAPI(boardId))

  }, [dispatch])


  // Func gọi API và xử lý kéo thả Column tay đổi vị trí trong board
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    /**
     * * Trường hợp dùng Spread Operator này thì lại không sao bởi và ở đầy chúng ta không dùng push như ở trên
làm thay đoi trực tiềp kiểu mở rộng mang, mà chi dang gan lại toàn bo gia trị cotumns và columnorderIds
bằng 2 màng mới. Tương tự như cách lam concat o trường hợp createNewColumn thoi :))
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    // Gọi Api Update Board
    dispatch(updateCurrentActiveBoard(newBoard))
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
  }
  /**
   * Khi di chuyển card trong cùng column
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update chuẩn dữ liệu state board
    /**
     * Cannot assign to read onty property 'cards' of object
* Trường hợp Temutability ở đây đã dụng toi giá trị cards đang được coi là chỉ đọc read only - (nested
object - can thiệp sâu dữ Liệu)
     */
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }

    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
   * Khi di chuyển card sang column khác:
   * 1. Cập nhật mảng cardOrderIds của column cũ (xóa cardId)
   * 2. Cập nhật mảng cardOrderIds của column mới (thêm cardId)
   * 3. Cập nhật columnId của card đã kéo
   * => API chỉ cần gọi một lần ở Board (updateBoardDetailsAPI)
   */
  const moveCardToDifferentColumns = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API để cập nhật vị trí card trên DB
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds || []
    let nextCardOrderIds = dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds || []

    // Lọc bỏ placeholder card nếu có
    if (prevCardOrderIds[0]?.includes('-placeholder-card')) prevCardOrderIds = []
    if (nextCardOrderIds[0]?.includes('-placeholder-card')) nextCardOrderIds = []

    moveCardToDifferentColumnsAPI({
      currentCardId,
      prevColumnId,
      nextColumnId,
      prevCardOrderIds,
      nextCardOrderIds
    })
  }
  const deleteColumnDetails = async (columnId) => {

    const newBoard = { ...board }

    newBoard.columns = board.columns.filter((c) => c._id !== columnId)
    const { result } = await deleteColumnDetailAPI(columnId)
    if (result.StatusCode === 200) {
      toast.success(result.deleteResult)
    } else {
      toast.error('Lỗi không xoá đọc column')
    }

    dispatch(updateCurrentActiveBoard(newBoard))
  }
  if (!board) {
    return (
      <PageLoadingSpinner caption={'Board loading....'} />
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active card, check đóng/mở dựa theo điều kiện có tồn tại isShowModalActiveCard lưu trong
      Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Modal card đang active
      */}
      <ActiveCard />


      {/* Các thành phần còn lại của board details */}
      <AppBar />
      <BoardBar Board={board} />
      <BoardContent
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumns={moveCardToDifferentColumns}
        moveColumns={moveColumns}
        Board={board}
      />
    </Container>
  )
}

export default Board
