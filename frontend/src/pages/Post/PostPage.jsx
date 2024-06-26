import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useCustomNavigate from '../../hooks/useCustomNavigate';
import LikeService from '../../services/like/LikeService';
import ApiError from '../../services/ApiError';
import { ROUTE_PATHS } from '../../constants';
import BookmarkService from '../../services/bookmark/BookmarkService';
import CommentService from '../../services/comment/CommentService';
import { useParams } from 'react-router-dom';
import PostService from '../../services/post/PostService';

function PostPage() {
  const { postId } = useParams();
  const navigate = useCustomNavigate();
  const [post, setPost] = useState();
  const [isLiked, setIsLiked] = useState();
  const [isBookmarked, setIsBookmarked] = useState();
  const [likes, setLikes] = useState();
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState();
  const [comments, setComments] = useState();
  const [commentsData, setCommentsData] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const response = await PostService.getPostById(postId);
      const commentresponse = await CommentService.GetCommentService(postId);
      if (response instanceof ApiError || commentresponse instanceof ApiError) {
        navigate(ROUTE_PATHS.login);
        console.log(response.errorMessage);
      } else {
        setPost(response);
        setIsLiked(response.isLiked);
        setIsBookmarked(response.isBookmarked);
        setLikes(response.likes);
        setCommentsData(commentresponse.comments);
        setComments(commentresponse.comments.length);
      }
      setLoading(false);
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    setLoading(true);
    const response = await LikeService.likePostService(postId);
    if (response instanceof ApiError) {
      navigate(ROUTE_PATHS.login);
      console.log(response.errorMessage);
    } else {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    }
    setLoading(false);
  };

  const handleBookmark = async () => {
    setLoading(true);
    const response = await BookmarkService.BookMarkPost(postId);
    if (response instanceof ApiError) {
      navigate(ROUTE_PATHS.login);
      console.log(response.errorMessage);
    }
    setIsBookmarked(!isBookmarked);
    setLoading(false);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async () => {
    setComments(comments + 1);
    const response = await CommentService.addNewCommentService(
      postId,
      commentText
    );
    if (response instanceof ApiError) {
      navigate(ROUTE_PATHS.login);
      console.log(response.errorMessage);
    }
    setCommentText("");
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex ml-4'>
    <div className="post max-w-lg w-full max-h-lvh bg-white p-6 rounded-lg shadow-md mb-6">
      <div
        className="post-header flex items-center mb-4"
        onClick={() => {
          navigate(`/u?profile=${post.author.account.username}`);
        }}
      >
        <div className="flex items-center">
          <img
            src={post.author.account.avatar.url}
            alt={post.author.name}
            className="w-12 h-12 rounded-full mr-4 cursor-pointer"
          />
          <h2 className="text-lg font-semibold cursor-pointer">
            {post.author.name}
          </h2>
        </div>
        <div className="author-info">
          <p className="text-gray-500 cursor-pointer">
            @{post.author.account.username}
          </p>
        </div>
      </div>
      <div className="cursor-pointer" onClick={()=> {
        navigate(`/post/${post._id}`);
      }}>
        <div className="post-content mb-4">
          <p className="text-gray-700 mb-4">{post.content}</p>
          {post.images.length > 0 && (
            <Slider {...settings} className="post-images">
              {post.images.map((image) => (
                <div key={image._id}>
                  <img
                    src={image.url}
                    alt="Post visual content"
                    className="w-full h-80 rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
        <div className="post-tags mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="tag inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
        </div>
        <div className="post-footer flex items-center justify-between">
          <div className="actions flex items-center">
            <button
              onClick={handleLike}
              className={`like-button flex items-center ${
                isLiked ? "text-red-500" : "text-gray-500"
              } mr-4`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.63 3.937 1.707 5.485l2.293-2.194z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 010-5.656A4.002 4.002 0 017.778.11a4.001 4.001 0 014.22 3.863h.001a4.001 4.001 0 014.219 3.866 4.002 4.002 0 01.605 5.063l-6.325 7.017a.75.75 0 01-1.087.003l-6.334-7.003a4.002 4.002 0 01.164-5.742zm9.716 1.757a2.5 2.5 0 00-3.535 0L10 7.293l-.353-.364a2.5 2.5 0 00-3.535 0 2.5 2.5 0 000 3.535L10 15.414l4.536-4.536a2.5 2.5 0 000-3.535z" />
                </svg>
              )}
              {likes}
            </button>
            <button
              onClick={() => {}}
              className="comment-button flex items-center text-gray-500 mr-4"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M18 10c0 3.866-3.582 7-8 7H6.882L2 18.586V10C2 6.134 5.582 3 10 3s8 3.134 8 7zM5 10h10v1H5v-1z" />
              </svg>
              {comments ? comments : 0}
            </button>
            <button
              onClick={handleBookmark}
              className={`bookmark-button flex items-center ${
                isBookmarked ? "text-yellow-500" : "text-gray-500"
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-1 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 
                        7 0 014 12H0c0 2.042.63 3.937 1.707 5.485l2.293-2.194z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 2a2 2 0 00-2 2v13.586a1 1 0 001.707.707L10 13.414l5.293 5.293A1 1 0 0017 17.586V4a2 2 0 00-2-2H5z" />
                </svg>
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
          <div className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      
      <div className="comment-section mt-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={handleCommentChange}
          className="comment-input border border-gray-300 px-4 py-2 rounded-lg mr-2"
        />
        <button
          onClick={handleCommentSubmit}
          className="comment-submit bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
    <div className='ml-6'>
      <h1 className="text-lg font-semibold">Comments</h1>
      {commentsData.map((comment) => (
        <div
          key={comment.author.account._id}
          className="flex items-center mt-3 mb-3  cursor-pointer"
          onClick={() => {
            navigate(`/u?profile=${comment.author.account.username}`);
          }}
        >
          <img
            src={comment.author.account.avatar.url}
            className="w-7 h-7 rounded-full mr-3"
          />
          <span className='text-green-600'>@{comment.author.account.username}</span>: {comment.content}
        </div>
      ))}
    </div>
    </div>
  )
}

export default PostPage