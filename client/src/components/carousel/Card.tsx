import { FC } from 'react'
import './Card.scss'

type CardProps = {
  item: string
};

const Card: FC<CardProps> = ({ item }) => {
  return (
    <div className='carousel_card'>
      <div className='image-container'>
        <img
          src={item}
          alt='carousel display'
        />
      </div>
    </div>
  );
};

export default Card