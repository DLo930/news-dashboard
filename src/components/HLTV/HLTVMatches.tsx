import React from 'react';
import {
  List,
  Placeholder,
  Loader,
  Panel,
  Icon,
  Grid, Row, Col,
  Message,
  Whisper,
  Tooltip,
  Tag
} from 'rsuite';
import MatchLogo from '../../../assets/duel.png';

const LIMIT = (process.env.NODE_ENV === 'production') ? 10 : 3;
const NO_LOGO_URL = "https://static.hltv.org/images/team/logo/0";

class Entry extends React.Component {
  constructor(props) {
    super(props);
  }

  timeTil = (date) => {
    var timeElapsed = Math.floor((new Date(date).getTime() - new Date().getTime()) / 1000);
    
    if (timeElapsed < 60) {
      return `in ${timeElapsed} second${timeElapsed == 1 ? '' : 's'}`;
    }

    timeElapsed = Math.floor(timeElapsed / 60);
    if (timeElapsed < 60) {
      return `in ${timeElapsed} minute${timeElapsed == 1 ? '' : 's'}`;
    }

    timeElapsed = Math.floor(timeElapsed / 60);
    if (timeElapsed < 24) {
      return `in ${timeElapsed} hour${timeElapsed == 1 ? '' : 's'}`;
    }

    timeElapsed = Math.floor(timeElapsed / 24);
    if (timeElapsed < 365) {
      return `in ${timeElapsed} day${timeElapsed == 1 ? '' : 's'}`;
    }

    timeElapsed = Math.floor(timeElapsed / 365);
    return `in ${timeElapsed} year${timeElapsed == 1 ? '' : 's'}`;
  }

  render() {
    const {
      link,
      time,
      event,
      stars,
      teams
    } = this.props;

    if (event.name === "") {
      return null;
    }

    const tier = [];
    for (var i = 0; i < stars; i++) {
      tier.push(<Icon icon="star-o" style={{ color: "gold" }} />);
    }

    return (
      <List.Item>
        <Grid fluid>
          <Row>
            <Col xs={6}>
              <a href={`https://hltv.org${link}`} target="_blank">
                <Tag>
                  <Whisper placement="top" trigger="hover" speaker={<Tooltip>{teams[0].name}</Tooltip>}>
                    <img src={teams[0].crest || NO_LOGO_URL} height="25" />
                  </Whisper>
                  &nbsp;&nbsp;vs&nbsp;&nbsp;
                  <Whisper placement="top" trigger="hover" speaker={<Tooltip>{teams[1].name}</Tooltip>}>
                    <img src={teams[1].crest || NO_LOGO_URL} height="25" />
                  </Whisper>
                </Tag>
              </a>
            </Col>
            <Col xs={10} md={8}>
              <img src={event.crest || NO_LOGO_URL} height="15" />&nbsp;{event.name}
            </Col>
            <Col xs={4} xsOffset={1} md={3} mdOffset={5}>
              <Whisper placement="top" trigger="hover" speaker={<Tooltip>{new Date(time).toLocaleString()}</Tooltip>}>
                <span>{this.timeTil(time)}</span>
              </Whisper>
            </Col>
            <Col xs={3} md={2}>
              {tier}
            </Col>
          </Row>
        </Grid>
      </List.Item>
    );
  }
}

class HLTVMatches extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      matches: null
    };
  }

  componentDidMount() {
    fetch('https://hltv-api.vercel.app/api/matches')
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("HLTV matches");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ matches: data.filter(match => match.stars > 1).slice(0, LIMIT) });
      })
      .catch(err => {
        this.props.fetchError("HLTV matches", err);
      });
  }

  render() {
    if (!this.state.matches) {
      return (
        <Placeholder.Paragraph rows={8} active>
          <Loader center speed="fast" size="md" content="Loading" />
        </Placeholder.Paragraph>
      );
    }

    if (this.state.matches.length === 0) {
      return (
        <Message type="info" description="There are no upcoming top tier matches" />
      )
    }

    return (
      <Panel header={<b><img src={MatchLogo} style={{ height: "20px", backgroundColor: "#e9ebf0" }} />&nbsp;&nbsp;Matches</b>} collapsible>
        <List bordered hover>
          {this.state.matches.map(match => (
            <Entry {...match} />
          ))}
        </List>
      </Panel>
    );
  }
}

export default HLTVMatches;
