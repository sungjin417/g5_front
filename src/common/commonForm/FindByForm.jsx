import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../img/loginImg/findPageLogoImg.png";
import { useEffect, useState } from "react";
import FindByLeft from "./FindByLeft";

const LoginPage = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 610px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  @media screen and (max-width: 610px) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const LeftDiv = styled.div`
  width: 42.6%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media screen and (max-width: 610px) {
    display: none;
  }
  @media screen and (max-width: 610px) {
    display: flex;
    width: 100%;
    height: 20%;
  }
`;

const SinLogo = styled.div`
  background-image: url(${logo});
  /* background-color: #92d0e9; */
  background-size: contain; /* 또는 cover로 설정 */
  width: 90%;
  height: 60%;
  background-repeat: no-repeat;
  cursor: pointer; /* 마우스 오버 시 손가락 모양 커서 */
  @media screen and (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
  @media screen and (max-width: 610px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const LogoDiv = styled.div`
  width: 100%;
  height: 30%;
  /* background-color: #5dcaca; */
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 768px) {
    width: 90%;
    height: 91%;
    justify-content: flex-start;
    align-items: flex-start;
  }
  @media screen and (max-width: 610px) {
    justify-content: center;
    align-items: center;
  }
`;
const TextBox = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: start;
  @media screen and (max-width: 768px) {
    position: fixed;
    width: 350px;
    height: 650px;
    bottom: 20px;
    left: 20px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: #f5f5f5;
  }
  @media screen and (max-width: 610px) {
    display: none;
  }
`;

const PwText = styled.div`
  color: gray;
  font-size: 30px;
  width: 80%;
  height: 25%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1200px) {
    font-size: 25px;
  }
  @media screen and (max-width: 610px) {
    display: none;
  }
`;
const Detail = styled.div`
  color: gray;
  font-size: 23px;
  width: 80%;
  height: auto;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: start;
  flex-direction: column;
  font-weight: lighter;
  line-height: 1.5;
  @media screen and (max-width: 1200px) {
    font-size: 19px;
  }
  @media screen and (max-width: 610px) {
    display: none;
  }
`;
const PwDetail = styled.div`
  color: gray;
  font-size: 25px;
  width: 80%;
  height: auto;
  align-items: center;
  justify-content: center;
  display: flex;
  text-align: start;
  flex-direction: column;
  font-weight: lighter;
  line-height: 1.5;
  @media screen and (max-width: 1200px) {
    font-size: 21px;
  }
  @media screen and (max-width: 610px) {
    display: none;
  }
`;
const ExitText = styled.div`
  color: gray;
  font-size: 30px;
  width: 80%;
  height: 20%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1200px) {
    font-size: 25px;
  }
  @media screen and (max-width: 610px) {
    display: none;
  }
`;

const IdText = styled.div`
  color: gray;
  font-size: 30px;
  width: 80%;
  height: 25%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1200px) {
    font-size: 25px;
  }
  @media screen and (max-width: 610px) {
    display: none;
  }
`;

const Rectangle = styled.div`
  background-color: #2ecc71;
  border-top-left-radius: 38px;
  border-bottom-left-radius: 38px;
  box-shadow: 0px 4px 20px 5px #00000040;
  left: calc(42.6%);
  width: 57.4%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  @media screen and (max-width: 1200px) {
    min-width: 500px;
  }
  @media screen and (max-width: 610px) {
    width: 100%;
    min-width: 300px;
    height: 80%;
    border-radius: 38px 38px 0 0;
  }
`;

const FindByForm = ({ withdrawal }) => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const onClickLogo = (withdrawal) => {
    if (withdrawal) {
      navigate("/mainpage");
    } else {
      navigate("/");
    }
  };

  // 사이드바의 가시성을 토글하는 함수
  const toggleSideBar = () => {
    setIsSideBarVisible(!isSideBarVisible);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 마운트될 때 한 번 체크
    handleResize();

    // 컴포넌트가 언마운트될 때 리사이즈 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 화면 크기 변화에 따라 사이드바를 숨기거나 보이게 설정하는 함수
  const handleResize = () => {
    if (window.innerWidth < 769) {
      setIsSideBarVisible(false);
    }
    if (window.innerWidth < 501) {
      setIsSideBarVisible(true);
    } else {
      setIsSideBarVisible(true);
    }
  };

  return (
    <LoginPage>
      <Background>
        {isSideBarVisible && (
          <FindByLeft toggleSideBar={toggleSideBar} withdrawal={withdrawal} />
        )}
        <Rectangle>
          <Outlet />
        </Rectangle>
      </Background>
    </LoginPage>
  );
};

export default FindByForm;
