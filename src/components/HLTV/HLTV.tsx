import React from 'react';
import {
  Panel,
  Icon
} from 'rsuite';
import HLTVNews from './HLTVNews';
import HLTVMatches from './HLTVMatches';
import HLTVLogo from '../../../assets/hltv.png';

class HLTV extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const header = (
      <div>
        <b><img src={HLTVLogo} style={{ height: "20px" }} />&nbsp;&nbsp;HLTV</b>
      </div>
    );
  
    return (
      <Panel header={header} collapsible>
        <HLTVNews {...this.props} />
        <HLTVMatches {...this.props} />
      </Panel>
    );
  }
}

export default HLTV;
