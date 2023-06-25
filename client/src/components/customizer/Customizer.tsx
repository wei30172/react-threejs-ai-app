import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setDesign } from '../../slices/designSlice'
import { TabType } from './tab/Tab'
import { useGenerateDalleImageMutation } from '../../slices/apiSlice/dalleApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { downloadCanvasImage } from '../../utils/handleCanvasImage'
import { fileReader } from '../../utils/handleImage'
import { useToast } from '../../hooks/useToast'
import { AIPicker, ColorPicker, FilePicker, Tab, Toast } from '../index'
import { DownloadIcon, SwatchIcon, FileIcon, LogoShirtIcon, StylishShirtIcon } from '../icons'
// import { DownloadIcon, SwatchIcon, FileIcon, AiIcon, LogoShirtIcon, StylishShirtIcon } from '../icons'
import './Customizer.scss'

// Editor tabs configuration
const EditorTabs: TabType[] = [
  {
    name: 'colorpicker',
    icon: SwatchIcon
  },
  {
    name: 'filepicker',
    icon: FileIcon
  }
  // {
  //   name: 'aipicker',
  //   icon: AiIcon
  // }
]

// Filter tabs configuration
type DecalTypeKey = 'logo' | 'full'
type ActiveFilterTabKey = 'logoShirt' | 'stylishShirt'
type ActiveFilterTabValue = 'logoDecal' | 'fullDecal'

type FilterTabType = TabType & {
  name: ActiveFilterTabKey
}

const FilterTabs: FilterTabType[] = [
  {
    name: 'logoShirt',
    icon: LogoShirtIcon
  },
  {
    name: 'stylishShirt',
    icon: StylishShirtIcon
  }
]

// Decal types configuration
type DecalType = {
  [key in DecalTypeKey]: {
    stateProperty: ActiveFilterTabValue
    filterTab: ActiveFilterTabKey
  }
}

const DecalTypes: DecalType = {
  logo: {
    stateProperty: 'logoDecal',
    filterTab: 'logoShirt'
  },
  full: {
    stateProperty: 'fullDecal',
    filterTab: 'stylishShirt'
  }
}

const Customizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<Record<ActiveFilterTabKey, boolean>>({
    logoShirt: true,
    stylishShirt: false
  })
  
  const { showToast, hideToast, toastConfig } = useToast()

  const dispatch = useDispatch()

  const [generateDalleImage, { isLoading: isGeneratingImage }] = useGenerateDalleImageMutation()

  const handleSubmit = async (type: DecalTypeKey) => {
    if (!prompt) {
      showToast('Please enter a prompt', 'warning')
      return
    }

    try {
      const imageData = await generateDalleImage({prompt}).unwrap()
      handleDecals(type, `data:image/jpeg;base64,${imageData}`)
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Generate failed'
      showToast(errorMessage, 'error')
    } finally {
      setActiveEditorTab('')
    }
  }

  const handleDecals = (type: DecalTypeKey, result: string) => {
    const decalType = DecalTypes[type]

    dispatch(setDesign({ field: decalType.stateProperty, value: result }))

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName: ActiveFilterTabKey) => {
    const switchActions: Record<ActiveFilterTabKey, () => void> = {
      logoShirt: () => dispatch(setDesign({ field: 'isLogoTexture', value: !activeFilterTab[tabName] })),
      stylishShirt: () => dispatch(setDesign({ field: 'isFullTexture', value: !activeFilterTab[tabName] }))
    }

    const switchAction = switchActions[tabName]
    if (switchAction) switchAction()

    setActiveFilterTab(prevState => ({
      ...prevState,
      [tabName]: !prevState[tabName]
    }))
  }

  const readFile = (type: DecalTypeKey) => {
    if (file) {
      fileReader(file)
        .then(result => {
          handleDecals(type, result as string)
          setActiveEditorTab('')
        })
    }
  }
  
  const generateTabContent = () => {
    switch (activeEditorTab) {
    case 'colorpicker':
      return <ColorPicker />
    case 'filepicker':
      return <FilePicker
        setFile={setFile}
        readFile={readFile}
      />
    case 'aipicker':
      return <AIPicker 
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={isGeneratingImage}
        handleSubmit={handleSubmit}
      />
    default:
      return null
    }
  }

  const handleTabContent = (name: string) => {
    if (name === activeEditorTab) {
      setActiveEditorTab('')
    } else {
      setActiveEditorTab(name)
    }
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <>
        {/* Side Editor Tabs */}
        <div
          key="custom"
          className="tabs-container"
        >
          <div className="editor-tabs flex-center glassmorphism">
            {EditorTabs.map(tab => (
              <Tab 
                key={tab.name}
                tab={tab}
                handleClick={() => handleTabContent(tab.name)}
              />
            ))}

            {generateTabContent()}
          </div>
        </div>

        {/* Bottom Filter Tabs */}
        <div
          className='filter-tabs flex-center'
        >
          {FilterTabs.map(tab => (
            <Tab
              key={tab.name}
              tab={tab}
              isFilterTab
              isActiveTab={activeFilterTab[tab.name]}
              handleClick={() => handleActiveFilterTab(tab.name)}
            />
          ))}

          <button
            className='download-button flex-center cursor-pointer glassmorphism'
            onClick={downloadCanvasImage}
          >
            <DownloadIcon />
          </button>
        </div>
      </>
    </>
  )
}

export default Customizer