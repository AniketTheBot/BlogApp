import { Client, Databases, Storage, ID, Query } from "appwrite";
import conf from "../conf";

export class PostService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ slug, title, featuredImage, content, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        ID.unique(),
        {
          title,
          featuredImage,
          content,
          status,
          slug,
          userId,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: createPost :: DETAILED ERROR:", error); // <<< THIS IS THE KEY LOG
      throw error;
    }
  }

  async updatePost(postId, { slug, title, featuredImage, content, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        postId,
        {
          slug,
          title,
          featuredImage,
          content,
          status,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: updatePost :: ERROR:", error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        postId
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost :: ERROR:", error);
      return false;
    }
  }

  async getPost(postId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        postId
      );
    } catch (error) {
      console.error("Appwrite service :: getPost :: ERROR:", error);
      return null;
    }
  }

  async listPosts(queries = [Query.equal("status", true)]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        queries
      );
    } catch (error) {
      console.error("Appwrite service :: listPosts :: ERROR:", error);
      return { documents: [] };
    }
  }

  async getPostBySlug(slug) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        [Query.equal("slug", slug)]
      );

      return response.documents[0];
    } catch (error) {
      console.error("Appwrite service :: getPostBySlug :: ERROR:", error);
      return null;
    }
  }

  async listPostsByUser(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePostId,
        [
          Query.equal("userId", userId), // <-- THE MISSING QUERY!
        ]
      );
    } catch (error) {
      console.error("Appwrite service :: listPosts :: ERROR:", error);
      return { documents: [] };
    }
  }
}

const postService = new PostService();
export default postService;
