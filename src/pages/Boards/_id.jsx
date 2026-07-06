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
    fetchBoardDetailsAPI('69db21f451a42724aa1274cc').then((data) => {
      setBoard(data)
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
