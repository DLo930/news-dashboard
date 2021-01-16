import React from 'react';
import {
  FlexboxGrid,
  Icon
} from 'rsuite';

export default function Lowbar() {
  return (
    <FlexboxGrid align="middle" justify="center" style={{ marginTop: "1vh" }}>
      <FlexboxGrid.Item>
        Made with&nbsp;&nbsp;<Icon icon="heart-o" style={{ color: "dodgerblue" }} />&nbsp;&nbsp;in New York
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
