import React, { useEffect, useState } from "react";
import PostService from "../services/config";
import { Container, PostCard } from "../component";
import { useSelector } from "react-redux";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // Wait until auth is fully hydrated
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

        // Filter only current user's posts
        const userPosts = fetchedPosts.filter(
          (post) => String(post.author?._id) === String(userData._id)
        );

        setPosts(userPosts);
      } catch (err) {
        console.log("My Post fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authStatus, userData?._id]);

  // Not logged in
  if (!authStatus) {
    return (
      <div className="w-full py-8 mt-4 text-center">
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
      <div className="w-full py-8 text-center">
        <Container>
          <h1 className="text-xl font-semibold">
            Loading your posts...
          </h1>
        </Container>
      </div>
    );
  }

  // No posts
  if (!posts.length) {
    return (
      <div className="w-full py-8 text-center">
        <Container>
          <h1 className="text-2xl font-bold">
            You haven’t created any posts yet
          </h1>
        </Container>
      </div>
    );
  }

  // Render posts
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
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

export default MyPosts;
