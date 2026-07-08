// Board Detail
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import AppBar from '~/components/Appbar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '../../utils/Formatters.js'
import { isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    fetchBoardDetailsAPI('6a4b65841f2db783506bbb9d').then((data) => {
      const board = data.board
      // SỬA LỖI COLUMN RỖNG: Khi tải dữ liệu board từ API về, nếu một column không có card nào,
      // ta cần khởi tạo cho nó một placeholder card ẩn để dnd-kit có thể nhận diện và cho phép thả card vào cột này.
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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
    createdColumn._id = createdColumnResponse._id

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
    console.log(createCard);


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
    console.log('====================================');
    console.log(columnToUpdate);
    console.log('====================================');
    setBoard(newBoard)
    // cập nhật lại state board
    // Phiay ront-end chung ta phai tự lam dung lai state data board (thay vi phải gọi lai api fetchBoardDetailsAPI)
    // Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toan bộ Board du day co la api tạo Column hay Card di chang nua. > Luc nay FE se nhan hon.
  }
  // Func gọi API và xử lý kéo thả Column
  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    // Gọi Api Update Board
    setBoard(newBoard)
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar Board={board} />
      <BoardContent Board={board} moveColumns={moveColumns} createNewCard={createNewCard} createNewColumn={createNewColumn} />
    </Container>
  )
}

export default Board
