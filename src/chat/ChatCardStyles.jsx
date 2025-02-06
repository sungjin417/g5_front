import styled, { keyframes } from "styled-components";

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 50px 0;
  box-sizing: border-box;
`;

export const CardContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 180px;
  background-color: ${({ isDarkMode }) =>
    isDarkMode ? "#6470bea1" : "rgba(255, 255, 255, 0.9)"};
  border-radius: 15px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(90, 106, 207, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    background-color: ${({ isDarkMode }) =>
      isDarkMode ? "#8299ffbc" : "rgba(255, 255, 255, 1)"};
  }

  @media screen and (max-width: 768px) {
    width: 100%; /* 작은 화면에서는 가로로 꽉 채움 */
    height: 150px; /* 카드 높이 줄임 */
  }

  @media screen and (max-width: 480px) {
    width: 100%; /* 작은 화면에서 가로로 꽉 채움 */
    height: 130px; /* 더 작은 화면에서는 높이 더 줄임 */
  }
`;

export const CardText = styled.div`
  color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000")};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding: 0 15px;

  @media screen and (max-width: 768px) {
    font-size: 16px;
  }

  @media screen and (max-width: 480px) {
    font-size: 14px;
  }
`;
