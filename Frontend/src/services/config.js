import conf from "../conf/conf";

class PostService {

  async request(url, options = {}) {
    try {
      const isFormData = options.body instanceof FormData;

      const response = await fetch(url, {
        credentials: "include",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) throw data;

      return data;

    } catch (error) {
      throw error;
    }
  }

  createPost(data) {
    return this.request(`${conf.backendUrl}/api/v1/posts`, {
      method: "POST",
      body: data,
    });
  }

  updatePost(id, data) {
    return this.request(`${conf.backendUrl}/api/v1/posts/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  deletePost(id) {
    return this.request(`${conf.backendUrl}/api/v1/posts/${id}`, {
      method: "DELETE",
    });
  }

  getPost(id) {
    return this.request(`${conf.backendUrl}/api/v1/posts/${id}`);
  }

  getPosts() {
    return this.request(`${conf.backendUrl}/api/v1/posts`);
  }
}

export default new PostService();
