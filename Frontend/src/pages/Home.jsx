import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../component";
import PostService from "../services/config.js";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Wait until auth is ready
    if (!authStatus || !userData?._id) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await PostService.getPosts();

        const fetchedPosts =
          response?.data?.data ||
          response?.data?.posts ||
          response?.data ||
          [];

        const userPosts = fetchedPosts
        //console.log(userPosts)
        setPosts(userPosts);
      } catch (err) {
        console.log("Home Post fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authStatus, userData?._id]);

  // Not logged in
  if (!authStatus) {
    return (
      <div className="w-full py-8 text-center">
        <Container>
          <h1 className="text-2xl font-bold">
            Login to read your posts
          </h1>
        </Container>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="w-full py-20 text-center text-lg">
        Loading posts...
      </div>
    );
  }

  // No posts
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