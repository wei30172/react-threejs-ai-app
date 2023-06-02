interface User {
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

const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user) as User : null
}

export default getCurrentUser