import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '~/components/ProtectedRoute'
import PublicRoute from '~/components/PublicRoute'
import Board from '~/pages/Boards/_id'
function App() {
  return (
    <>
      <Routes >


        <Route path='/' element={<Board />} />


      </Routes>

    </>
  )
}

export default App
