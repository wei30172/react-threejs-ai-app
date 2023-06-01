import axios, { AxiosInstance } from 'axios'

const newRequest: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true
})

export default newRequest