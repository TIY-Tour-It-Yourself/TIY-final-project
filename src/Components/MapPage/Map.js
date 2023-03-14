import {
  Map,
  GoogleApiWrapper,
  Marker,
  DirectionsRenderer,
} from "google-maps-react";
import React, { Component } from "react";

const mapStyles = {
  width: "100%",
  height: "100%",
};
class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [
        { lat: 47.49855629475769, lng: -122.14184416996333 },
        { lat: 47.359423, lng: -122.021071 },
        { lat: 47.2052192687988, lng: -121.988426208496 },
        { lat: 47.6307081, lng: -122.1434325 },
        { lat: 47.3084488, lng: -122.2140121 },
        { lat: 47.5524695, lng: -122.0425407 },
      ],
      directions: null,
    };
  }

  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: store.lat,
            lng: store.lng,
          }}
          onClick={(props, marker, e) => this.onMarkerClick(props, marker, e)}
        />
      );
    });
  };
  onMarkerClick = (props, marker, e) => {
    const { google } = this.props;
    const origin = new google.maps.LatLng(47.444, -122.176);
    const destination = marker.getPosition();

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );

    console.log("onMarkerClick called");

    // set the state to null to clear any previous directions
    this.setState({
      directions: null,
    });
  };

  render() {
    const { interest1 } = this.props;
    console.log(interest1);
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176 }}
        >
          {this.displayMarkers()}
          {this.state.directions && (
            <DirectionsRenderer
              directions={this.state.directions}
              map={this.props.google.maps}
            />
          )}
        </Map>

        {/* <p>You selected:</p>
        <ul>
          <li>{interest1}</li>
        </ul> */}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAV-WIlrC-DdcfG3kDWdlRLFN4L5lP7mWI",
})(MapContainer);
