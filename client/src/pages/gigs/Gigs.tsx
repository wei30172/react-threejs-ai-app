import { FC, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { IGig } from '../../reducers/gigReducer'
import newRequest from '../../utils/newRequest'
import { GigCard } from '../../components'
import { Loader, ErrorIcon, BarsArrowDownIcon } from '../../components/icons'
import './Gigs.scss'

const Gigs: FC = () => {
  const [sort, setSort] = useState<'sales' | 'createdAt'>('sales')
  const [open, setOpen] = useState(false)
  const minRef = useRef<HTMLInputElement>(null)
  const maxRef = useRef<HTMLInputElement>(null)

  const { search } = useLocation()

  const { isLoading, error, data, refetch } = useQuery<IGig[], Error>({
    queryKey: ['gigs'],
    queryFn: () =>
      newRequest
        .get<IGig[]>(`/gigs?search=${search}&min=${minRef?.current?.value}&max=${maxRef?.current?.value}&sort=${sort}`)
        .then((res) => res.data)
  })

  const reSort = (type: 'sales' | 'createdAt') => {
    setSort(type)
  }

  useEffect(() => {
    refetch()
  }, [refetch, sort])

  const apply = () => {
    refetch()
  }

  return (
    <div className='gigs'>
      <div className='container'>
        <h1>Our Plans</h1>
        <p>
          Customize your 3D backdrop and photos, unleash creativity.
        </p>
        <div className='menu'>
          <div className='left'>
            <span>Budget</span>
            <input ref={minRef} type='number' placeholder='min' />
            <input ref={maxRef} type='number' placeholder='max' />
            <button className='button button--filled' onClick={apply}>Apply</button>
          </div>
          <div className='right'>
            <span className='sortBy'>Sort by</span>
            <span className='sortType'>
              {sort === 'sales' ? 'Best Selling' : 'Newest'}
            </span>
            <button
              className='cursor-pointer'
              onClick={() => setOpen(!open)}>
              <BarsArrowDownIcon />
            </button>
            {open && (
              <div className='rightMenu'>
                {sort === 'sales' ? (
                  <span onClick={() => reSort('createdAt')}>Newest</span>
                ) : (
                  <span onClick={() => reSort('sales')}>Best Selling</span>
                )}
                <span onClick={() => reSort('sales')}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className='cards'>
          {isLoading
            ? <Loader /> 
            : error
              ? <ErrorIcon />
              : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  )
}

export default Gigs