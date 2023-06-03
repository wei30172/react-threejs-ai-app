import { FC } from 'react'

import { StarIconFilled } from '../../components/icons'
import './Seller.scss'

interface SellerProps {
  dataUser: {
    img?: string
    username: string
  };
  data: {
    totalStars: number
    starNumber: number
  };
}

const Seller: FC<SellerProps> = ({ dataUser, data }) => {
  return (
    <div className='seller'>
      <h2>Seller</h2>
      <div className='user'>
        <img src={dataUser.img || '/img/noavatar.jpg'} alt='atar' />
        <div className='info'>
          <span>{dataUser.username}</span>
          {!isNaN(data.totalStars / data.starNumber) && (
            <div className='stars'>
              {Array(Math.round(data.totalStars / data.starNumber))
                .fill(null)
                .map((_item, i) => (
                  <StarIconFilled key={i}/>
                ))}
              <span>
                {Math.round(data.totalStars / data.starNumber)}
              </span>
            </div>
          )}
          <button className='cursor-pointer'>Contact Me</button>
        </div>
      </div>
    </div>
  )
}

export default Seller