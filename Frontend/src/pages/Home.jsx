import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../component";
import PostService from "../services/config.js";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostService.getPosts();

        // IMPORTANT FIX
        const postList =
          response?.data?.data ||
          response?.data?.posts ||
          response?.data ||
          [];

        setPosts(postList);
      } catch (error) {
        console.log("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 text-center text-lg">
        Loading posts...
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="w-full py-20 text-center text-lg">
        No posts available
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap p-2">
          {posts.map((post) => (
            <div
              key={post._id}
              className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;