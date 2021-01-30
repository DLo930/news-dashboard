import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import {
  Container,
  Header,
  Content,
  Footer,
  PanelGroup,
  Alert
} from 'rsuite';

import Topbar from './components/Topbar';
import HackerNews from './components/HackerNews';
import NYT from './components/NYT/NYT';
import Lowbar from './components/Lowbar';

const ALERT_LEN = 3000;

const badResponse = (apiName) => {
  const msg = `Bad response from ${apiName} API`;
  Alert.warning(msg, ALERT_LEN);
  throw new Error(msg);
}

const fetchError = (apiName, err) => {
  const msg = `There was a problem fetching ${apiName} data`;
  Alert.error(msg, ALERT_LEN);
  console.error(msg, err);
}

const Root = () => {
  return (
    <Container>
      <Header>
        <Topbar />
      </Header>
      <Content>
        <PanelGroup accordion>
          <HackerNews badResponse={badResponse} fetchError={fetchError} />
          <NYT badResponse={badResponse} fetchError={fetchError} />
        </PanelGroup>
      </Content>
      <Footer>
        <Lowbar />
      </Footer>
    </Container>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Root} />
      </Switch>
    </Router>
  );
}
