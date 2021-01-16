import React from 'react';
import {
  List,
  Placeholder,
  Loader,
  Panel,
  Tag,
  Icon,
  Badge,
  Grid, Row, Col, Whisper, Tooltip
} from 'rsuite';

const LIMIT = (process.env.NODE_ENV === 'production') ? 25 : 3;

class Entry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      time: 0,
      score: 0,
      comments: 0,
      url: ""
    };
  }

  componentDidMount() {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${this.props.id}.json`)
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("HackerNews");
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          title: data.title,
          time: data.time,
          score: data.score,
          comments: data.descendants,
          url: data.url
        });
      })
      .catch(err => {
        this.props.fetchError("HackerNews", err);
      });
  }

  timeAgo = (t) => {
    var timeElapsed = Math.floor(new Date().getTime() / 1000) - t;
    
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
      time,
      score,
      comments,
      url
    } = this.state;

    if (!time) {
      return (
        <List.Item>
          <Placeholder.Paragraph>
            <Loader center speed="fast" content="Loading" />
          </Placeholder.Paragraph>
        </List.Item>
      );
    }

    if (score < 80 || comments < 25) {
      return null;
    }

    return (
      <List.Item>
        <Grid fluid>
          <Row>
            <Col xs={18} md={20} lg={20}>
              <a href={url} target="_blank">{title}</a>
            </Col>
            <Col xs={3} md={2} lg={2}>
              <Whisper placement="top" trigger="hover" speaker={<Tooltip>{new Date(time).toLocaleTimeString()}</Tooltip>}>
                <span>{this.timeAgo(time)}</span>
              </Whisper>
            </Col>
            <Col xs={1}>
              <Tag color="green">{score}</Tag>
            </Col>
            <Col xs={1} xsOffset={1} mdOffset={0} lgOffset={0}>
              <Badge content={comments} maxCount={999}>
                <Icon icon="comments" size="lg" />
              </Badge>
            </Col>
          </Row>
        </Grid>
      </List.Item>
    );
  }
}

class HackerNews extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: []
    };
  }

  componentDidMount() {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("HackerNews");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ stories: data.slice(0, LIMIT) });
      })
      .catch(err => {
        this.props.fetchError("HackerNews", err);
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
      <Panel header={
        <b>
          <Icon
            icon="yc"
            size="lg"
            style={{
              color: "#ff6600",
              backgroundColor: "white",
              lineHeight: "0.8em"
            }}
          />
          &nbsp;&nbsp;Hacker News
        </b>
      } collapsible defaultExpanded>
        <List bordered hover>
          {this.state.stories.map(id => (
            <Entry {...this.props} id={id} />
          ))}
        </List>
      </Panel>
    );
  }
}

export default HackerNews;