import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "antd";
import companyLogo from "../../main/assets/img/logo-example.svg";
import sideNavItems from "../../settings/sidenav";
import { PlusCircleOutlined } from "@ant-design/icons";

import styled from "styled-components";

const Container = styled.div`
  margin-left: 16px;
  // min-width: 300px;
`;
const Header = styled.div`
  display: flex;
  margin-bottom: 30px;
`;
const CompanyLogo = styled.img`
  display: block;
`;
const CompanyName = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 400;
  margin-left: 12px;
`;

class SideNav extends Component {
  _renderSideNavChildItem(item) {
    return (
      <Menu.Item
        key={item.title}
        icon={item.createLink && <PlusCircleOutlined />}
      >
        <NavLink to={item.route || "/"}>{item.title}</NavLink>
      </Menu.Item>
    );
  }

  render() {
    const renderNavItem = this._renderSideNavChildItem;
    return (
      <Container>
        <Header>
          <CompanyLogo src={companyLogo} alt="TODO: get company name" />
          <CompanyName>red tree company</CompanyName>
        </Header>
        <Menu
          onClick={this.handleClick}
          style={{ width: 250 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
        >
          {sideNavItems.nav.map((parent) => (
            <Menu.ItemGroup key={parent.title} title={parent.title}>
              {parent.items &&
                parent.items.map((child) => renderNavItem(child))}
            </Menu.ItemGroup>
          ))}
        </Menu>
      </Container>
    );
  }
}

export default SideNav;
