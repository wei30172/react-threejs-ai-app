import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useGetGigsQuery, useDeleteGigMutation, IGig } from '../../slices/apiSlice/gigsApiSlice'
import { RootState } from '../../store'
import { ApiError } from '../../slices/apiSlice'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/toast/Toast'
import { Loader, ErrorIcon, DeleteIcon, EditIcon } from '../../components/icons'
import './myGigs.scss'

const MyGigs: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const { showToast, hideToast, toastConfig } = useToast()

  const { isLoading, error, data } = useGetGigsQuery({ userId: userInfo?._id })
  
  const [deleteGig, { isLoading: isDeletingGig }] = useDeleteGigMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteGig(id).unwrap()
      showToast('Gig deleted successfully', 'success')
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Delete gig failed'
      showToast(errorMessage, 'error')
    }
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className='my-gigs'>
        {isLoading || isDeletingGig ? <Loader /> : error ? <ErrorIcon /> : (
          <div className='container'>
            <div className='title'>
              <h1>Gigs</h1>
              {userInfo?.isSeller && (
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
                      <img className='image' src={gig.cover} alt='' />
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
      </div>
    </>
  )
}

export default MyGigs