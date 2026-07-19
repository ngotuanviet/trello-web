import { useSelector } from 'react-redux'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Auth from '~/pages/Auth/Auth'
import Board from '~/pages/Boards/_id'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
/**
  Giai pháp Clean Code trong viec xac dinh cac route nao cần dang nhập tai khoan xong thi moi cho truy cập
 Sử dung <Outtet /> cua react-router-don de hien thị cac Child Route (xem cach su dung trong App() ben

https://reactrouter.com/en/main/components/outlet
Một bai huong dan kha day du:
https://www.robinwieruch.de/react-router-private-routes/

 */
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to={'/login'} replace={true} />
  }
  return (
    <Outlet />
  )

}
const PublicRoute = ({ user }) => {
  if (user) {
    return <Navigate to={'/'} replace={true} />
  }
  return (
    <Outlet />
  )

}
function App() {
  const currentUser = useSelector(selectCurrentUser)
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
      {/* Protected Routes (Hiều đơn giản trong dự an cua chung ta tà nhưng route chi cho truy cập sau khi
đã login) */}
      {/* Outlet là để hiện thị các thứ trong phần tử bọc nó */}
      <Route element={<ProtectedRoute user={currentUser} />}>

        {/* Board details */}
        <Route path='/boards/:boardId' element={<Board />} />
        {/* User Setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />

      </Route>
      <Route element={<PublicRoute user={currentUser} />}>
        {/* Authentication */}
        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/account/verification' element={<AccountVerification />} />

      </Route>

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
