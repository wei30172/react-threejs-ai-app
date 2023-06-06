import { FC, useRef, FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import newRequest from '../../utils/newRequest'
import getCurrentUser from '../../utils/getCurrentUser'
import Review, { IReview } from '../review/Review'
import { Loader, ErrorIcon } from '../../components/icons'
import './Reviews.scss'

interface ReviewsProps {
  gigId: string
}

const Reviews: FC<ReviewsProps> = ({ gigId }) => {
  const queryClient = useQueryClient()
  
  const descRef = useRef<HTMLInputElement>(null)
  const starRef = useRef<HTMLSelectElement>(null)

  const currentUser = getCurrentUser()

  const { isLoading, error, data } = useQuery<IReview[], Error>({
    queryKey: ['reviews'],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => res.data)
  })

  const mutation = useMutation(
    (review: IReview) => newRequest.post('/reviews', review),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews'])
      }
    }
  )

  const { isLoading: isReviewLoading,  error: reviewError} = mutation

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (currentUser && descRef.current && starRef.current) {
      const desc = descRef.current.value
      const star = Number(starRef.current.value)
      const userId = currentUser._id
      mutation.mutate({ userId , gigId, desc, star })
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
          : data?.map((review, i) => 
            <div key={i} >
              <Review review={review} />
              <hr />
            </div>
          )}
      <div className='add'>
        <h3>Add a review</h3>
        <form action='' className='addForm' onSubmit={handleSubmit}>
          <input type='text' placeholder='write your opinion' ref={descRef}/>
          <select name='' id='' ref={starRef}>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
          <button className='button button--filled'>
            {isReviewLoading ? 'Sending Review' : 'Send'}
          </button>
          <span className='error-message'>
            {!reviewError ? 'Create Review failed ' : ''}
          </span>
        </form>
      </div>
    </div>
  )
}

export default Reviews