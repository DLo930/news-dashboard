import React from 'react';
import {
  Panel,
  Tag,
  Icon,
  FlexboxGrid, Col, Whisper, Tooltip
} from 'rsuite';

const LIMIT = (process.env.NODE_ENV === "development") ? 7 : 12;

class NYTPopular extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: []
    };
  }

  componentDidMount() {
    fetch(`https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${process.env.REACT_APP_NYT_API_KEY}`)
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("NYT");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ stories: data.results.slice(0, LIMIT) });
      })
      .catch(err => {
        this.props.fetchError("NYT", err);
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

  getThumbnail = (story) => {
    if (!(story && story.media)) {
      return null;
    }

    for (var i = 0; i < story.media.length; i++) {
      if (!story.media[i]["media-metadata"]) {
        continue;
      }

      for (const img of story.media[i]["media-metadata"]) {
        if (img.format === "mediumThreeByTwo210") {
          return (
            <img src={img.url} alt={story.media[0].caption} style={{ width: "100%" }} />
          );
        }
      }
    }

    return null;
  }

  getStoryHeader = (story) => {
    return (
      <div>
        <a href={story.url} target="_blank">{story.title}</a>&nbsp;&nbsp;<Tag>{story.section + ((story.subsection === "") ? "" : `: ${story.subsection}`)}</Tag><br />
        <Whisper placement="top" trigger="hover" speaker={<Tooltip>{new Date(story.published_date).toLocaleDateString()}</Tooltip>}>
          <small style={{ color: "#a4a9b3" }}>{this.timeAgo(story.published_date)}</small>
        </Whisper>
      </div>
    )
  }

  render() {
    const header = (
      <div>
        <b><Icon icon="twinkle-star" size="lg" style={{ color: "gold" }} />&nbsp;&nbsp;Popular</b>
      </div>
    );

    return (
      <Panel header={header} collapsible>
        <FlexboxGrid>
          {this.state.stories.map(story => (
            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={8} md={6} lg={4} style={{ margin: "0 0 1vh 0" }}>
              <Panel shaded bordered bodyFill>
                {this.getThumbnail(story)}
                <Panel header={this.getStoryHeader(story)}>
                  <p>
                    <small>{story.abstract}</small>
                  </p>
                </Panel>
              </Panel>
            </FlexboxGrid.Item>
          ))}
        </FlexboxGrid>
      </Panel>
    );
  }
}

export default NYTPopular;