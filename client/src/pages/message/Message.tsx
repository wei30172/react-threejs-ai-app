import { FC, FormEvent, useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useGetMessagesQuery, useCreateMessageMutation } from '../../slices/apiSlice/messagesApiSlice'
import { RootState } from '../../store'
import { Loader, ErrorIcon } from '../../components/icons'
import './Message.scss'

const Message: FC = () => {
  const { id } = useParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const { isLoading, error, data } = useGetMessagesQuery(id)

  const [createMessage, { isLoading: isCreatingMessage, isError }] = useCreateMessageMutation()

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const textarea = e.currentTarget.elements[0] as HTMLTextAreaElement

    if (id) {
      await createMessage({
        conversationId: id,
        desc: textarea.value
      })
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
    }
  }, [id, createMessage])

  return (
    <div className='message'>
      <div className='container'>
        <div className='title'>
          <h1>Message</h1>
          <Link to='/messages'>
            <button className='button button--filled'>All Messages</button>
          </Link>
        </div>
        { isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <div className='messages'>
            {data?.map((m) => (
              <div className={m.userId === userInfo?._id ? 'item' : 'owner item'} key={m._id}>
                <img
                  src={userInfo?.img}
                  alt=''
                />
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className='write' onSubmit={handleSubmit}>
          <textarea ref={textareaRef} placeholder='write a message' />
          <button
            type='submit'
            className="button button--filled"
            disabled={isCreatingMessage}
          >
            {isCreatingMessage ? 'Sending Message' : 'Send'}
          </button>
        </form>
        <span className='error-message'>
          {isError ? 'Send message failed ' : ''}
        </span>
      </div>
    </div>
  )
}

export default Message