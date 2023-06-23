import { useRef, FormEvent } from 'react'
import { useSelector } from 'react-redux'

import { useGetReviewsByGigQuery, useCreateReviewMutation } from '../../slices/apiSlice/reviewsApiSlice'
import { RootState } from '../../store'
import { ApiError } from '../../slices/apiSlice'
import Review from '../review/Review'
import { Loader, ErrorIcon } from '../../components/icons'
import './Reviews.scss'

interface ReviewsProps {
  gigId: string
}

const Reviews: React.FC<ReviewsProps> = ({ gigId }) => {
  const descRef = useRef<HTMLInputElement>(null)
  const starRef = useRef<HTMLSelectElement>(null)

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const { isLoading, error, data } = useGetReviewsByGigQuery(gigId)

  const [createReview, { isLoading: isCreatingReview, error: createReviewError }] = useCreateReviewMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userInfo && descRef.current && starRef.current) {
      const desc = descRef.current.value
      const star = Number(starRef.current.value) as 1 | 2 | 3 | 4 | 5
      const userId = userInfo._id
      await createReview({ gigId, userId, desc, star })
      descRef.current.value=''
      starRef.current.value='5'
    }
  }

  return (
    <div className='reviews'>
      <h2>Reviews</h2>
      {isLoading
        ? <Loader />
        : error
          ? <ErrorIcon />
          : data && data.map((review, i) => 
            <div key={i} >
              <Review review={review} />
              <hr />
            </div>
          )}
      <div className='add'>
        <h3>Add a review</h3>
        <form action='' className='addForm' onSubmit={handleSubmit}>
          <input required type='text' placeholder='write your opinion' ref={descRef}/>
          <select name='' id='' ref={starRef}>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
          <button
            className='button button--filled'
            disabled={isCreatingReview}
          >
            {isCreatingReview ? 'Sending Review' : 'Send'}
          </button>
          <span className='error-message'>
            {createReviewError ? (createReviewError as ApiError)?.data?.message || 'Create review failed ' : ''}
          </span>
        </form>
      </div>
    </div>
  )
}

export default Reviews