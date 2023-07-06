import { useGetUserInfoByIdQuery } from '../../slices/apiSlice/usersApiSlice'
import { IGig } from '../../slices/apiSlice/gigsApiSlice'
import { StarIconFilled } from '../../components/icons'
import { Loader, ErrorIcon } from '../../components/icons'
import './Seller.scss'

interface SellerProps {
  gigData: IGig
}

const Seller: React.FC<SellerProps> = ({ gigData }) => {
  const { isLoading, error, data } = useGetUserInfoByIdQuery(gigData.userId)
  
  const averageStars = !isNaN(gigData.totalStars / gigData.starNumber)
    ? Math.round(gigData.totalStars / gigData.starNumber)
    : 0

  const starsIcons = Array(Math.min(5, averageStars)) // Limit the stars to 5
    .fill(null)
    .map((_item, i) => (
      <StarIconFilled key={i}/>
    ))

  return (
    <div className='seller'>
      <h2>Seller</h2>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='seller__user'>
          <img src={data?.userPhoto || '/img/noavatar.jpg'} alt={`${data?.username}'s avatar`} />
          <div className='seller__info'>
            <span>{data?.username}</span>
            {averageStars > 0 && (
              <div className='seller__stars'>
                {starsIcons}
                <span>{averageStars}</span>
              </div>
            )}
            <button className='cursor-pointer'>Contact Me</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Seller