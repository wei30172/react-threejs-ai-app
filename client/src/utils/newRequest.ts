import axios, { AxiosInstance } from 'axios'

export interface IErrorResponse {
  message: string;
}

const newRequest: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true
})

export default newRequest