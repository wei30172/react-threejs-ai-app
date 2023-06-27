import axios, { AxiosResponse } from 'axios'
import FileSaver from 'file-saver'

export interface UploadApiResponse {
  url: string
  public_id: string
}

export const fileReader = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export const createFormData = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)
  return formData
}

export const uploadImage = async (file: File): Promise<UploadApiResponse | undefined> => {
  const formData = createFormData(file)

  try {
    const res: AxiosResponse<UploadApiResponse> = await axios.post(
      import.meta.env.VITE_UPLOAD_LINK as string,
      formData
    )
    return res.data
  } catch (error) {
    console.error(error)
  }
}

export const uploadImageWithUrl = async (imageUrl: string, imageName: string): Promise<UploadApiResponse | undefined> => {
  const blob = await fetch(imageUrl).then(response => response.blob())
  const file = new File([blob], imageName)
  return await uploadImage(file)
}

export const downloadImage = (href: string, downloadName: string): void => {
  FileSaver.saveAs(href, downloadName)
}