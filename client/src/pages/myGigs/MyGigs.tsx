import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { IGig } from '../../reducers/gigReducer'
import newRequest, { AxiosError } from '../../utils/newRequest'
import getCurrentUser from '../../utils/getCurrentUser'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/toast/Toast'
import { Loader, ErrorIcon, DeleteIcon, EditIcon } from '../../components/icons'
import './myGigs.scss'

const MyGigs: FC = () => {
  const [isDeleteing, setIsDeleteing] = useState(false)

  const currentUser = getCurrentUser()

  const { showToast, hideToast, toastConfig } = useToast()

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['mygigs'],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser?._id}`).then((res) => {
        return res.data
      })
  })

  const handleDelete = async (id: string) => {
    try {
      setIsDeleteing(true)
      await newRequest.delete(`/gigs/${id}`)

      refetch()

      showToast('Gig deleted successfully', 'success')

    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = axiosError.response?.data?.message || 'Delete gig failed'
      showToast(errorMessage, 'error')
      
    } finally {
      setIsDeleteing(false)
    }
  }

  return (
    <div className='my-gigs'>
      {isLoading || isDeleteing? (
        <Loader /> 
      ) : error ? (
        <ErrorIcon />
      ) : (
        <>
          <Toast
            isVisible={toastConfig.isVisible}
            message={toastConfig.message}
            type={toastConfig.type}
            onHide={hideToast}
          />
          <div className='container'>
            <div className='title'>
              <h1>Gigs</h1>
              {currentUser?.isSeller && (
                <Link to='/add-gig'>
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
                {data.map((gig: IGig) => (
                  <tr key={gig._id}>
                    <td>
                      <img className='image' src={gig.cover} alt='' />
                    </td>
                    <td>{gig.title}</td>
                    <td>{gig.price}</td>
                    <td>{gig.sales}</td>
                    <td>
                      <Link to={`/edit-gig/${gig._id}`}>
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
        </>
      )}
    </div>
  )
}

export default MyGigs