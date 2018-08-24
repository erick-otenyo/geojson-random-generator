import React, { Component } from 'react';
import turfRandom from 'turf-random';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import geojsonExtent from 'geojson-extent';
import fileDownload from 'js-file-download';
import Mapp from './Map';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: null,
      bbox: null,
      num: 100,
      drawing: false
    };
  }
  onDrawLoad = (d) => {
    this.drawControl = d;
    this.setState({ drawButton: true });
  };
  generateGeojson = (bbox) => {
    const geojson = turfRandom('points', this.state.num, {
      bbox: bbox
    });
    this.setState({ geojson: geojson });
  };
  handleonDrawCreate = ({ features }) => {
    const feature = features[0];
    const bbox = geojsonExtent(feature);
    this.generateGeojson(bbox);
    this.drawControl.draw.deleteAll();
    this.setState({ drawing: !this.state.drawing });
  };
  handleDrawButtonClick = (e) => {
    if (!this.state.drawing) {
      this.setState({ geojson: null });
      this.drawControl.draw.changeMode('draw_rectangle');
    } else {
      this.drawControl.draw.changeMode('simple_select');
    }
    this.setState({ drawing: !this.state.drawing });
  };

  handleDownloadClick = () => {
    fileDownload(JSON.stringify(this.state.geojson), 'data.geojson');
  };
  handleonStyleLoad = (m) => {};
  onClear = () => {
    this.setState({ geojson: null });
  };
  onNumChange = (e) => {
    this.setState({ num: e.target.value });
  };
  render() {
    return (
      <div>
        {this.state.drawButton && (
          <div style={{ position: 'fixed', zIndex: '9999', margin: 5 }}>
            <p
              style={{
                margin: 0,
                marginTop: 5,
                fontSize: 14,
                fontWeight: 'bold',
                padding: 0,
                paddingLeft: 5
              }}
            >
              Number of Points
            </p>
            <input
              type="number"
              value={this.state.num}
              onChange={this.onNumChange}
              placeholder="Num of points"
            />
            <button
              style={{
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: 4,
                color: 'white',
                padding: 10,
                textAlign: 'center',
                display: 'inline-block',
                cursor: 'pointer',
                fontSize: 14
              }}
              onClick={this.handleDrawButtonClick}
            >
              {this.state.drawing ? 'Cancel' : 'Draw Extent'}
            </button>
            <div style={{ padding: 10 }}>
              {this.state.geojson && (
                <button
                  style={{
                    backgroundColor: '#C9302C',
                    border: 'none',
                    borderRadius: 4,
                    color: 'white',
                    padding: 10,
                    textAlign: 'center',
                    display: 'inline-block',
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                  onClick={this.onClear}
                >
                  Clear
                </button>
              )}
            </div>
            <p
              style={{
                margin: 0,
                marginTop: 5,
                fontSize: 14,
                fontWeight: 'bold',
                padding: 0,
                paddingLeft: 5
              }}
            >
              {this.state.drawing &&
                'Click on map and Move mouse to draw a rectangular extent'}
            </p>
          </div>
        )}
        <div
          style={{
            position: 'fixed',
            zIndex: '9999',
            padding: '20px',
            right: '20px',
            bottom: '20px'
          }}
        >
          {this.state.geojson && (
            <button
              style={{
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: 4,
                color: 'white',
                padding: 10,
                textAlign: 'center',
                display: 'inline-block',
                fontSize: 14,
                cursor: 'pointer'
              }}
              onClick={this.handleDownloadClick}
            >
              Download
            </button>
          )}
        </div>
        <Mapp
          data={this.state.geojson}
          drawing={this.state.drawing}
          handleonStyleLoad={this.handleonStyleLoad}
          handleonDrawCreate={this.handleonDrawCreate}
          onDrawLoad={this.onDrawLoad}
        />
      </div>
    );
  }
}

export default App;
