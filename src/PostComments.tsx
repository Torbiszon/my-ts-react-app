import React, { useState, useEffect } from 'react';
import './PostComments.css';

interface Comment {
  id: number;
  name: string;
  body: string;
  email: string;
}

interface PostCommentsProps {
  postId: number;
  onClose: () => void;
  loggedInUser: { id: number; email: string } | null;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId, onClose, loggedInUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', body: '', email: '' });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments`, {
        method: 'POST',
        body: JSON.stringify({
          postId: postId,
          name: newComment.name,
          body: newComment.body,
          email: loggedInUser?.email || '',
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add a new comment');
      }

      const newCommentData: Comment = await response.json();

      setComments([...comments, newCommentData]);

      setNewComment({ name: '', body: '', email: loggedInUser?.email || '' });
    } catch (error) {
      console.error('Error adding a new comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the comment');
      }

      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting the comment:', error);
    }
  };

  return (
    <div className="comments-modal">
      <div className="comments-content">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <h2>Comments</h2>
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.name}</strong>
              <p>{comment.body}</p>
              <span className="email">{comment.email}</span>
              {loggedInUser && loggedInUser.email === comment.email && (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
        {loggedInUser && (
          <div className="add-comment-section">
            <h3>Add Comment</h3>
            <input
              type="text"
              placeholder="Header"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            />
            <textarea
              placeholder="Body"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />

            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComments;
