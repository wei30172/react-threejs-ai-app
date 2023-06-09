import { FC } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import moment from 'moment'

import getCurrentUser from '../../utils/getCurrentUser'
import newRequest from '../../utils/newRequest'
import { Loader, ErrorIcon, EllipsisIconOutline, EllipsisIconFilled } from '../../components/icons'
import './Messages.scss'

interface Conversation {
  id: string
  buyerId: string
  sellerId: string
  lastMessage: string
  updatedAt: string
  readBySeller: boolean
  readByBuyer: boolean
}

const Messages: FC = () => {
  const currentUser = getCurrentUser()

  const queryClient = useQueryClient()

  const { isLoading, error, data } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () =>
      newRequest.get('/conversations').then((res) => {
        return res.data
      })
  })

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return newRequest.put(`/conversations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations'])
    }
  })

  const handleToggleRead = (id: string) => {
    mutation.mutate(id)
  }

  return (
    <div className='messages'>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='container'>
          <div className='title'>
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>{currentUser?.isSeller ? 'Buyer' : 'Seller'}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Mark as Read</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((c) => (
                <tr
                  className={
                    ((currentUser?.isSeller && !c.readBySeller) ||
                      (!currentUser?.isSeller && !c.readByBuyer)) ? 'active' : ''
                  }
                  key={c.id}
                >
                  <td>{currentUser?.isSeller ? c.buyerId : c.sellerId}</td>
                  <td>
                    <Link to={`/message/${c.id}`} className='link'>
                      {c?.lastMessage?.substring(0, 100)}...
                    </Link>
                  </td>
                  <td>{moment(c.updatedAt).fromNow()}</td>
                  <td>
                    <button className="cursor-pointer" onClick={() => handleToggleRead(c.id)}>
                      {((currentUser?.isSeller && !c.readBySeller) ||
                      (!currentUser?.isSeller && !c.readByBuyer)) ? (
                          <EllipsisIconFilled />
                        ) : (
                          <EllipsisIconOutline />
                        )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Messages