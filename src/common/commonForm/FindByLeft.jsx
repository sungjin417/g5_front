import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../img/loginImg/findPageLogoImg.png";

const LeftDiv = styled.div`
  width: 42.6%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
    width: 100px;
    height: 100px;
  }
  @media screen and (max-width: 610px) {
    width: 150px;
    height: 150px;
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
    display: none;
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

const FindByLeft = ({ withdrawal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClickLogo = (withdrawal) => {
    if (withdrawal) {
      navigate("/mainpage");
    } else {
      navigate("/");
    }
  };

  return (
    <LeftDiv>
      <LogoDiv>
        <SinLogo
          onClick={() => {
            onClickLogo(withdrawal);
          }}
        />
      </LogoDiv>
      {location.pathname === "/findbypwd" ||
      location.pathname === "/resetpwd" ? ( // 경로에 따라 조건부 렌더링
        <TextBox>
          <PwText>비밀번호 찾기</PwText>
          <PwDetail>
            1. 비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자, 특수문자를
            포함해야 합니다.
          </PwDetail>
          <PwDetail>
            2. 새 비밀번호를 한 번 더 입력하여 확인해 주세요. '비밀번호 변경'
            버튼을 클릭하면 재설정이 완료됩니다.
          </PwDetail>
          <PwDetail>
            주의: 안전한 비밀번호를 사용하시고, 다른 사이트와 동일한 비밀번호를
            사용하지 마세요.
          </PwDetail>
        </TextBox>
      ) : location.pathname === "/findbyemail" ? ( // 다른 경로에 따라 다른 콘텐츠 표시
        <TextBox>
          <IdText>아이디 찾기</IdText>
          <Detail>보안을 위해 이메일의 일부가 숨겨져 표시됩니다.</Detail>
        </TextBox>
      ) : location.pathname === "/withdrawal" ? ( // 다른 경로에 따라 다른 콘텐츠 표시
        <TextBox>
          <ExitText>회원탈퇴</ExitText>
          <Detail>
            회원탈퇴 절차를 시작하려면 이메일 인증이 필요합니다.
            <br /> 귀하의 이메일 주소로 인증번호가 전송되었습니다.
            <br /> 이메일을 확인하시고 인증번호를 입력하여 탈퇴 절차를 완료해
            주시기 바랍니다. <br />이 과정은 귀하의 계정안전을 보장하고,
            무단으로 탈퇴가 이루어지지 않도록 하기 위한 중요한 단계입니다.{" "}
            <br />
            이메일을 찾을 수 없거나 추가적인 도움이 필요하시면 언제든지 지원팀에
            문의해 주세요.
          </Detail>
        </TextBox>
      ) : null}
    </LeftDiv>
  );
};

export default FindByLeft;
