import React from 'react';
import {
  Navbar,
  FlexboxGrid,
  Dropdown,
  Row, Col, Icon
} from 'rsuite';
import THLogo from '../../assets/icon.png';

class Topbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      city: null,
      state: null,
      temperature: null,
      aqi: null
    }
  }

  componentDidMount() {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${process.env.REACT_APP_AIRVISUAL_API_KEY}`)
      .then(res => {
        if (!res.ok) {
          this.props.badResponse("AirVisual");
        }
        return res.json();
      })
      .then(data => {
        if (data.status !== "success") {
          this.props.badResponse(`AirVisual: ${data.data.message}`);
        }

        const json = data.data;
        this.setState({
          city: json.city,
          state: json.state,
          temperature: Math.round(json.current.weather.tp * 9.0/5 + 32),
          aqi: json.current.pollution.aqius
        });
      })
      .catch(err => {
        console.log(`AirVisual: ${err}`);
      });
  }

  aqiColor = (aqi) => {
    if (aqi <= 50) {
      return "#4caf50";
    } else if (aqi <= 100) {
      return "yellow";
    } else if (aqi <= 150) {
      return "orange";
    } else if (aqi <= 200) {
      return "red";
    } else if (aqi <= 300) {
      return "violet";
    } else {
      return "maroon";
    }
  }

  render() {
    const date = (new Date()).toDateString();

    const {
      city,
      state,
      temperature,
      aqi
    } = this.state;

    const weatherDropdown = (city) ? (
      <Dropdown
        icon={<Icon icon="sun-o" size="lg" style={{
          color: "gold"
        }}/>}
        placement="bottomEnd"
      >
        <Dropdown.Item>
          {`${city}, ${state}`}
        </Dropdown.Item>
        <Dropdown.Item>
          {temperature}°F
        </Dropdown.Item>
        <Dropdown.Item>
          AQI: <span style={{ color: this.aqiColor(aqi) }}>{aqi}</span>
        </Dropdown.Item>
      </Dropdown>
    ) : (
      <Dropdown
        icon={<Icon icon="sun-o" size="lg" style={{
          color: "gold"
        }}/>}
        placement="bottomEnd"
        disabled
      ></Dropdown>
    );

    return (
      <Navbar>
        <Row>
          <Col xs={10} xsOffset={7}>
            <FlexboxGrid align="middle" justify="center" style={{ padding: "0.5vh 0" }}>
              <FlexboxGrid.Item>
                <h2><img src={THLogo} style={{ height: "1em", marginBottom: "0.25em", marginRight: "0.25em" }} /></h2>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <Navbar.Header>
                  <h2>Today's Headlines ({date})</h2>
                </Navbar.Header>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
          <Col xs={2} xsOffset={5}>
            <FlexboxGrid align="middle" justify="end">
              <FlexboxGrid.Item>
                {weatherDropdown}
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
        </Row>
        
      </Navbar>
    );
  }
}

export default Topbar;