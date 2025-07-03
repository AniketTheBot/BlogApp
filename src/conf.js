const conf = {
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteEndpoint: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCommentsId: String(import.meta.env.VITE_APPWRITE_COMMENTS_ID),
  appwriteLikesId: String(import.meta.env.VITE_APPWRITE_LIKES_ID),
  appwritePostId: String(import.meta.env.VITE_APPWRITE_POST_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  tinymceApiKey: String(import.meta.env.VITE_TINYMCE_API_KEY),
};

export default conf;
