import { ChangeEvent, FC } from 'react'

import CustomButton from '../../button/CustomButton'
import './AIPicker.scss'

interface AIPickerProps {
  prompt: string
  setPrompt: (value: string) => void
  generatingImg: boolean
  handleSubmit: (value: 'logo' | 'full') => void
}

const AIPicker: FC<AIPickerProps> = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => setPrompt(event.target.value)

  return (
    <div className="ai-picker glassmorphism glassmorphism-container">
      <textarea 
        placeholder="Ask AI..."
        rows={5}
        value={prompt}
        onChange={handleChange}
        className="top"
      />
      <div className="bottom">
        {generatingImg ? (
          <CustomButton 
            type="outline"
            title="Asking AI..."
          />
        ) : (
          <>
            <CustomButton 
              type="filled"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
            />

            <CustomButton 
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AIPicker