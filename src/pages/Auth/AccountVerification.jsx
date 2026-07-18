import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  // lấy giá trị email Token từ url
  const [searchParams] = useSearchParams()
  // const email = searchParams.get('email')

  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])
  console.log("🚀 ~ AccountVerification ~ email, token:", email, token)

  // tạo 1 biến trạng thái biết đc đã verify tk thành công hay chưa
  const [verified, setVerified] = useState(false)
  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])
  // Nếu url co van dề, khong ton tại 1 trong 2 gia tri email hoặc token thì đa ra trang 404 Luôn
  if (!email || !token) {
    return <Navigate to="/404" />
  }
  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption={'Verifying your account...'} />
  }
  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về trang login cùng giá tri verifiedEmail

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification