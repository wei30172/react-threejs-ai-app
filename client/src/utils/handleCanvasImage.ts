import { UploadApiResponse, uploadImage, downloadImage } from './handleImage'

export const downloadCanvasImage = (): void => {
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('Canvas not found.')
    return
  }

  const dataURL = canvas.toDataURL()
  
  downloadImage(dataURL, 'download-mydesign.png')
}

export const uploadCanvasImage = async (): Promise<UploadApiResponse | undefined> => {
  const canvas = document.querySelector('canvas')
  
  if (!canvas) {
    console.error('Canvas not found.')
    return
  }
  
  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(blob => resolve(blob))
  )
  
  if (!blob) {
    console.error('Failed to convert canvas to Blob.')
    return
  }
  
  const file = new File([blob], 'my-creation.png', { type: 'image/png' })
  return uploadImage(file)
}