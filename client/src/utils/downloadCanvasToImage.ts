const downloadCanvasToImage = (): void => {
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

export default downloadCanvasToImage