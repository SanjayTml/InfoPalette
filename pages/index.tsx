import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Category, Post } from '../typing'

interface Props {
  posts: [Post];
  categories: [Category];
}

export default function Home({ posts, categories }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>InfoPalette</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header {...categories}/>

      <div className='flex justify-between items-center border-black border py-10 ld:py-0'>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl'>
            <span className='underline px-1 decoration-black decoration-4'>InfoPalette</span>,
          </h1>
          <h1 className='text-6xl max-w-xl'> Things That Matter</h1>
          <h2 className='px-1'>
            Post your creative writings for free and let it speak with awesome readers.
          </h2>
        </div>

        <img 
          className='hidden md:inline-flex h-22 lg:h-full'
          src="https://infopalette.com/wp-content/uploads/2020/08/logo-new.png" alt="" 
        />
        <div></div>
      </div>

      {/* Posts */}
      <div className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='cursor-pointer hover:scale-105 
                transition-transform duration-200 ease-in-out border border-black'>
              {post.mainImage && (
                <img className='h-60 w-full object-cover' src={
                  urlFor(post.mainImage).url()!
                } alt="post-image" />
              )}
              <div className='flex justify-between p-5 bg-white border border-t-black'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>{post.description} by {post.author.name}</p>
                </div>

                <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} alt="author-image" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author-> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}
