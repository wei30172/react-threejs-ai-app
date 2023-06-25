import CustomButton from '../button/CustomButton'
import FormInput, { InputType, Props } from './FormInput'
import './FormInput.scss'

export type SurpriseMeInputType = InputType & {
  isSurpriseMe?: boolean
  handleSurpriseMe?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

interface SurpriseProps extends Props {
  isSurpriseMe?: boolean
  handleSurpriseMe: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SurpriseMeFormInput: React.FC<SurpriseProps> = ({
  isSurpriseMe,
  handleSurpriseMe,
  ...inputProps
}) => {
  return (
    <>
      <FormInput {...inputProps} />
      {isSurpriseMe && (
        <CustomButton 
          type="outline"
          title="Prompt Surprise"
          handleClick={handleSurpriseMe}
        />
      )}
    </>
  )
}

export default SurpriseMeFormInput