import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function BoardDetail() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/boards/${boardId}`);
        setBoard(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchComments = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/boards/${boardId}/comments`);
            setComments(response.data);
          } catch (error) {
            console.error('Error fetching comments', error);
          }
        };

    fetchBoard();
    fetchComments();
  }, [boardId]);

  const handleDelete = async () => {
    try {
      await axios.post(`http://localhost:8080/api/boards/${boardId}/delete`);
      navigate('/post'); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error('Error deleting board', error);
    }
  };

  const handleEdit = () => {
    navigate(`/discussionform/${boardId}`); // 수정 페이지로 이동
  };

  const handleLike = async () => {
      try {
        await axios.post(`http://localhost:8080/api/boards/${boardId}/like`);
        // 공감 처리 후 보드 정보 다시 불러오기
        const response = await axios.get(`http://localhost:8080/api/boards/${boardId}/like`);
        setBoard(response.data);
      } catch (error) {
        console.error('Error updating like count', error);
      }
    };

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`http://localhost:8080/api/boards/${boardId}/comments`, { content: newComment, userId: 'guest' }); // using 'guest' as a placeholder
    setNewComment('');
    const response = await axios.get(`http://localhost:8080/api/boards/${boardId}/comments`);
    setComments(response.data);
  } catch (error) {
    console.error('Error adding comment', error);
  }
};

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {board ? (
        <div>
          <h2>{board.title}</h2>
          <p>{board.content}</p>
          <p>작성자: {board.user_id}</p>
          <p>작성일: {new Date(board.create_at).toLocaleDateString()}</p>
          <p>조회수: {board.viewCount}</p>
          <p>좋아요: {board.likeCount}</p>
          <button onClick={handleDelete}>삭제</button>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleLike}>공감</button>
          <div>
                      <h3>Comments</h3>
                      <ul>
                        {comments.map(comment => (
                          <li key={comment.id}>
                            <p>{comment.content}</p>
                            <p>작성자: {comment.userId}</p>
                            <p>작성일: {new Date(comment.createAt).toLocaleDateString()}</p>
                          </li>
                        ))}
                      </ul>
                      <form onSubmit={handleCommentSubmit}>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment"
                          required
                        />
                        <button type="submit">댓글 등록</button>
                      </form>
                    </div>
        </div>
      ) : (
        <p>No board data</p>
      )}
    </div>
  );
}

export default BoardDetail;