import styled from "styled-components";

const theme = {
  topnav: {
    bgColor: "#fff",
  },
};

export const Nav = styled.div`
  display: flex;
  margin: 8px;
`;

export const NavItem = styled.div`
  align-items: center;
  background-color: ${theme.topnav.bgColor};
  border-radius: 5px;
  display: inline-flex;
  flex-grow: ${(props) => (props.logo ? 1 : null)};
  margin-left: ${(props) => (!props.logo ? "6px" : null)};
  padding: ${(props) => (!props.logo ? "2px 16px" : null)};
  opacity: 0.75;
`;
export const NavItemIcon = styled.img`
  display: block;
  margin-right: 10px;
`;
export const NavItemText = styled.span``;

export const AdWiseLogo = styled.img`
  display: block;
  padding: 8px;
`;
