import React, { Component } from "react";
import styled from "styled-components";
import { withRouter, NavLink } from "react-router-dom";
// import { Heading } from "../../components/ui/UI-grommet";
import pages from "../../settings/pages";
import { Typography, Tabs } from "antd";
import AddressesBlock from "./AddressesBlock";

import AboutForm from "../../forms/information/about/index";
import PhotosForm from "../../forms/information/photos/index";

const { TabPane } = Tabs;
const { Title } = Typography;

class Information extends Component {
  constructor(props) {
    super(props);
    if (!props.tab) {
      this.state = {
        activeTab: 1,
      };
    } else {
      this.state = {
        activeTab:
          ["about", "addresses", "photos"]
            .map((v, i) => ({
              v,
              i,
            }))
            .find((o) => o.v === props.tab).i + 1,
      };
    }
  }

  onChange = (activeKey) => {
    if (activeKey == 1) {
      this.props.history.push("/information/about");
    } else if (activeKey == 2) {
      this.props.history.push("/information/addresses");
    } else if (activeKey == 3) {
      this.props.history.push("/information/photos");
    }
  };

  render() {
    const { title } = pages.information;
    // return <Heading>{title}</Heading>;
    return (
      <>
        <Title>{title}</Title>
        <Tabs
          onChange={this.onChange}
          defaultActiveKey={this.state.activeTab + ""}
          type="card"
        >
          <TabPane tab="О компании" key="1">
            <AboutForm />
          </TabPane>
          <TabPane tab="Адреса" key="2">
            <AddressesBlock />
          </TabPane>
          <TabPane tab="Фотографии" key="3">
            <PhotosForm />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default withRouter(Information);
