class CustomError extends Error {
  status: number
  message: string

  constructor(status: number, message: string) {
    super()
    this.status = status
    this.message = message
  }
}

const createError = (status: number, message: string): CustomError => {
  return new CustomError(status, message)
}

export default createError