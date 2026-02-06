import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../component";
import PostService from "../services/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await PostService.getPost(id);

        const fetchedPost =
          response?.data?.data ||
          response?.data?.post ||
          response?.data;

        if (!fetchedPost) {
          navigate("/");
          return;
        }

        setPost(fetchedPost);
      } catch (err) {
        console.log("Edit fetch error:", err);
        navigate("/");
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (!post) {
    return (
      <div className="py-20 text-center text-lg">
        Loading post...
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  );
}

export default EditPost;
