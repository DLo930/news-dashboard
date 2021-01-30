import React from 'react';
import {
  Panel,
  Icon
} from 'rsuite';
import NYTHome from './NYTHome';
import NYTPopular from './NYTPopular';
import NYTWorld from './NYTWorld';
import NYTLogo from '../../../assets/nyt.png';

class NYT extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const header = (
      <div>
        <b><img src={NYTLogo} style={{ height: "20px", backgroundColor: "#e9ebf0", padding: "4px" }} />&nbsp;&nbsp;NY Times</b>
      </div>
    );
  
    return (
      <Panel header={header} collapsible defaultExpanded>
        <NYTHome {...this.props} />
        <NYTPopular {...this.props} />
        <NYTWorld {...this.props} />
      </Panel>
    );
  }
}

export default NYT;
