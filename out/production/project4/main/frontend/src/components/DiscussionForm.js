import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function DiscussionForm() {
  const { boardId } = useParams();
  const [title, setTitle] = useState('');
  // const [boardType, setBoardType] = useState('종목1');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [boardType, setBoardType] = useState('');

  const [content, setContent] = useState('');
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    if (boardId) {
      const fetchBoard = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/board/${boardId}`);
          const { title, board_type, content } = response.data;
          setTitle(title);
          setBoardType(board_type);
          setContent(content);
        } catch (error) {
          console.error('Error fetching board data', error);
        }
      };
      fetchBoard();
    }
  }, [boardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (boardId) {
        await axios.post(`http://localhost:8080/api/board/${boardId}`, {
          title,
          board_type: boardType,
          content,
          viewCount,
          likeCount,
        });
      } else {
        await axios.post(`http://localhost:8080/api/board`, {
          title,
          board_type: boardType,
          content,
        });
      }
      navigate('/post');
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  // 추가
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!boardType.trim()) {
      setError('Stock name is required.');
      return;
    }
    try {
      const result = await axios.get(`/api/getStockInfo`, {
        params: { item_name: boardType }
      });
      setResponse(result.data.items);
      setError(null);
    } catch (error) {
      setError(error.message);
      setResponse([]);
    }
  };

  const handleItemSelect = (item) => {
    setBoardType(item.itmsNm);
    setResponse([]);
  };

  return (
    <main>
      <section className="discussion">
        <h2>Discussion Board</h2>
        <form onSubmit={handleSubmit}>
          <div className="title">
            <label>제목을 입력</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="stock-type">
            <label>종목 선택</label>
            <input
              type="text"
              name="board_type"
              value={boardType}
              onChange={(e) => setBoardType(e.target.value)}
              placeholder="Enter stock name"
              required
            />
            <button type="button" onClick={handleSearch}>검색</button>
            {error && <div className="error-message">Error: {error}</div>}
            {response.length > 0 && (
              <div className="stock-info-list">
                {response.map((item) => (
                  <div key={item.srtnCd} className="stock-card" onClick={() => handleItemSelect(item)}>
                    <h2 className="stock-name">{item.itmsNm}</h2>
                    <p className="stock-details">
                      <span className="stock-code">{item.srtnCd}</span> |
                      <span className="stock-category">{item.mrktCtg}</span> |
                      <span className="stock-rank">{item.data_rank}</span> |
                      <span className="stock-corp-name">{item.corpNm}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
            {/* <select
              name="board_type"
              value={boardType}
              onChange={(e) => setBoardType(e.target.value)}
              required
            >
              <option value="종목1">종목1</option>
              <option value="종목2">종목2</option>
              <option value="종목3">종목3</option>
            </select> */}

          <div className="content">
            <label>내용 입력</label>
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">등록하기</button>
        </form>
      </section>
    </main>
  );
}

export default DiscussionForm;
