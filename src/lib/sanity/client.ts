import {createClient }  from "@sanity/client"
import imageBuilder from "@sanity/image-url"

// client safe config  
export const config = {
  projectId: "5f0axx7v",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
}; 

export const client = createClient(config);

// Admin level client, used for backend
// admin client for mutations
const adminConfig = {
  ...config,
  token: process.env.SANITY_API_TOKEN ,
};

export const adminClient = createClient(adminConfig);

const builder = imageBuilder(config);
export const urlFor = (source: string) => builder.image(source) 
 