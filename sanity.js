// import sanityClient from "@sanity/client";
import {createClient} from "next-sanity";
import createImageUrlBuilder from '@sanity/image-url'

export const config = ({
  // Find your project ID and dataset in `sanity.config.js` in your studio project
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: true,
  apiVersion: '2021-08-31'
  // useCdn == true gives fast, cheap responses using a globally distributed cache.
  // Set this to false if your application require the freshest possible
  // data always (potentially slightly slower and a bit more expensive).
});

export const sanityClient = createClient(config);

/**
 * Set up a helper function for generating Image URLs with only the asset
 * reference data in your documents.
 */
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// Helper function for using the current logged in user account
// export const useCurrentUser = createCurrentUserHook(config);