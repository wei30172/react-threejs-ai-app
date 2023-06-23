import { Link } from 'react-router-dom'

import { CustomButton } from '../../components'
import './Home.scss'

const Home: React.FC = () => {
  return (
    <div className='home flex-center'>
      <div className='title'>
        <h1>CAPTURE <br className='break' /> THE MOMENT.</h1>
      </div>
      <div className='content'>
        <p>Craft your personalized backdrop and photos with our advanced 3d customization features.
          Set your creativity free and establish your distinct aesthetic...
        </p>
        <Link to='/gigs'>
          <CustomButton
            type='filled'
            title='Design Your Own'
          />
        </Link>
      </div>
    </div>
  )
}

export default Home