import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #fff;
  border: 1px solid rgba(168, 171, 184, 0.3);
  border-radius: 5px;
  box-shadow: none;
  margin-bottom: 25px;
  margin-right: 25px;
  width: calc(300px - 25px);
`;
const Header = styled.div``;
const Content = styled.div`
  margin: 16px;
`;

class Card extends Component {
  render() {
    return (
      <Container>
        <Header>{this.props.header}</Header>
        <Content>{this.props.children}</Content>
      </Container>
    );
  }
}

export default Card;
