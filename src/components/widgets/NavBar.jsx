import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";

import React from "react";

export const NavBar = () => {
  return (
    <Navbar color="light" light expand="sm">
      <NavbarBrand href="/">Awsome Element</NavbarBrand>
      <Nav navbar>
        <NavItem>
          <NavLink href="/emicalculator">EMI calculator</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/emirange">EMI Ranges</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};
