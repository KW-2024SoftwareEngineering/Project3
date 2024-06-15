import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MarketIndexes.css'; // 스타일 파일 추가

function Home() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false); // 정답 여부를 확인하여 True/False 버튼 숨기기 위한 상태

  const [indexes, setIndexes] = useState({ kospi: null, kosdaq: null, kospi200: null });

  useEffect(() => {
    fetchMarketIndexes();
  }, []);

  const fetchMarketIndexes = async () => {
    try {
      const kospiResponse = await axios.get('/api/market-index', { params: { FID_INPUT_ISCD: '0001' } });
      const kosdaqResponse = await axios.get('/api/market-index', { params: { FID_INPUT_ISCD: '1001' } });
      const kospi200Response = await axios.get('/api/market-index', { params: { FID_INPUT_ISCD: '2001' } });
      setIndexes({
        kospi: kospiResponse.data,
        kosdaq: kosdaqResponse.data,
        kospi200: kospi200Response.data
      });
    } catch (error) {
      console.error('Failed to fetch market indexes', error);
    }
  };

  const renderIndex = (indexData, name) => {
    if (!indexData) {
      return <p>Loading...</p>;
    }

    return (
        <div className="market-index">
          <div className="market-index-header">
            <span>{name}</span>
          </div>
          <div className="market-index-value">
            <h2>{indexData.bstp_nmix_prpr}</h2>
          </div>
          <div className="market-index-change">
          <span className={indexData.prdy_vrss_sign === '2' ? 'up' : 'down'}>
            {indexData.prdy_vrss_sign === '2' ? '▲' : '▼'} {indexData.bstp_nmix_prdy_vrss}
          </span>
            <span>({indexData.bstp_nmix_prdy_ctrt}%)</span>
          </div>
        </div>
    );
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/quiz');
        if (response.ok) {
          const data = await response.json();
          setQuizData(data);
        } else {
          console.error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleOptionClick = (optionText) => {
    setSelectedOption(optionText);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setSelectedAnswer(null);
    setAnswered(false); // 다음 퀴즈로 넘어갈 때 정답 여부 상태 초기화
    setCurrentQuizIndex((prevIndex) => (prevIndex + 1) % quizData.length);
  };

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    setAnswered(true); // 정답 선택 시 정답 여부 상태 업데이트
  };

  const currentQuiz = quizData[currentQuizIndex];

  const stocks = [
    { name: '삼성전자', price: '70,000', change: '▲1.9', color: 'red' },
    { name: 'SK하이닉스', price: '120,000', change: '▲2.3', color: 'red' },
    { name: '네이버', price: '350,000', change: '▲1.5', color: 'red' },
    { name: '카카오', price: '140,000', change: '▼0.9', color: 'blue' },
    { name: 'LG화학', price: '820,000', change: '▲3.8', color: 'red' },
  ];

  return (
      <main>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            className="ReactModal__Content"
            overlayClassName="ReactModal__Overlay"
        >
          <div className="modal-header">
            <button className="modal-close" onClick={() => setModalIsOpen(false)}>x</button>
          </div>
          <section>
            <div className="quiz-container">
              <b><h1>오늘의 퀴즈</h1></b>
              <div>
                {currentQuiz && (
                    <div>
                      <h3><b>{currentQuiz.question}</b></h3>
                      {/* True/False 버튼 */}
                      {!answered && (
                          <div className="answer-selection">
                            <button className="true-btn" onClick={() => handleAnswerSelection(true)}>O</button>
                            <span className="button-space"></span>
                            <button className="false-btn" onClick={() => handleAnswerSelection(false)}>X</button>
                          </div>
                      )}
                      {/* 선택한 답변에 따른 피드백 */}
                      {answered && (
                          <div className="answer-feedback">
                            {selectedAnswer === (currentQuiz.answer === "true") ? (
                                <div className="correct"><br />정답입니다!<br />{currentQuiz.userID}</div>
                            ) : (
                                <div className="incorrect"><br />오답입니다!<br />{currentQuiz.userID}</div>
                            )}
                          </div>
                      )}
                      {/* 퀴즈 넘기기 버튼 */}
                      {answered && (
                          <button className="reset-button" onClick={handleNextQuiz}>다음 퀴즈</button>
                      )}
                    </div>
                )}
              </div>
            </div>
          </section>
        </Modal>

        <section className="market-indices">
          <h2>KOSPI, KOSDAQ & KOSPI200</h2>
          <div className="market-indexes">
            {renderIndex(indexes.kospi)}
            {renderIndex(indexes.kosdaq)}
            {renderIndex(indexes.kospi200)}
          </div>
        </section>

        <section className="home-page">
          <div className="popular-stocks">
            <div className="popular-header">
              <h2>인기 주식 종목</h2>
              <a title="더보기"><Link to="/market">더보기</Link></a>
            </div>
            <table className="stock-table">
              <thead>
              <tr>
                <th>종목명</th>
                <th>가격</th>
                <th>변동률</th>
              </tr>
              </thead>
              <tbody>
              {stocks.map(stock => (
                  <tr key={stock.name}>
                    <td>{stock.name}</td>
                    <td>{stock.price}</td>
                    <td style={{ color: stock.color }}>{stock.change}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
  );
}

export default Home;