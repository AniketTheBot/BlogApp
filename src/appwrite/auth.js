import conf from "../conf";

import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteEndpoint)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      return userAccount;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      console.log(`AuthService: Attempting login for ${email}`); // Add this log
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log("AuthService: Login API call successful, session:", session); // Add this log
      return session;
    } catch (appwriteError) {
      // Catch the specific error from Appwrite
      // LOG THE DETAILED APPWRITE ERROR OBJECT
      console.error(
        "AuthService :: Appwrite Login API Error :: details:",
        appwriteError
      );
      console.error(
        "AuthService :: Appwrite Login API Error :: message:",
        appwriteError.message
      );
      console.error(
        "AuthService :: Appwrite Login API Error :: code:",
        appwriteError.code
      );
      console.error(
        "AuthService :: Appwrite Login API Error :: type:",
        appwriteError.type
      );

      // You can still throw your generic error, or re-throw the appwriteError,
      // or throw a new error with more info.
      // For now, let's keep throwing your generic one so the thunk handles it as before,
      // but the console will have the details.
      throw new Error("Login Error (see console for Appwrite details)");
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      throw new Error("User not authenticated");
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions("current");
    } catch (error) {
      throw new Error("Logout Error");
    }
  }

  async updateName(name) {
    try {
      // Updates the 'name' property of the currently logged-in user
      return await this.account.updateName(name);
    } catch (error) {
      console.error("AuthService :: updateName :: ERROR", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
