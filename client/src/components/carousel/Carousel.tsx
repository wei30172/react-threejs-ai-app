import { useState, useEffect, useRef, useCallback } from 'react'
import Card from './Card'
import { DoubleLeftIcon, DoubleRightIcon } from '../icons'
import './Carousel.scss'

type CarouselProps = {
  carouselImages: string[]
}

const Carousel: React.FC<CarouselProps> = ({ carouselImages }) => {
  const maxScrollWidth = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)

  const movePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const moveNext = useCallback(() => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex])

  const isDisabled = useCallback((direction: string) => {
    if (direction === 'prev') return currentIndex <= 0

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      )
    }

    return false
  }, [currentIndex])

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0
  }, [])

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex
    }
  }, [currentIndex])

  return (
    <div className='carousel'>
      <div className='carousel__container'>
        <div className='carousel__buttons'>
          <button
            onClick={movePrev}
            className='carousel__arrow cursor-pointer'
            disabled={isDisabled('prev')}
          >
            <DoubleLeftIcon />
          </button>
          <button
            onClick={moveNext}
            className='carousel__arrow cursor-pointer'
            disabled={isDisabled('next')}
          >
            <DoubleRightIcon />
          </button>
        </div>
        <div ref={carousel} className='carousel__cards'>
          {carouselImages?.map((item) => {
            return (
              <Card
                key={item}
                item={item}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Carousel