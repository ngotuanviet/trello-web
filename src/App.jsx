import { Route, Routes } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Board />} />
      </Routes>

    </>
  )
}

export default App
