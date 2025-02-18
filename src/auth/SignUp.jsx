import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #5a67ba;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #4a55a2;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
`;

const SignUp = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 비밀번호 확인
    if (formData.password !== formData.password2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        "http://54.180.252.205:8009/api/account/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(Object.values(data).flat().join(" "));
      }

      // 회원가입 성공
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      onClose(); // 모달 닫기
      navigate("/login"); // 로그인 페이지로 이동
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SignUpContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="사용자 이름"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
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
          name="password2"
          placeholder="비밀번호 확인"
          value={formData.password2}
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
