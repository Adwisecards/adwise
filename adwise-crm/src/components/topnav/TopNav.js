import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import icons from "../../settings/icons.atlas";
import topNavItems from "../../settings/topnav";

import { Nav, NavItem, NavItemIcon, NavItemText, AdWiseLogo } from "./styles";

class TopNav extends Component {
  render() {
    return (
      <Nav>
        <NavItem logo>
          <AdWiseLogo src={icons.topnav.logo} />
        </NavItem>
        {topNavItems.map((item) => (
          <NavItem>
            <NavItemIcon src={item.icon} />
            {item.title && <NavItemText>{item.title}</NavItemText>}
          </NavItem>
        ))}
      </Nav>
    );
  }
}

export default TopNav;
