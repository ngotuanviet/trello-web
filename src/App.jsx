import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import Board from '~/pages/Boards/_id'
function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đầy cần replace giá trị true đề nó thay thế route /, có thể hiều là route / sẽ không còn nằm
        //trong history cua Browser
        // Thực hành de hieu hon bằng cach nhan Go Home tu trang 404 xong thu quay lai bằng nut back cua trinh
        // duyệt giua 2 truờng hợp co replace hoặc khong co.
        <Navigate to={"/boards/6a4b65841f2db783506bbb9d"} replace="true" />
      } />
      {/* Board details */}
      <Route path='/boards/:boardId' element={<Board />} />
      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />


      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
