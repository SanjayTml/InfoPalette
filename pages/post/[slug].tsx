import { GetStaticProps } from "next";
import { useState } from "react";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Category, Post } from "../../typing";
import { useForm, SubmitHandler } from 'react-hook-form';

interface Props {
    post: Post;
    categories: [Category];
}

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

function Post({ post, categories }: Props) {    // Get post by destructuring props

    const [submitted, setSubmitted] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async(data) => {
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(data);
            setSubmitted(true);
        }).catch((err) => {
            console.log(err);
            setSubmitted(false);
        })
    }

    return (
        <main>
            <Header {...categories}/>
            <img
                className="w-full h-40 object-cover"
                src={urlFor(post.mainImage).url()!} alt="post-image"
            />

            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-8 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

                <div className="flex items-center space-x-2">
                    <img 
                        className="h-10 w-10 rounded-full"
                        src={urlFor(post.author.image).url()!} alt="author-image"
                    />
                    <p className="font-extralight text-sm">
                        Post by <span className="text-sky-600">{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="mt-8">
                    <PortableText 
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                        content={post.body}
                        serializers={{
                            h1: (props: any) => {
                                <h1 className="text-2xl font-bold my-5" {...props} />
                            },
                            h2: (props: any) => {
                                <h1 className="text-xl font-bold my-5" {...props} />
                            },
                            li: ({children}: any) => {
                                <li className="ml-4 list-disc">{children}</li>
                            },
                            link: ({ href, children }: any) => {
                                <a href={href} className="text-green-400 hover:underline">
                                    {children}
                                </a>
                            }
                        }   //How it takes an item when it goes across the array of objects like h1, link etc in body
                        }
                    />
                </div>

            </article>

            <hr className="max-w-3xl my-5 mx-auto border border-blue-600" />

            {submitted ? (
                <div className="flex flex-col p-10 my-10 bg-sky-500 text-white max-w-2xl mx-auto">
                    <h3>Thank you for submitting your comment!</h3>
                    <p>Once it has been approved, it will appear below.</p>
                </div>
            ): (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
                    <h3 className="text-2xl font-bold">Leave a comment below!</h3>
                    <hr className="py-3 mt-2"/>
    
                    <input {...register("_id")} type="hidden" name="_id" value={post._id}/>
    
                    <label className="block mb-5">
                        <span className="text-gray-700">Name</span>
                        <input {...register("name", {required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none focus:ring ring-blue-500" placeholder="Berry Perry" type="text" />
                    </label>
                    <label className="block mb-5">
                        <span className="text-gray-700">Email</span>
                        <input {...register("email", {required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none focus:ring ring-blue-500" placeholder="berry@perry.dot" type="email" />
                    </label>
                    <label className="block mb-5">
                        <span className="text-gray-700">Comment</span>
                        <textarea {...register("comment", {required: true})} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none focus:ring ring-blue-500" placeholder="Good berries!" rows={8} />
                    </label>
                    
                    {/* Errors will return when field validation fails */}
                    <div className="flex flex-col p-5">
                        {errors.name && (
                            <span className="text-red-500">*Name is required</span>
                        )}
                        {errors.email && (
                            <span className="text-red-500">*Email is required</span>
                        )}
                        {errors.comment && (
                            <span className="text-red-500">*Comment is required</span>
                        )}
                    </div>
    
                    <input type="submit" className="shadow bg-blue-500 hover:bg-sky-500 focus:shadow-outline focus:outline-none font-bold text-white py-2 px-4 cursor-pointer" />
                </form>)}

                {/* Comments */}
                <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto border-black border space-y-2">
                    <h3 className="text-3xl">Comments</h3>
                    <hr className="pb-2"/>

                    {post.comments.map((comment) => (
                        <div key={comment._id}>
                            <p>
                                <span className="text-sky-400">{comment.name}: </span>
                                {comment.comment}
                            </p>
                        </div>
                    ))}
                </div>
        </main>
    )
}

export default Post;

// Find the paths for the posts that exist
export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`;

    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({  // Parenthesis {} means it returns object
        params: {
            slug: post.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({params}) => { // inside async `()` small brackets we use parenthesis {} to destructure the default `context` and get `params` out of it
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments': *[
            _type == "comment" && post._ref == ^._id && approved == true
        ],
        description,
        mainImage,
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 120, // after 120 seconds, it'll update the old cache version
    }
}