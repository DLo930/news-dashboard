import React from 'react';
import {
  Panel,
  Icon,
  FlexboxGrid, Col
} from 'rsuite';

const LIMIT = (process.env.NODE_ENV === "production") ? 12 : 7;

class WSJ extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: []
    };
  }

  componentDidMount() {
    fetch(`https://newsapi.org/v2/top-headlines?sources=the-wall-street-journal&apiKey=${process.env.REACT_APP_NEWSAPI_KEY}`)
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("NewsAPI");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ stories: data.articles.slice(0, LIMIT) });
      })
      .catch(err => {
        this.props.fetchError("NewsAPI", err);
      });
  }

  getThumbnail = (story) => {
    return (
      <img src={story.urlToImage} style={{ width: "100%" }} />
    );
  }

  render() {
    const header = (
      <div>
        <b><Icon icon="newspaper-o" size="lg" />&nbsp;&nbsp;Wall Street Journal</b>
      </div>
    );

    return (
      <Panel header={header} collapsible>
        <FlexboxGrid>
          {this.state.stories.map(story => (
            <FlexboxGrid.Item componentClass={Col} colspan={24} sm={8} md={4} style={{ margin: "0 0 1vh 0" }}>
              <Panel shaded bordered bodyFill>
                {this.getThumbnail(story)}
                <Panel header={<a href={story.url} target="_blank">{story.title}</a>}>
                  <p>
                    <small>{story.description}</small>
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

export default WSJ;
