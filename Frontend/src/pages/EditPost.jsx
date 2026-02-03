import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../component";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();   // <-- ID, not slug
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    appwriteService
      .getPost(id)
      .then((post) => {
        if (post) setPost(post);
        else navigate("/");
      })
      .catch(() => navigate("/"));

  }, [id, navigate]);

  if (!post) return null;

  return (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  );
}

export default EditPost;
