import { useRef, memo, useCallback } from 'react'

import { useGetImagePostsQuery, IImagePost } from '../../slices/apiSlice/postApiSlice'
import { PostCard } from '../../components'
import { Loader, ErrorIcon } from '../../components/icons'
import './Posts.scss'

type RenderCardsProps = {
  data: IImagePost[]
}

const RenderCards: React.FC<RenderCardsProps> = memo(({ data }) => {
  return (
    <>
      {data.map((post: IImagePost) => (
        <PostCard
          key={post._id}
          {...post}
        />
      ))}
    </>
  )
})

const Posts: React.FC = () => {
  const search = useRef<HTMLInputElement>(null)

  const { isLoading, error, data = [], refetch } = useGetImagePostsQuery({ search: search.current?.value || '' })
  console.log(data)
  
  const apply = useCallback(() => {
    if (search.current?.value) {
      refetch()
    }
  }, [refetch])

  const postsEmpty = data.length === 0

  return (
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
                  : <RenderCards data={data} />}
              </div>
          }
        </div>
      </div>
    </section>
  )
}

export default Posts
