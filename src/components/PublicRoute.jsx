import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = () => {
  const isAuthention = false

  if (isAuthention) {
    return <Navigate to={'/'} />
  }

  return (
    <Navigate to={'/login'} />
  )
}

export default PublicRoute