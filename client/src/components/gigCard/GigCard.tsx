import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { IGig } from '../../reducers/gigReducer'
import newRequest from '../../utils/newRequest'
import { Loader, ErrorIcon, StarIconFilled, HeartIconFilled } from '../../components/icons'
import './GigCard.scss'

interface GigCardProps {
  item: IGig
}

interface UserData {
  img?: string
  username: string
}

const GigCard = ({ item }: GigCardProps) => {
  const { isLoading, error, data } = useQuery<UserData, Error>({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get<UserData>(`/users/${item.userId}`).then((res) => res.data)
  })

  const limitDescription = (description: string, limit = 100) => {
    if (description.length > limit) {
      return `${description.slice(0, limit)}...`
    }
    return description
  }
  return (
    <Link to={`/gig/${item._id}`} className='link'>
      <div className='gig-card'>
        <img src={item.cover} alt='Gig Cover' />
        <div className='info'>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorIcon />
          ) : (
            <div className='user'>
              <img src={data?.img || '/img/noavatar.jpg'} alt='User' />
              <span>{data?.username}</span>
            </div>
          )}
          <p>{limitDescription(item.desc)}</p>
          <div className='star'>
            <StarIconFilled />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className='detail'>
          <HeartIconFilled />
          <div className='price'>
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GigCard