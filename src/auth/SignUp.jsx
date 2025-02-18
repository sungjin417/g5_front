import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SignUpContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 40px;
  background-color: ${({ theme }) => theme.sideBar};
  border-radius: 10px;
  z-index: 1000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 300px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #5a6acf;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #4a59b0;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 5px 0;
`;

const SignUp = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 기존 사용자 데이터 확인
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // ID 중복 체크
    if (existingUsers.some((user) => user.id === formData.id)) {
      setError("중복 ID입니다. ID를 다시 입력해주세요.");
      return;
    }

    // 새 사용자 추가
    const newUser = {
      id: formData.id,
      password: formData.password,
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // 자동 로그인 처리
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("회원가입이 완료되었습니다.");
    navigate("/");
  };

  return (
    <SignUpContainer>
      <Form onSubmit={handleSubmit}>
        <h2>회원가입</h2>
        <Input
          type="text"
          name="id"
          placeholder="아이디"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">회원가입</Button>
        <Button type="button" onClick={onClose}>
          취소
        </Button>
      </Form>
    </SignUpContainer>
  );
};

export default SignUp;
