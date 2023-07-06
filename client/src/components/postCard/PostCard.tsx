import { useSelector, useDispatch } from 'react-redux'

import { useDeleteImagePostMutation } from '../../slices/apiSlice/postApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { DownloadIcon, DeleteIcon } from '../icons'
import { downloadImage } from '../../utils/handleImage'
import { Loader } from '../../components/icons'
import './PostCard.scss'

type CardProps = {
  _id: string
  name: string
  prompt: string
  postPhoto: string
  postCloudinaryId: string
}

const Avatar: React.FC<{ name: string }> = ({ name }) => (
  <div className='avatar__container flex-center'>
    {name[0]}
  </div>
)

const Card: React.FC<CardProps> = ({ _id, name, prompt, postPhoto }) => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const [deleteImagePost, { isLoading: isDeletingPost }] = useDeleteImagePostMutation()

  const handleDownloadImage = (): void => {
    downloadImage(postPhoto, `download-${_id}`)
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    try {
      await deleteImagePost(_id).unwrap()

      dispatch(showToast({
        message: 'Post deleted successfully',
        type: 'success'
      }))

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Delete gig failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }

  return (
    <div className='post-card'>
      <img src={postPhoto} alt={prompt} />
      <div className='post-card__info'>
        <p className='post-card__promp'>{prompt}</p>
        <div className='post-card__detail'>
          <div className='post-card__avatar'>
            <Avatar name={name} />
            <p>{name}</p>
          </div>
          <div className='post-card__buttons'>
            {isDeletingPost 
              ? <Loader />
              : (
                <>
                  <button
                    className='button button--filled'
                    onClick={handleDownloadImage}
                  >
                    <DownloadIcon />
                  </button>
                  {userInfo.isAdmin &&<button
                    className='button button--filled'
                    onClick={handleDelete}
                  >
                    <DeleteIcon />
                  </button>}
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card