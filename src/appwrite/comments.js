import { Client, Databases, ID, Query } from "appwrite";
import conf from "../conf";

export class CommentService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
  }

  async createComment({ text, userId, postId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsId,
        ID.unique(),
        {
          text,
          userId,
          postId,
        }
      );
    } catch (error) {
      console.error(
        "Appwrite service :: createComment :: DETAILED ERROR:",
        error
      ); 
      throw error;
    }
  }

  async getComments(postId) {
    try {
      await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsId,
        [Query.equal("postId", postId), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error(
        "Appwrite service :: getComments :: DETAILED ERROR:",
        error
      ); 
      throw error;
    }
  }

  async updateComment(commentId, { text }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsId,
        commentId,
        {
          text,
        }
      );
    } catch (error) {
      console.error(
        "Appwrite service :: updateComment :: DETAILED ERROR:",
        error
      ); 
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentsId,
        commentId
      );
    } catch (error) {
      console.error(
        "Appwrite service :: deleteComment :: DETAILED ERROR:",
        error
      ); 
      throw error;
    }
  }
}

const commentService = new CommentService();
export default commentService;
