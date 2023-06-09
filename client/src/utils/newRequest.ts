import axios, { AxiosInstance } from 'axios'

export interface IErrorResponse {
  message: string
}

export interface AxiosError {
  response?: {
    data? :{
      message: string
    }
  }
}

const newRequest: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true
})

export default newRequest
