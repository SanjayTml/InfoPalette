import { GetServerSideProps, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Category, Post } from "../../typing";

interface Props {
  posts: [Post];
  category: Category;
  categories: [Category];
}

function Category({ posts, category, categories }: Props) {
  // Get post by destructuring props
  const router = useRouter();
  const { title } = router.query;

  return (
    <main className="max-w-7xl mx-auto">
      <Header {...categories} />
      <h1 className="text-2xl text-center">{title}</h1>

      <hr className="max-w-3xl my-2 mx-auto border border-sky-600" />

      {/* Posts */}
      {posts.length ? (
        <>
          <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div
                  className="cursor-pointer hover:scale-105 
                    transition-transform duration-200 ease-in-out border border-black"
                >
                  {post.mainImage && (
                    <img
                      className="h-60 w-full object-cover"
                      src={urlFor(post.mainImage).url()!}
                      alt="post-image"
                    />
                  )}
                  <div className="flex justify-between p-5 bg-white border border-t-black">
                    <div>
                      <p className="text-lg font-bold">{post.title}</p>
                      <p className="text-xs">
                        {post.description} by {post.author.name}
                      </p>
                    </div>

                    <img
                      className="h-12 w-12 rounded-full"
                      src={urlFor(post.author.image).url()!}
                      alt="author-image"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <h1 className="text-2xl">No posts found for this category</h1>
          </div>
        </>
      )}
    </main>
  );
}

export default Category;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const categoryQuery = `*[_type == "category" && title == $title][0]{
        _id,
        title
      }`;

  const category = await sanityClient.fetch(categoryQuery, {
    title: params?.title,
  });

  const id = category._id;

  const postQuery = `*[_type == "post" && categories[0]._ref == '${id}']{
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

  const posts = await sanityClient.fetch(postQuery);

  return {
    props: {
      posts,
    },
  };
};
