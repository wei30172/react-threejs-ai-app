import { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { IGig } from '../../reducers/gigReducer'
import { IUser } from '../register/Register'
import newRequest from '../../utils/newRequest'
// import Reviews from '../../components/reviews/Reviews'
import { Loader, ErrorIcon, StarIconFilled, CheckIcon } from '../../components/icons'
import './Gig.scss'

interface RouteParams extends Record<string, string> {
  id: string;
}

const Gig: FC = () => {
  const { id } = useParams<RouteParams>()

  const { isLoading, error, data } = useQuery<IGig, Error>({
    queryKey: ['gig'],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data)
  })

  const userId = data?.userId

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser
  } = useQuery<IUser, Error>({
    queryKey: ['user'],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId
  })

  return (
    <div className='gig'>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorIcon />
      ) : (
        <div className='container'>
          <div className='left'>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              <Loader />
            ) : errorUser ? (
              <ErrorIcon />
            ) : (
              <div className='user'>
                <img
                  className='user-avatar'
                  src={dataUser.img || '/img/noavatar.jpg'}
                  alt=''
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className='stars'>
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill(null)
                      .map((_item, i) => (
                        <StarIconFilled key={i}/>
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}
            <h2>About This Gig</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              'loading'
            ) : errorUser ? (
              'Something went wrong!'
            ) : (
              <div className='seller'>
                <h2>About The Seller</h2>
                <div className='user'>
                  <img src={dataUser.img || '/img/noavatar.jpg'} alt='' />
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
            )}
            {/* <Reviews gigId={id} /> */}
          </div>
          <div className='right'>
            <div className='price'>
              <h2>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className='features'>
              {data.features.map((feature) => (
                <div className='item' key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link to={`/pay/${id}`}>
              <button className='button button--filled'>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gig