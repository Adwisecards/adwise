import React, { Component } from "react";
import { Image } from "antd";
import styled from "styled-components";
import lexems from "../../settings/lexems";

import backgroundImage from "../../assets/styles/background.jpg";
import imagePeople from "../../assets/sign-up/people.svg";

const Background = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1260px;

  @media (min-width: 1260px) {
    padding: 150px 250px;
  }
  @media (min-width: 960px) and (max-width: 1259px) {
    padding: 100px 100px;
  }
  @media (min-width: 760px) and (max-width: 959px) {
    padding: 100px 100px;
  }
  @media (max-width: 759px) {
    padding: 25px;
  }
`;
const Window = styled.div`
  background: linear-gradient(
    180deg,
    #ffffff 7.52%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  @media (min-width: 960px) {
    padding: 50px;
  }
  @media (max-width: 959px) {
    padding: 15px 20px;
  }
`;
const ImagePeople = styled.img`
  display: block;
  height: 500px;
  @media (min-width: 960px) {
    position: absolute;
    right: -250px;
    top: 0;
  }
`;

const Main = styled.div``;
const Header = styled.header``;
const HeaderTitle = styled.h1`
  color: #25233e;
  line-height: 120%;
  margin-bottom: 0;
  @media (min-width: 960px) {
    font-size: 40px;
  }
  @media (max-width: 759px) {
    font-size: 24px;
  }
`;
const HeaderDescription = styled.div`
  color: #a8abb8;
  @media (min-width: 960px) {
    font-size: 18px;
    margin-top: 20px;
  }
  @media (max-width: 759px) {
    font-size: 14px;
    margin-top: 5px;
  }
`;

class SignUpStartLayout extends Component {
  render() {

    return (
      <Background>
        <Container>
          <Window>
            <ImagePeople src={imagePeople} />
            <Header>
              <HeaderTitle>{this.props.title}</HeaderTitle>
              <HeaderDescription>{this.props.description}</HeaderDescription>
            </Header>
            <Main>{this.props.children}</Main>
          </Window>
        </Container>
      </Background>
    );
  }
}

export default SignUpStartLayout;
