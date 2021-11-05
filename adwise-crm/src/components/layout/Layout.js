import React, { Component } from "react";
import styled from "styled-components";
import TopNav from "../topnav/TopNav";
import SideNav from "../sidenav/SideNav";
import backgroundImage from "../../assets/styles/background.jpg";

const Background = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
`;

const Container = styled.div``;
const MainContainer = styled.div`
  display: flex;
`;
const Main = styled.div`
  background-color: #fff;
  border-radius: 10px;
  margin: 10px;
  margin-top: 0;
  padding: 40px;
  width: 1200px;
  @media (max-width: 1500px) {
    width: 960px;
  }
  @media (max-width: 1200px) {
    width: 760px;
  }
`;

class Layout extends Component {
  render() {
    return (
      <Background>
        <Container>
          <TopNav />
          <MainContainer>
            <SideNav />
            <Main>{this.props.children}</Main>
          </MainContainer>
        </Container>
      </Background>
    );
  }
}

export default Layout;
