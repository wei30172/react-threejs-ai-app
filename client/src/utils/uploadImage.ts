import axios, { AxiosResponse } from 'axios'

interface UploadResponse {
  url: string
}

const upload = async (file: File): Promise<string | undefined> => {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)

  try {
    const res: AxiosResponse<UploadResponse> = await axios.post(
      import.meta.env.VITE_UPLOAD_LINK as string,
      data
    )
    const { url } = res.data
    return url
  } catch (err) {
    console.error(err)
  }
}

export default upload