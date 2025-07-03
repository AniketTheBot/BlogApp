import { Client, Storage, ID, Permission, Role } from "appwrite";
import conf from "../conf";

export class StorageService {
  client = new Client();
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId);
    this.bucket = new Storage(this.client);
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()), // Grant read access to ANYONE
        ]
      );
    } catch (error) {
      console.error("Appwrite service :: uploadFile :: ERROR:", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteFile :: ERROR:", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if (!fileId) return null;
    try {
      return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        0,
        0,
        "center",
        100
      );
    } catch (error) {
      console.error("Appwrite service :: getFilePreview :: ERROR:", error);
      return null;
    }
  }
}

const storageService = new StorageService();
export default storageService;
