import { FC } from 'react'

import { IReview } from '../../slices/apiSlice/reviewsApiSlice'
import { useGetUserInfoByIdQuery } from '../../slices/apiSlice/usersApiSlice'
import { Loader, ErrorIcon, StarIconFilled } from '../../components/icons'
import './Review.scss'

interface ReviewProps {
  review: IReview
}

const Review: FC<ReviewProps> = ({ review }) => {
  const { isLoading, error, data } = useGetUserInfoByIdQuery(review.userId)

  return (
    <div className='review'>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='user'>
          <img src={data?.img || '/img/noavatar.jpg'} alt='User' />
          <span>{data?.username}</span>
        </div>
      )}
      <div className='stars'>
        {Array(review.star)
          .fill(null)
          .map((_, i) => (
            <StarIconFilled key={i}/>
          ))}
        <span>{review.star}</span>
      </div>
      <p>{review.desc}</p>
    </div>
  )
}

export default Review