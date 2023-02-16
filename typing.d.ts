import { Reference } from "@sanity/types";

export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    author: {
        name: string;
        image: string;
    };
    comments: [Comment];
    description: string;
    categories: Reference;
    mainImage: {
        asset: {
            url: string;
        };
    };
    slug: {
        current: string;
    };
    body: [object];
}

interface Comment {
    _id: string;
    _createdAt: string;
    name: string;
    email: string;
    comment: string;
    approved: boolean;
    post: Reference;
}

export interface Category {
    _id: string;
    _createdAt: string;
    title: string;
}