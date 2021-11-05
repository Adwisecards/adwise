import React, {Component} from "react";
import styled from "styled-components";

import backgroundImage from "../../../assets/styles/background.jpg";

const Background = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  display: flex;
  padding-top: 150px;
  padding-bottom: 150px;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
`;

const Main = styled.div``;

class NotFoundLayout extends Component {
    render() {
        return (
            <Background>
                <Main>{this.props.children}</Main>
            </Background>
        );
    }
}

export default NotFoundLayout;
