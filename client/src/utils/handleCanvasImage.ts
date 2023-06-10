import uploadImage from './uploadImage'

export const downloadCanvasToImage = (): void => {
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('Canvas not found.')
    return
  }

  const dataURL = canvas.toDataURL()
  const link = document.createElement('a')

  link.href = dataURL
  link.download = 'my-creation.png'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const uploadCanvasImage = async (): Promise<string | undefined> => {
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