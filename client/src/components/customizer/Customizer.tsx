import { FC, useState } from 'react'

import designState, { EditorTabs, FilterTabs, DecalTypes, DecalTypeKey, ActiveFilterTabKey } from '../../store/designState'
import newRequest from '../../utils/newRequest'
import downloadCanvasToImage from '../../utils/downloadCanvasToImage'
import fileReader from '../../utils/fileReader'
import { AIPicker, ColorPicker, FilePicker, Tab, Toast } from '../index'
import { ToastProps } from '../toast/Toast'
import { DownloadIcon } from '../icons'
import './Customizer.scss'

const Customizer: FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState<Record<ActiveFilterTabKey, boolean>>({
    logoShirt: true,
    stylishShirt: false
  })
  const [toastConfig, setToastConfig] = useState<ToastProps>({
    message: '',
    isVisible: false
  })

  const handleSubmit = async (type: 'logo' | 'full') => {
    if (!prompt) {
      setToastConfig({
        message: 'Please enter a prompt',
        isVisible: true,
        type: 'warning'
      })
      return
    }

    try {
      setGeneratingImg(true)
      const response = await newRequest.post('/dalle', { prompt })
      handleDecals(type, `data:image/jpeg;base64,${response.data}`)
    } catch (error) {
      setToastConfig({
        message: `Error: ${error}`,
        isVisible: true,
        type: 'error'
      })
    } finally {
      setGeneratingImg(false)
      setActiveEditorTab('')
    }
  }

  const handleDecals = (type: DecalTypeKey, result: string) => {
    const decalType = DecalTypes[type]

    designState[decalType.stateProperty] = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName: ActiveFilterTabKey) => {
    switch (tabName) {
    case 'logoShirt':
      designState.isLogoTexture = !activeFilterTab[tabName]
      break
    case 'stylishShirt':
      designState.isFullTexture = !activeFilterTab[tabName]
      break
    default:
      designState.isLogoTexture = true
      designState.isFullTexture = false
      break
    }

    setActiveFilterTab(prevState => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type: 'logo' | 'full') => {
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
        generatingImg={generatingImg}
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
        onHide={() => setToastConfig({isVisible: false, message: ''})}
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
            onClick={downloadCanvasToImage}
          >
            <DownloadIcon />
          </button>
        </div>
      </>
    </>
  )
}

export default Customizer