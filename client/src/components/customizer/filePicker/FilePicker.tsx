import { FC, ChangeEvent } from 'react'

import CustomButton from '../../button/CustomButton'
import './FilePicker.scss'

interface FilePickerProps {
  setFile: (file: File) => void
  readFile: (type: 'logo' | 'full') => void
}

const FilePicker: FC<FilePickerProps>  = ({ setFile, readFile }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    
    if (files) {
      setFile(files[0])
    }
  }

  return (
    <div className='file-picker glassmorphism glassmorphism-container'>
      <div className='top'>
        <input 
          id='file-upload'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />
      </div>

      <div className='bottom'>
        <CustomButton 
          type='outline'
          title='Logo'
          handleClick={() => readFile('logo')}
        />
        <CustomButton 
          type='filled'
          title='Full'
          handleClick={() => readFile('full')}
        />
      </div>
    </div>
  )
}

export default FilePicker