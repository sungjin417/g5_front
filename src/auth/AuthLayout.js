import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const AuthContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 1.5rem;
  transition: background-color 0.5s ease;

  @media (min-width: 640px) {
    padding: 3rem;
  }
`;

const AuthWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 28rem;
`;

const AuthHeader = styled.h2`
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.color};
  margin-bottom: 2rem;
`;

const AuthContent = styled.div`
  background-color: ${({ theme }) => theme.sideBar};
  padding: 2rem 2.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
`;

const AuthLayout = () => {
  return (
    <AuthContainer>
      <AuthWrapper>
        <AuthHeader>LLM Service</AuthHeader>
        <AuthContent>
          <Outlet />
        </AuthContent>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default AuthLayout;
