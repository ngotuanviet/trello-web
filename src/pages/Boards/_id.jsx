// Board Detail
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import AppBar from '~/components/Appbar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { fetchBoardDetailsAPI } from '~/apis'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    fetchBoardDetailsAPI('6a4b65841f2db783506bbb9d').then((data) => {
      setBoard(data.board)
    })


  }, [])


  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar Board={board} />
      <BoardContent Board={board} />
    </Container>
  )
}

export default Board
