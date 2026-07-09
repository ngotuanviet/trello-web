// Board Detail
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import AppBar from '~/components/Appbar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnsAPI, deleteColumnDetailAPI } from '~/apis'
import { generatePlaceholderCard } from '../../utils/Formatters.js'
import { isEmpty } from 'lodash'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    fetchBoardDetailsAPI('6a4b65841f2db783506bbb9d').then((data) => {
      const board = data.board
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
      setBoard(board)
    })
  }, [])
  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu stare board
  const createNewColumn = async (newColumnData) => {

    const createdColumnResponse = await createNewColumnAPI({
      boardId: board?._id,
      ...newColumnData
    })

    // cập nhật lại state board
    // Cập nhật state board
    // Phia Front-end chung ta phai tự lam dung lai state data board (thay vi phải gọi lại api
    // fetchBoardDetailsAPI
    // Lưu ý: cách lam nay phụ thuộc vao tuy lựa chon và dặc thu dự an, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toàn bo Board du day co là api tạo Column hay Card di chang nữa. => Lúc nay FE se nhan hơn.
    const newBoard = { ...board }
    const createdColumn = createdColumnResponse.createColumn
    // Gán _id cho column mới được tạo từ response để tránh lỗi unique key prop trong React khi render ListColumns

    // SỬA LỖI COLUMN RỖNG: Khi tạo một cột mới hoàn toàn rỗng ở phía client,
    // ta cần tự động gắn một Placeholder Card ẩn vào cột này để dnd-kit nhận diện được nó khi kéo thả.
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumnResponse._id)

    setBoard(newBoard)
  }
  const createNewCard = async (newCardData) => {

    const { createCard } = await createNewCardAPI({
      boardId: board?._id,
      ...newCardData
    })
    const newBoard = { ...board }



    const columnToUpdate = newBoard.columns.find((column) => column._id === createCard.columnId)

    if (columnToUpdate) {
      // SỬA LỖI COLUMN RỖNG: Nếu cột hiện tại đang chỉ chứa duy nhất một Placeholder Card ẩn (tức là cột đang rỗng trên giao diện),
      // ta cần xóa placeholder card này đi và thay thế bằng card thực tế vừa tạo.
      if (columnToUpdate.cards.length === 1 && columnToUpdate.cards[0].FE_PlaceholderCard) {
        columnToUpdate.cards = [createCard]
        columnToUpdate.cardOrderIds = [createCard._id]
      } else {
        // Ngược lại, nếu cột đã có sẵn card thực tế, ta chỉ cần push thêm card mới vào cuối mảng
        columnToUpdate.cards.push(createCard)
        columnToUpdate.cardOrderIds.push(createCard._id)
      }
    }

    setBoard(newBoard)
    // cập nhật lại state board
    // Phiay ront-end chung ta phai tự lam dung lai state data board (thay vi phải gọi lai api fetchBoardDetailsAPI)
    // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toan bộ Board du day co la api tạo Column hay Card di chang nua. > Luc nay FE se nhan hon.
  }
  // Func gọi API và xử lý kéo thả Column tay đổi vị trí trong board
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    // Gọi Api Update Board
    setBoard(newBoard)
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
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }

    setBoard(newBoard)
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
    setBoard(newBoard)

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
    setBoard(newBoard)
    const { result } = await deleteColumnDetailAPI(columnId)
    if (result.StatusCode === 200) {
      toast.success(result.deleteResult)
    } else {
      toast.error('Lỗi không xoá đọc column')
    }


  }
  if (!board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100vw', height: '100vh' }}>
        <CircularProgress aria-label="Loading…" />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar Board={board} />
      <BoardContent
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumns={moveCardToDifferentColumns}
        Board={board}
        moveColumns={moveColumns}
        createNewCard={createNewCard}
        createNewColumn={createNewColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
