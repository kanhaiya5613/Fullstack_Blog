

import React, { useEffect, useState } from "react";
import PostService from "../services/config";
import { Container, PostCard } from "../component";
import { useSelector } from "react-redux";

function myPosts() {
  const [posts, setPosts] = useState([]);

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostService.getPosts();

        const fetchedPosts =
          response?.data?.data ||
          response?.data?.posts ||
          response?.data ||
          [];

        
        const userPosts = fetchedPosts.filter(
          (post) => String(post.author?._id) === String(userData?._id)
        );

        setPosts(userPosts);
      } catch (err) {
        console.log("My Post fetch error:", err);
      }
    };

    if (authStatus && userData?._id) {
      fetchPosts();
    }
  }, [authStatus, userData]);

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

  if (!posts.length) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold">
            You haven’t created any posts yet
          </h1>
        </Container>
      </div>
    );
  }

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

export default myPosts;
