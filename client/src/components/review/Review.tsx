import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'

import newRequest from '../../utils/newRequest'
import { Loader, ErrorIcon, StarIconFilled } from '../../components/icons'
import './Review.scss'


export interface IReview {
  _id?: string
  gigId: string
  userId: string
  star: number
  desc: string
}

interface ReviewProps {
  review: IReview
}

interface UserData {
  img?: string
  username: string
  country: string
}

const Review: FC<ReviewProps> = ({ review }) => {
  const { isLoading, error, data } = useQuery<UserData, Error>(
    {
      queryKey: [review.userId],
      queryFn: () =>
        newRequest.get(`/users/${review.userId}`).then((res) => res.data)
    }
  )

  return (
    <div className='review'>
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