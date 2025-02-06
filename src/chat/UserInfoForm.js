import React, { useState } from "react";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #007bff;

  &:hover {
    color: #0056b3;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const UserInfoForm = ({ onSubmit, onClose }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    gender: "",
    phoneNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(userInfo);
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <BackButton onClick={onClose}>
          <FaArrowLeft /> 뒤로가기
        </BackButton>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          사용자 정보 입력
        </h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="이름"
            value={userInfo.name}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="age"
            placeholder="나이"
            value={userInfo.age}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="gender"
            placeholder="성별"
            value={userInfo.gender}
            onChange={handleChange}
          />
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="전화번호"
            value={userInfo.phoneNumber}
            onChange={handleChange}
          />
          <Button type="submit">제출</Button>
        </Form>
      </FormContainer>
    </ModalOverlay>
  );
};

export default UserInfoForm;
