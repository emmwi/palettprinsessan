import styled from "styled-components";
import "@fontsource/italianno";

interface NavUlistProps {
  $isopen: boolean;
}

export const NavUlist = styled.ul<NavUlistProps>`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  background-color: #8ccbc1;

  /* background-image: linear-gradient(
      to right bottom,
      #d16ba5,
      #c777b9,
      #ba83ca,
      #aa8fd8,
      #9a9ae1,
      #8aa7ec,
      #79b3f4,
      #69bff8,
      #52cffe,
      #41dfff,
      #46eefa,
      #5ffbf1
    ); */
  position: fixed;
  transform: ${({ $isopen }) =>
    $isopen ? "translateX(0)" : "translateX(100%)"};
  top: 0;
  right: 0;
  height: 100vh;
  padding-top: 3.5rem;
  transition: transform 0.3s ease-in-out;

  @media screen and (min-width: 480px) {
    list-style: none;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    background-color: transparent;
    position: relative;
    padding: 0;
    transform: none;
    border: #85e7db;
  }
`;
export const Nav = styled.nav`
  width: 100%;
  height: 55px;
  display: flex;
  justify-content: space-between;

  @media screen and (min-width: 480px) {
    flex-direction: row-reverse;

    border-bottom: 2px solid #081a2133;
  }
`;

export const NavList = styled.li`
  font-family: "Italianno", cursive;
  list-style-type: none;
  color: black;
  font-size: 2rem;
  background-color: transparent;
  padding: 19px 10px;

  a {
    text-decoration: none;
    color: black;
    background-color: transparent;
  }
  @media screen and (min-width: 480px) {
    a {
      padding-left: 1em;
    }
  }
`;
