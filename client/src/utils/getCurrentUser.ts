export interface IUser {
  _id: string
  username: string
  email: string
  img: string
  address: string
  phone: string
  isSeller: boolean
  createdAt?: string
  updatedAt?: string
}

const getCurrentUser = (): IUser | null => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) as IUser : null
}

export default getCurrentUser