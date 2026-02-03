import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            }
            return userAccount;
        } catch (error) {
            console.error("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // Appwrite 14+ uses createEmailPasswordSession
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.error("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            // If it's a 401, it just means no one is logged in. 
            // We return null so the frontend knows to show the login page.
            if (error.code !== 401) {
                console.log("Appwrite service :: getCurrentUser :: error ", error);
            }
        }
        return null;
    }

    async logout() {
        try {
            // Deletes the current session
            await this.account.deleteSession('current');
        } catch (error) {
            console.log("Appwrite service :: logout :: error ", error);
        }
    }
}

const authService = new AuthService();
export default authService;