import { Link } from 'react-router-dom'
import moment from 'moment'
import { useSelector} from 'react-redux'

import { useGetConversationsQuery, useUpdateConversationMutation } from '../../slices/apiSlice/conversationsApiSlice'
import { RootState } from '../../store'
import { Loader, ErrorIcon, EllipsisIconOutline, EllipsisIconFilled } from '../../components/icons'
import './Messages.scss'

const Messages: React.FC = () => {
  const { isLoading, error, data } = useGetConversationsQuery()

  const [updateConversation] = useUpdateConversationMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)
  
  const handleToggleRead = async (id: string) => {
    await updateConversation(id)
  }

  return (
    <section className='messages'>
      <div className='container'>
        <div className='title'>
          <h1>Messages</h1>
        </div>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <>
            {data && data.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>{userInfo?.isSeller ? 'Buyer' : 'Seller'}</th>
                    <th>Last Message</th>
                    <th>Date</th>
                    <th>Mark as Read</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((c) => (
                    <tr
                      className={
                        ((userInfo?.isSeller && !c.readBySeller) ||
                          (!userInfo?.isSeller && !c.readByBuyer)) ? 'active' : ''
                      }
                      key={c.id}
                    >
                      <td>{userInfo?.isSeller ? c.buyerId : c.sellerId}</td>
                      <td>
                        <Link to={`/messages/${c.id}`} className='link'>
                          {c?.lastMessage?.substring(0, 100)}...
                        </Link>
                      </td>
                      <td>{moment(c.updatedAt).fromNow()}</td>
                      <td>
                        <button className="cursor-pointer" onClick={() => handleToggleRead(c.id)}>
                          {((userInfo?.isSeller && !c.readBySeller) ||
                          (!userInfo?.isSeller && !c.readByBuyer)) ? (
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
            ) : (
              <h3>Your order history is empty</h3>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Messages