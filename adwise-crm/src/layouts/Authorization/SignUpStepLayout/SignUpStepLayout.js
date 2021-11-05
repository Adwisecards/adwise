import React, { Component } from "react";
import { Steps, Image } from "antd";

import styled from "styled-components";
import lexems from "../../../settings/lexems";

import backgroundImage from "../../../assets/styles/background.jpg";
import markIcon from "../../../assets/mark.svg";

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
const Main = styled.div``;
const Header = styled.header`
  margin-bottom: 10px;
`;
const HeaderTitle = styled.h1`
  color: #25233e;
  font-weight: 400;
  line-height: 120%;
  margin-bottom: 0;
  @media (min-width: 960px) {
    font-size: 40px;
  }
  @media (max-width: 759px) {
    font-size: 24px;
  }
`;

const StyledSteps = styled(Steps)`
  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background-color: #8152e4;
    }
  }

  .ant-steps-item-finish,
  .ant-steps-item-process,
  .ant-steps-item-wait {
    .ant-steps-item-icon {
      background-color: transparent !important;
      border-color: #8152e4;
      border-width: 3px;
      line-height: 182%;
      @media (max-width: 960px) {
        border-width: 2px;
        height: 26px;
        line-height: 140%;
        width: 26px;
      }
      > .ant-steps-icon {
        color: #8152e4;
        font-weight: 600;
        @media (max-width: 960px) {
          font-size: 14px;
        }
      }
    }
  }
  .ant-steps-item-content {
    vertical-align: middle;
    .ant-steps-item-title {
      font-size: 20px;
      @media (max-width: 960px) {
        font-size: 14px;
      }
    }
  }
`;

const steps = [
    {
        title: "Информация о компании",
    },
    {
        title: "Помогите вашему клиенту найти вас",
    },
];

class SignUpStepLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    render() {
        const { current } = this.state;
        return (
            <Background>
                <Container>
                    <Header>
                        <HeaderTitle>{lexems.pages.signUpSteps.title}</HeaderTitle>
                        <StyledSteps current={current}>
                            {steps.map((item, i) => (
                                <Steps.Step key={item.title} title={item.title} />
                            ))}
                        </StyledSteps>
                    </Header>
                    <Window>
                        <Main>{this.props.children}</Main>
                    </Window>
                </Container>
            </Background>
        );
    }
}

export default SignUpStepLayout;
