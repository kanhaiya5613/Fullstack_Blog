import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../component";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    appwriteService
      .getPost(id)
      .then((data) => {
        if (data) setPost(data);
        else navigate("/");
      })
      .catch(() => navigate("/"));
  }, [id, navigate]);
  //console.log(post);
  
  const deletePost = async () => {
  try {
    await appwriteService.deletePost(post.$id);
    await appwriteService.deleteFile(post.featuredImage);
    navigate("/");
  } catch (err) {
    console.log("Delete error:", err);
  }
};


  if (!post) return null;
  
  return (
    <div className="py-8">
      <Container>
        <div className="w-full h-screen flex justify-center mb-4 relative border rounded-xl p-2">
          
          {post?.featuredImage && (
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title || "Post image"}
              loading="lazy"
              className="rounded-xl"
            />
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>

              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">
            {post.title || "Untitled"}
          </h1>
        </div>

        <div className="browser-css">
          {parse(post.content || "")}
        </div>
      </Container>
    </div>
  );
}
