import { useRef, memo, useCallback } from 'react'

import { useGetImagePostsQuery, IImagePost } from '../../slices/apiSlice/postApiSlice'
import { useToast } from '../../hooks/useToast'
import { PostCard, Toast } from '../../components'
import { ToastType } from '../../components/toast/Toast'
import { Loader, ErrorIcon } from '../../components/icons'
import './Posts.scss'

type RenderCardsProps = {
  data: IImagePost[]
  showToast: (message: string, type: ToastType) => void
}

const RenderCards: React.FC<RenderCardsProps> = memo(({ data, showToast }) => {
  return (
    <>
      {data.map((post: IImagePost) => (
        <PostCard
          key={post._id}
          {...post}
          showToast={showToast}
        />
      ))}
    </>
  )
})

const Posts: React.FC = () => {
  const search = useRef<HTMLInputElement>(null)
  const { showToast, hideToast, toastConfig } = useToast()

  const { isLoading, error, data = [], refetch } = useGetImagePostsQuery({ search: search.current?.value || '' })
  
  const apply = useCallback(() => {
    if (search.current?.value) {
      refetch()
    }
  }, [refetch])

  const postsEmpty = data.length === 0

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <section className='posts'>
        <div className='container'>
          <div className='title'>
            <h1>Images Gallery</h1>
            <p>Discover a compilation of imaginative and visually captivating images rendered by DALL-E AI.</p>
          </div>
          <div className='posts__inputs'>
            <input ref={search} type='text' placeholder='Search something...' />
            <button className='button button--filled' onClick={apply}>Apply</button>
          </div>
          <div className='posts__cards'>
            {isLoading 
              ? <Loader />
              : error 
                ? <ErrorIcon />
                : <div className='posts__image'>
                  {postsEmpty
                    ? <h2>{search.current?.value ? 'No Search Results Found' : 'No Posts Yet'}</h2>
                    : <RenderCards data={data} showToast={showToast} />}
                </div>
            }
          </div>
        </div>
      </section>
    </>
  )
}

export default Posts
