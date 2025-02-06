import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
// 알림창이 나타나는 애니메이션
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 알림창이 사라지는 애니메이션
const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const Alarm = styled.div`
  position: fixed;
  width: 250px;
  top: 7.1%;
  right: 1%;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.5s ease, border 0.5s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;

  // 애니메이션 적용
  animation: ${({ isVisible }) => (isVisible ? slideIn : slideOut)} 0.6s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) =>
    isVisible ? "translateY(0)" : "translateY(-20px)"};
`;

const Menu = styled.div`
  width: 95%;
  height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const Title = styled.div`
  width: 100%;
  height: 35px;
  color: ${({ theme }) => theme.color};
  transition: color 0.5s ease;
  font-family: "Poppins-Regular", Helvetica;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 11px;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentsBox = styled(Link)`
  width: 100%;
  padding-left: 7%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  white-space: nowrap;
  text-decoration: none;
  border-radius: 10px;
  margin-top: 2%;
  color: #5a6acf;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.5s ease, border 0.5s ease, height 0.3s ease;
  height: 40px;
  overflow: hidden;

  &:hover {
    height: 105px;
    background-color: ${({ theme }) => theme.sideBar};
    transition: height 0.4s ease;
  }
`;

const NotificationTitle = styled.div`
  font-weight: bold;
`;

const NotificationContents = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.color};
`;

const BtnDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const OkBtn = styled.div`
  width: 60px;
  height: 22px;
  margin-top: 15px;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background};
  color: #5a6acf;
  transition: background-color 0.5s ease;
  text-decoration: none;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;
const LinkBtn = styled.div`
  width: 60px;
  height: 22px;
  margin-top: 15px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background};
  color: #5a6acf;
  transition: background-color 0.5s ease;
  text-decoration: none;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const AlarmBar = ({
  setHasUnreadNotifications,
  toggleAlarmBar,
  hasUnreadNotifications,
  isVisible,
}) => {
  const [notifications, setNotifications] = useState([
    // Example static notifications for testing
    {
      id: 1,
      title: "공지사항 1",
      contents: "첫 번째 공지사항입니다.",
      classTitle: "class1",
    },
    {
      id: 2,
      title: "공지사항 2",
      contents: "두 번째 공지사항입니다.",
      classTitle: "class2",
    },
  ]);
  const [hoveredNotificationId, setHoveredNotificationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set notifications status based on static data
    setHasUnreadNotifications(notifications.length > 0);
  }, [setHasUnreadNotifications]);

  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    setHasUnreadNotifications(updatedNotifications.length > 0);
  };

  const handleNotificationClick = (classTitle, notice, id) => {
    markNotificationAsRead(id);
    navigate(`/announcement/${classTitle}/${notice.id}`, {
      state: { notice },
    });
    toggleAlarmBar();
    window.location.reload();
  };

  const handleOkClick = (id) => {
    markNotificationAsRead(id);
  };

  return (
    <Alarm isVisible={isVisible}>
      <Menu>
        <Title>{hasUnreadNotifications ? "알림" : "알림없음"}</Title>
        {notifications
          .slice()
          .reverse()
          .slice(0, 4)
          .map((notification) => (
            <ContentsBox
              key={notification.id}
              onMouseEnter={() => setHoveredNotificationId(notification.id)}
              onMouseLeave={() => setHoveredNotificationId(null)}
            >
              <NotificationTitle>{notification.title}</NotificationTitle>
              {hoveredNotificationId === notification.id && (
                <>
                  <NotificationContents>
                    {notification.contents}
                  </NotificationContents>
                  <BtnDiv>
                    <OkBtn onClick={() => handleOkClick(notification.id)}>
                      확인
                    </OkBtn>
                    <LinkBtn
                      onClick={() =>
                        handleNotificationClick(
                          notification.classTitle,
                          notification,
                          notification.id
                        )
                      }
                    >
                      이동
                    </LinkBtn>
                  </BtnDiv>
                </>
              )}
            </ContentsBox>
          ))}
      </Menu>
    </Alarm>
  );
};

export default AlarmBar;
