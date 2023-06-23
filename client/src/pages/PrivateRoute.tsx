import { ElementType } from 'react'
import { Route, Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  element: ElementType;
  isAuthenticated: boolean;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element: Element,
  isAuthenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to='/login' replace />}
    />
  )
}

export default PrivateRoute