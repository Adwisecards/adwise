import React, { Component } from "react";
import styled from "styled-components";
import { LeftCircleOutlined } from "@ant-design/icons";

const Container = styled.div`
    background-color: #C4A2FC;
    border-radius: 5px;
    height: 100vh;
    padding: 80px 140px;
`;

const Popup = styled.div`
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 3px 4px rgba(168, 171, 184, 0.25);
    position: relative;
`;
const GoBack = styled.div`
    position: absolute;
    left: -50px;
`;
const Content = styled.div`
    padding: 48px 64px;
`;

class PagePopup extends Component {
    render() {
        return (
            <Container>
                <Popup>
                    <GoBack><LeftCircleOutlined style={{ fontSize: '32px', color: '#fff', opacity: 0.5 }} /></GoBack>
                    <Content>{this.props.children}</Content>
                </Popup>
            </Container>
        );
    }
}

export default PagePopup;
