import conf from "../conf/conf";
import { Client, TablesDB, Storage, ID } from "appwrite";
import { login } from "../store/authSlice";
import { Query } from "appwrite";
class Service {
  client = new Client();
  tablesDB;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.tablesDB = new TablesDB(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost(data) {
    return await this.tablesDB.createRow(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      data
    );
  }

  async updatePost(id, data) {
    return await this.tablesDB.updateRow(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id,
      data
    );
  }

  async deletePost(id) {
    return await this.tablesDB.deleteRow(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id
    );
  }

  async getPost(id) {
    return await this.tablesDB.getRow(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id
    );
  }

async getPosts() {
  try {
    const res = await this.tablesDB.listRows(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [
        Query.equal("status", "active") 
      ]
    );
  
    return res.rows; 
  } catch (error) {
    console.log("Appwrite service :: getPosts :: error", error);
    return false;
  }
}
  async uploadFile(file) {
    return await this.storage.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file,
    );
  }

  async deleteFile(fileId) {
    return await this.storage.deleteFile(conf.appwriteBucketId, fileId);
  }
  

  getFilePreview(fileId) {
  if (!fileId) return "";
  //console.log(this.storage.getFileView(conf.appwriteBucketId,fileId));
  
  return this.storage.getFileView(
    conf.appwriteBucketId,
    fileId
  );
}


}

const service = new Service();
export default service;
