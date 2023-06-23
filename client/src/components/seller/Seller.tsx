import { FC } from 'react'

import { useGetUserInfoByIdQuery } from '../../slices/apiSlice/usersApiSlice'
import { IGig } from '../../slices/apiSlice/gigsApiSlice'
import { StarIconFilled } from '../../components/icons'
import { Loader, ErrorIcon } from '../../components/icons'
import './Seller.scss'

interface SellerProps {
  gigData: IGig
}

const Seller: FC<SellerProps> = ({ gigData }) => {
  const { isLoading, error, data } = useGetUserInfoByIdQuery(gigData.userId)
  
  return (
    <div className='seller'>
      <h2>Seller</h2>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='user'>
          <img src={data?.img || '/img/noavatar.jpg'} alt='atar' />
          <div className='info'>
            <span>{data?.username}</span>
            {!isNaN(gigData.totalStars / gigData.starNumber) && (
              <div className='stars'>
                {Array(Math.round(gigData.totalStars / gigData.starNumber))
                  .fill(null)
                  .map((_item, i) => (
                    <StarIconFilled key={i}/>
                  ))}
                <span>
                  {Math.round(gigData.totalStars / gigData.starNumber)}
                </span>
              </div>
            )}
            <button className='cursor-pointer'>Contact Me</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Seller