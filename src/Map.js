import React, { Component } from 'react';
import ReactMapboxGl, { GeoJSONLayer, ZoomControl } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZXJpY2tvdGVueW8iLCJhIjoiY2owYXlsb2kxMDAwcjJxcDk3a2Q0MmdpZSJ9.GJQzHfNMElZ7OhW_HbnaXw'
});

class Mapp extends Component {
  onStyleLoad = (m) => {
    this.map = m;
  };
  componentWillReceiveProps(nextProps) {
    if (this.map) {
      if (nextProps.data && nextProps.drawing) {
        this.map.getSource('points').setData(nextProps.data);
      }
      if (!nextProps.data && !nextProps.drawing) {
        this.map
          .getSource('points')
          .setData({ type: 'FeatureCollection', features: [] });
      }
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { handleonDrawCreate, onDrawLoad } = this.props;
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        attributionControl={false}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        center={[37.87978, -0.24197]}
        zoom={[6]}
        onStyleLoad={this.onStyleLoad}
      >
        <GeoJSONLayer
          id="points"
          data={{ type: 'FeatureCollection', features: [] }}
          circlePaint={{
            'circle-color': 'red',
            'circle-radius': 5
          }}
        />

        <ZoomControl />
        <DrawControl
          ref={onDrawLoad}
          displayControlsDefault={false}
          modes={{ draw_rectangle: DrawRectangle }}
          onDrawCreate={handleonDrawCreate}
        />
      </Map>
    );
  }
}

export default Mapp;
