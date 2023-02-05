// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const config = ({
    // Find your project ID and dataset in `sanity.config.js` in your studio project
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2021-08-31'
    // useCdn == true gives fast, cheap responses using a globally distributed cache.
    // Set this to false if your application require the freshest possible
    // data always (potentially slightly slower and a bit more expensive).
});

const client = sanityClient(config);

export default function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {_id, name, email, comment } =JSON.parse(req.body);

    try {
        client.create({
            _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,
            email,
            comment
        });
    } catch (err) {
        return res.status(500).json({ message: "Couldn't submit comment", err});
    }

    console.log("COmment Submitted");
    res.status(200).json({ message: 'Comment Submitted' })
}
