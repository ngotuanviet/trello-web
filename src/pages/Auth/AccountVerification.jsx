import React from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  // Lấy giá trị email và token từ url
  const [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  // Trạng thái biết đã verify xong hay chưa (thành công hoặc kết thúc)
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => {
          setVerified(true)
        })
        .catch(() => {
          // Dù lỗi thì vẫn chuyển hướng về login để user không bị treo ở spinner
          setVerified(true)
        })
    }
  }, [email, token])

  // Nếu url không tồn tại 1 trong 2 giá trị email hoặc token thì đưa ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption={'Verifying your account...'} />
  }

  // Cuối cùng điều hướng về trang login kèm email đã xác thực
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
