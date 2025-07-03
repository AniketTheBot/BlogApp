import { Client, Databases, ID, Query } from "appwrite";
import conf from "../conf";

export class LikeService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async likePost({ postId, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesId,
        ID.unique(),
        {
          postId,
          userId,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: likePost :: DETAILED ERROR:", error);
      throw error;
    }
  }

  async getLike({ postId, userId }) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );
      return response.documents[0];
    } catch (error) {
      console.error("Appwrite service :: getLike :: DETAILED ERROR:", error);
      throw error;
    }
  }

  async getLikesCount(postId) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikesId,
        [Query.equal("postId", postId), Query.limit(1)]
      );
      // The 'total' property on the response gives the count of matching documents
      return response.total;
    } catch (error) {
      console.error("Appwrite service :: getLikesCount :: ERROR:", error);
      throw error;
    }
  }

  async unlikePost(likeId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesId,
        likeId 
      );
      return true; 
    } catch (error) {
      console.error("Appwrite service :: unlikePost :: ERROR:", error);
      throw error;
    }
  }

  async getLikedPostsByUser(userId){
    try {
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteLikesId,
            [
                Query.equal("userId", userId)
            ]
        )
    } catch (error) {
      console.error("Appwrite service :: getLikedPostsByUser :: ERROR:", error);
      throw error;
    }
  }
}

const likeService = new LikeService();
export default likeService;
