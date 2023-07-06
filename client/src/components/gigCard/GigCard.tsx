import { Link } from 'react-router-dom'

import { useGetUserInfoByIdQuery } from '../../slices/apiSlice/usersApiSlice'
import { IGig } from '../../slices/apiSlice/gigsApiSlice'
import { Loader, ErrorIcon, StarIconFilled, HeartIconFilled } from '../../components/icons'
import './GigCard.scss'

const DESCRIPTION_LIMIT = 100

const limitDescription = (description: string, limit = DESCRIPTION_LIMIT) => {
  return description.length > limit ? `${description.slice(0, limit)}...` : description
}

const UserInfo: React.FC<{userId: string}> = ({ userId }) => {
  const { isLoading: isLoadingUserInfo, error: loadUserInfoError, data: userInfoData } = useGetUserInfoByIdQuery(userId)

  if (isLoadingUserInfo) return <Loader />
  if (loadUserInfoError) return <ErrorIcon />

  return (
    <div className='gig-card__user'>
      <img src={userInfoData?.userPhoto || '/img/noavatar.jpg'} alt='User' />
      <span>{userInfoData?.username}</span>
    </div>
  )
}

interface GigCardProps {
  gigItem: IGig
}

const GigCard: React.FC<GigCardProps> = ({ gigItem }) => {
  const averageStars = !isNaN(gigItem.totalStars / gigItem.starNumber)
    ? Math.round(gigItem.totalStars / gigItem.starNumber)
    : 0

  return (
    <Link to={`/gig/${gigItem._id}`} className='link'>
      <div className='gig-card'>
        <img src={gigItem.gigPhoto} alt='Gig Cover' />
        <div className='gig-card__info'>
          <UserInfo userId={gigItem.userId} />
          <p>{limitDescription(gigItem.desc)}</p>
          <div className='gig-card__star'>
            <StarIconFilled />
            <span>{averageStars}</span>
          </div>
        </div>
        <hr />
        <div className='gig-card__detail'>
          <HeartIconFilled />
          <div className='gig-card__price'>
            <span>STARTING AT</span>
            <h2>$ {gigItem.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GigCard