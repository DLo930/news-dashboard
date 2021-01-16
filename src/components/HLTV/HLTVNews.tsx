import React from 'react';
import {
  List,
  Placeholder,
  Loader,
  Panel,
  Icon,
  Grid, Row, Col, Whisper, Tooltip
} from 'rsuite';

const LIMIT = (process.env.NODE_ENV === 'production') ? 10 : 3;

class Entry extends React.Component {
  constructor(props) {
    super(props);
  }

  timeAgo = (date) => {
    var timeElapsed = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (timeElapsed < 60) {
      return `${timeElapsed} second${timeElapsed == 1 ? '' : 's'} ago`;
    }

    timeElapsed = Math.floor(timeElapsed / 60);
    if (timeElapsed < 60) {
      return `${timeElapsed} minute${timeElapsed == 1 ? '' : 's'} ago`;
    }

    timeElapsed = Math.floor(timeElapsed / 60);
    if (timeElapsed < 24) {
      return `${timeElapsed} hour${timeElapsed == 1 ? '' : 's'} ago`;
    }

    timeElapsed = Math.floor(timeElapsed / 24);
    if (timeElapsed < 365) {
      return `${timeElapsed} day${timeElapsed == 1 ? '' : 's'} ago`;
    }

    timeElapsed = Math.floor(timeElapsed / 365);
    return `${timeElapsed} year${timeElapsed == 1 ? '' : 's'} ago`;
  }

  render() {
    const {
      title,
      date,
      link,
      description
    } = this.props;

    return (
      <List.Item>
        <Grid fluid>
          <Row>
            <Col xs={19} md={21}>
              <a href={link} target="_blank">{title}</a>
            </Col>
            <Col xs={4} md={3}>
              <Whisper placement="top" trigger="hover" speaker={<Tooltip>{new Date(date).toLocaleString()}</Tooltip>}>
                <span>{this.timeAgo(date)}</span>
              </Whisper>
            </Col>
          </Row>
          <Row>
            <p>
              <small>{description}</small>
            </p>
          </Row>
        </Grid>
      </List.Item>
    );
  }
}

class HLTVNews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: []
    };
  }

  componentDidMount() {
    fetch('https://hltv-api.vercel.app/api/news')
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("HLTV news");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ stories: data.slice(0, LIMIT) });
      })
      .catch(err => {
        this.props.fetchError("HLTV news", err);
      });
  }

  render() {
    if (this.state.stories.length === 0) {
      return (
        <Placeholder.Paragraph rows={8} active>
          <Loader center speed="fast" size="md" content="Loading" />
        </Placeholder.Paragraph>
      );
    }

    return (
      <Panel header={<b><Icon icon="bell-o" size="lg" />&nbsp;&nbsp;News</b>} collapsible>
        <List bordered hover>
          {this.state.stories.map(story => (
            <Entry {...story} />
          ))}
        </List>
      </Panel>
    );
  }
}

export default HLTVNews;
