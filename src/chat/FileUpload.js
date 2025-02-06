import React, { useState } from 'react';
import styled from 'styled-components';
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

const UploadContainer = styled.div`
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

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  margin: 20px 0;
  cursor: pointer;

  &:hover {
    border-color: #007bff;
  }
`;

const FileInput = styled.input`
  display: none;
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

const FileUpload = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <UploadContainer onClick={(e) => e.stopPropagation()}>
        <BackButton onClick={onClose}>
          <FaArrowLeft /> 뒤로가기
        </BackButton>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          혈액 검사 파일 업로드
        </h2>
        <FileInput
          type="file"
          id="fileInput"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleFileSelect}
        />
        <UploadArea onClick={() => document.getElementById('fileInput').click()}>
          {selectedFile ? selectedFile.name : '파일을 선택하거나 드래그하세요'}
        </UploadArea>
        <Button onClick={handleUpload} disabled={!selectedFile}>
          업로드
        </Button>
      </UploadContainer>
    </ModalOverlay>
  );
};

export default FileUpload; 