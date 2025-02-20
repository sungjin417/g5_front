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
  box-sizing: border-box;
`;

export const CardContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 100px;
  background-color: ${({ theme }) => theme.commponent};
  border-radius: 15px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px ${({ theme }) => theme.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px ${({ theme }) => theme.shadow};
    background-color: ${({ theme }) => theme.sideCheck};
  }

  @media screen and (max-width: 768px) {
    width: 100%; /* 작은 화면에서는 가로로 꽉 채움 */
    height: 150px; /* 카드 높이 줄임 */
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    height: 130px;
  }
`;

export const CardText = styled.div`
  color: ${({ theme }) => theme.color};
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
