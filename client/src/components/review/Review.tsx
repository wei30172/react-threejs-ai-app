import { IReview } from '../../slices/apiSlice/reviewsApiSlice'
import { useGetUserInfoByIdQuery } from '../../slices/apiSlice/usersApiSlice'
import { Loader, ErrorIcon, StarIconFilled } from '../../components/icons'
import './Review.scss'

interface ReviewProps {
  review: IReview
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const { isLoading, error, data } = useGetUserInfoByIdQuery(review.userId)

  return (
    <div className='review'>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='review__user'>
          <img src={data?.userPhoto || '/img/noavatar.jpg'} alt='User' />
          <span>{data?.username}</span>
        </div>
      )}
      <div className='review__stars'>
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