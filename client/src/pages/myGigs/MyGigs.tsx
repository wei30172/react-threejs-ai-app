import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useGetGigsQuery, useDeleteGigMutation, IGig } from '../../slices/apiSlice/gigsApiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { ApiError } from '../../slices/apiSlice'
import { Loader, ErrorIcon, DeleteIcon, EditIcon, ComputerIcon } from '../../components/icons'
import './myGigs.scss'

const MyGigs: React.FC = () => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const { isLoading, error, data } = useGetGigsQuery({ userId: userInfo?._id })
  
  const [deleteGig, { isLoading: isDeletingGig }] = useDeleteGigMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteGig(id).unwrap()

      dispatch(showToast({
        message: 'Gig deleted successfully',
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
    <section className='my-gigs'>
      {isLoading || isDeletingGig ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='container'>
          <div className='title'>
            <h1>Gigs</h1>
            {userInfo?.isAdmin && (
              <Link to='/my-gigs/add-gig'>
                <button className='button button--filled'>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <tbody>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Action</th>
              </tr>
              {data && data.map((gig: IGig) => (
                <tr key={gig._id}>
                  <td>
                    <img className='image' src={gig.gigPhoto} alt='' />
                  </td>
                  <td>{gig.title}</td>
                  <td>{gig.price}</td>
                  <td>{gig.sales}</td>
                  <td>
                    <Link to={`/my-gigs/edit-gig/${gig._id}`}>
                      <button className='cursor-pointer'>
                        <EditIcon />
                      </button>
                    </Link>
                    <Link to={`/gig/${gig._id}`}>
                      <button className='cursor-pointer'>
                        <ComputerIcon />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(gig._id)}
                      className='cursor-pointer'
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default MyGigs