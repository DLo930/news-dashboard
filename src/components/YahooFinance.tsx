import React from 'react';
import {
  List,
  Placeholder,
  Loader,
  Panel,
  Tag,
  Grid, Row, Col, Whisper, Tooltip
} from 'rsuite';
import YahooLogo from '../../assets/yahoo.gif';

const LIMIT = (process.env.NODE_ENV === 'production') ? 15 : 3;

class YahooFinance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: []
    };
  }

  componentDidMount() {
    fetch("https://yahoo-finance15.p.rapidapi.com/api/yahoo/ne/news", {
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com"
      }
    })
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("Yahoo Finance");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ stories: data.slice(0, LIMIT) });
      })
      .catch(err => {
        this.props.fetchError("Yahoo Finance", err);
      });
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
    if (this.state.stories.length === 0) {
      return (
        <Placeholder.Paragraph rows={8} active>
          <Loader center speed="fast" size="md" content="Loading" />
        </Placeholder.Paragraph>
      );
    }

    const header = (
      <div>
        <b><img src={YahooLogo} style={{ height: "20px" }} />&nbsp;&nbsp;Yahoo Finance</b>
      </div>
    );

    return (
      <Panel header={header} collapsible>
        <List bordered hover>
          {this.state.stories.map(story => (
            <List.Item>
              <Grid fluid>
                <Row>
                  <Col xs={18} md={20}>
                    <a href={story.link} target="_blank">{story.title}</a>&nbsp;&nbsp;&nbsp;
                    <Tag>{story.source}</Tag>
                  </Col>
                  <Col xs={3} xsOffset={3} md={2} mdOffset={2}>
                    <Whisper placement="top" trigger="hover" speaker={<Tooltip>{new Date(story.pubDate).toLocaleString()}</Tooltip>}>
                      <span>{this.timeAgo(story.pubDate)}</span>
                    </Whisper>
                  </Col>
                </Row>
              </Grid>
            </List.Item>
          ))}
        </List>
      </Panel>
    );
  }
}

export default YahooFinance;