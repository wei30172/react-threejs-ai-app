import axios, { AxiosResponse } from 'axios'
import FileSaver from 'file-saver'

interface UploadResponse {
  url: string
}

export const fileReader = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsDataURL(file)
  })

export const uploadImage = async (file: File): Promise<string | undefined> => {
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
  } catch (error) {
    console.error(error)
  }
}

export const uploadImageWithUrl = async (imageUrl: string, imageName: string): Promise<string | undefined> => {
  const imageBlob = await fetch(imageUrl).then(response => response.blob())
  const imageFile = new File([imageBlob], imageName)
  const uploadedImageUrl = await uploadImage(imageFile)
  return uploadedImageUrl
}

export const downloadImage = (href: string, downloadName: string): void => {
  FileSaver.saveAs(href, downloadName)
}