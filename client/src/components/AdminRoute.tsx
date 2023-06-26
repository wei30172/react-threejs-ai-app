import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState } from '../store'
import { useIsAdminUserQuery } from '../slices/apiSlice/usersApiSlice'
import { Loader } from '../components/icons'

const AdminRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { data: isAdminData, isLoading } = useIsAdminUserQuery()
  const isAuthenticatedAndAdmin = userInfo && isAdminData?.isAdmin
  
  if (isLoading) return <Loader />

  return isAuthenticatedAndAdmin ? <Outlet /> : <Navigate to='/' replace />
}
export default AdminRoute