import { FC, FormEvent, useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import getCurrentUser from '../../utils/getCurrentUser'
import newRequest from '../../utils/newRequest'
import { Loader, ErrorIcon } from '../../components/icons'
import './Message.scss'

interface Message {
  _id: string
  userId: string
  desc: string
}

const Message: FC = () => {
  const { id } = useParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentUser = getCurrentUser()

  const { isLoading, error, data, refetch } = useQuery<Message[]>({
    queryKey: [`message${id}`],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data
      })
  })

  const messageMutation = useMutation({
    mutationFn: (message: { conversationId: string, desc: string }) => {
      return newRequest.post('/messages', message)
    },
    onSuccess: () => {
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
      refetch()
    }
  })

  const { isLoading: isLoadingMessage,  error: errorMessage} = messageMutation
  const isLoadingOrError = isLoading || error

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const textarea = e.currentTarget.elements[0] as HTMLTextAreaElement

    if (id) {
      messageMutation.mutate({
        conversationId: id,
        desc: textarea.value
      })
    }
  }, [id, messageMutation])

  return (
    <div className='message'>
      <div className='container'>
        <div className='title'>
          <h1>Message</h1>
          <Link to='/messages'>
            <button className='button button--filled'>All Messages</button>
          </Link>
        </div>
        {isLoadingOrError ? (
          isLoading ? <Loader /> : <ErrorIcon />
        ) : (
          <div className='messages'>
            {data?.map((m) => (
              <div className={m.userId === currentUser?._id ? 'item' : 'owner item'} key={m._id}>
                <img
                  src={currentUser?.img}
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
            disabled={isLoadingMessage}
          >
            {isLoadingMessage ? 'Sending Message' : 'Send'}
          </button>
        </form>
        <span className='error-message'>
          {errorMessage ? 'Send message failed ' : ''}
        </span>
      </div>
    </div>
  )
}

export default Message