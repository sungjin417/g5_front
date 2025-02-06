import React, { useEffect, useRef } from "react";
import { useAnimate, stagger, motion } from "framer-motion";
import styled from "styled-components";
import {
  IoAtOutline,
  IoChevronDown,
  IoLogOutOutline,
  IoReaderOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const staggerMenuItems = stagger(0.1, { startDelay: 0.15 });

const MenuContainer = styled.nav`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  top: 13px;
  right: 8.5%;
  width: 240px;
  height: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  @media screen and (max-width: 425px) {
    right: 7%;
  }
  @media screen and (max-width: 375px) {
    right: 6%;
  }
`;

const MenuButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 40px;
  height: 50px;
  margin-top: 1.5%;
  background-color: transparent;
  @media screen and (max-width: 430px) {
    justify-content: flex-end;
  }
`;

const ArrowIcon = styled.div`
  transform-origin: 50% 55%;
`;

const MenuList = styled.ul`
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
  margin-top: 11.5%;
  border-radius: 5px;
  padding: 10px;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.5s ease, border 0.5s ease;
  width: 230px;
  height: ${({ isOpen }) => (isOpen ? "200px" : "0px")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
  & > .btnItem {
    cursor: pointer;
  }
`;

const MenuItem = styled.li`
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.3)")};
  filter: ${({ isOpen }) => (isOpen ? "blur(0px)" : "blur(20px)")};
  transition: opacity 0.2s, transform 0.2s, filter 0.2s;
  font-size: 17px;
  height: 50px;
  width: 200px;
  border-radius: 5px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: ${({ theme }) => theme.sideBar};
  }
`;

const useMenuAnimation = (isOpen, refs) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!refs) return;

    const { arrowRef, listRef, itemsRefs } = refs;

    animate(arrowRef.current, { rotate: isOpen ? 180 : 0 }, { duration: 0.2 });

    animate(
      listRef.current,
      {
        clipPath: isOpen
          ? "inset(0% 0% 0% 0% round 5px)"
          : "inset(10% 50% 90% 50% round 5px)",
      },
      {
        type: "spring",
        bounce: 0,
        duration: 0.5,
      }
    );

    itemsRefs.forEach((itemRef, index) => {
      animate(
        itemRef.current,
        isOpen
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.3, filter: "blur(20px)" },
        {
          duration: 0.2,
          delay: isOpen ? staggerMenuItems(index) : 0,
        }
      );
    });
  }, [isOpen, animate, refs]);

  return scope;
};

const UserToggle = ({ isOpen, setIsOpen, email }) => {
  const navigate = useNavigate();
  const arrowRef = useRef(null);
  const listRef = useRef(null);
  const itemsRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const refs = {
    arrowRef,
    listRef,
    itemsRefs,
  };

  const scope = useMenuAnimation(isOpen, refs);

  const handleToggleClick = (path) => {
    setIsOpen(!isOpen);
    if (path) {
      navigate(path);
    }
  };

  const logoutBtnHandler = () => {
    localStorage.clear(); // 모든 로컬 스토리지 데이터 삭제
    navigate("/");
  };

  return (
    <MenuContainer ref={scope}>
      <MenuButton whileTap={{ scale: 1.3 }} onClick={() => setIsOpen(!isOpen)}>
        <ArrowIcon ref={arrowRef}>
          <IoChevronDown size={18} color="#717694" />
        </ArrowIcon>
      </MenuButton>
      <MenuList ref={listRef} isOpen={isOpen}>
        <MenuItem
          onClick={() => handleToggleClick("/evaluation")}
          className="btnItem"
          ref={itemsRefs[0]}
          isOpen={isOpen}
        >
          <IoReaderOutline size={20} color="gray" />
          나의 신용
        </MenuItem>
        <MenuItem ref={itemsRefs[1]} isOpen={isOpen}>
          <IoAtOutline size={20} color="gray" />
          {email}
        </MenuItem>
        <MenuItem
          onClick={() => handleToggleClick("/setting")}
          className="btnItem"
          ref={itemsRefs[2]}
          isOpen={isOpen}
        >
          <IoSettingsOutline size={20} color="gray" />
          설정
        </MenuItem>
        <MenuItem
          ref={itemsRefs[3]}
          isOpen={isOpen}
          className="btnItem"
          onClick={logoutBtnHandler}
        >
          <IoLogOutOutline size={20} color="gray" />
          로그아웃
        </MenuItem>
      </MenuList>
    </MenuContainer>
  );
};

export default UserToggle;
