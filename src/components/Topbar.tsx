import React from 'react';
import {
  Navbar,
  FlexboxGrid
} from 'rsuite';
import THLogo from '../../assets/icon.png';

export default function Topbar() {
  const date = (new Date()).toDateString();

  return (
    <Navbar>
      <FlexboxGrid align="middle" justify="center" style={{ padding: "0.5vh 0" }}>
        <FlexboxGrid.Item>
          <h2><img src={THLogo} style={{ height: "1em", marginBottom: "0.25em", marginRight: "0.25em" }} /></h2>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <Navbar.Header>
            <h2>Today's Headlines ({date})</h2>
          </Navbar.Header>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Navbar>
  );
}