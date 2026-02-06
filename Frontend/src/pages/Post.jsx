import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostService from "../services/config";
import { Button, Container } from "../component";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  // FETCH POST
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
        console.log("Fetch post error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // AUTHOR CHECK
  const isAuthor =
    post && userData
      ? String(post.author?._id) === String(userData._id)
      : false;

  // DELETE POST
  const deletePost = async () => {
    try {
      await PostService.deletePost(post._id, post.featuredImage?.public_id);
      navigate("/");
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="py-20 text-center text-lg">
        Loading post...
      </div>
    );
  }

  // NOT FOUND
  if (!post) {
    return (
      <div className="py-20 text-center text-lg">
        Post not found
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>

        {/* IMAGE */}
        <div className=" h-full w-fit mb-4 relative border rounded-xl p-2">
          {post.featuredImage?.url && (
            <img
              src={post.featuredImage.url}
              alt={post.title || "Post image"}
              loading="lazy"
              className="rounded-xl w-full object-cover"
            />
          )}

          {/* AUTHOR CONTROLS */}
          {isAuthor && (
            <div className="absolute right-6 top-6 flex gap-3">
              <Link to={`/edit-post/${post._id}`}>
                <Button bgColor="bg-green-500">
                  Edit
                </Button>
              </Link>

              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* TITLE */}
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">
            {post.title || "Untitled"}
          </h1>
        </div>

        {/* CONTENT */}
        <div className="browser-css">
          {parse(post.content || "")}
        </div>

      </Container>
    </div>
  );
}
