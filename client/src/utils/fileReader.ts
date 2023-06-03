const readFile = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => resolve(fileReader.result)
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsDataURL(file)
  })

export default readFile