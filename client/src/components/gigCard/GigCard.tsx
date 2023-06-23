import { FC } from 'react'
import { Link } from 'react-router-dom'

import { useGetUserInfoByIdQuery } from '../../slices/apiSlice/usersApiSlice'
import { IGig } from '../../slices/apiSlice/gigsApiSlice'
import { Loader, ErrorIcon, StarIconFilled, HeartIconFilled } from '../../components/icons'
import './GigCard.scss'

interface GigCardProps {
  gigItem: IGig
}

const GigCard: FC<GigCardProps> = ({ gigItem }) => {
  const { isLoading, error, data } = useGetUserInfoByIdQuery(gigItem.userId)

  const limitDescription = (description: string, limit = 100) => {
    if (description.length > limit) {
      return `${description.slice(0, limit)}...`
    }
    return description
  }

  return (
    <Link to={`/gig/${gigItem._id}`} className='link'>
      <div className='gig-card'>
        <img src={gigItem.cover} alt='Gig Cover' />
        <div className='info'>
          {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
            <div className='user'>
              <img src={data?.img || '/img/noavatar.jpg'} alt='User' />
              <span>{data?.username}</span>
            </div>
          )}
          <p>{limitDescription(gigItem.desc)}</p>
          <div className='star'>
            <StarIconFilled />
            <span>
              {!isNaN(gigItem.totalStars / gigItem.starNumber) &&
                Math.round(gigItem.totalStars / gigItem.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className='detail'>
          <HeartIconFilled />
          <div className='price'>
            <span>STARTING AT</span>
            <h2>$ {gigItem.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GigCard