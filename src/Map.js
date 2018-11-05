import React, { PureComponent } from "react";
import ReactMapboxGl, { ZoomControl } from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";

import GeoLayer from "./GeojsonLayer";
import FeaturePopup from "./Popup";
import BboxLayer from "./BboxLayer";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoiZXJpY2tvdGVueW8iLCJhIjoiY2owYXlsb2kxMDAwcjJxcDk3a2Q0MmdpZSJ9.GJQzHfNMElZ7OhW_HbnaXw"
});

class Mapp extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { mapReady: false };
	}
	onStyleLoad = (m) => {
		this.map = m;
		this.setState({ mapReady: true });
	};

	render() {
		const { handleonDrawCreate, onDrawLoad } = this.props;
		const { mapReady } = this.state;
		return (
			<Map
				style="mapbox://styles/mapbox/streets-v9"
				attributionControl={false}
				containerStyle={{
					height: "100vh",
					width: "100vw"
				}}
				center={[35.51, -0.09]}
				zoom={[2]}
				onStyleLoad={this.onStyleLoad}
			>
				{mapReady && (
					<React.Fragment>
						<GeoLayer map={this.map} />
						<BboxLayer map={this.map} />
						<FeaturePopup />
						<ZoomControl />
						<DrawControl
							ref={onDrawLoad}
							displayControlsDefault={false}
							modes={{ draw_rectangle: DrawRectangle }}
							onDrawCreate={handleonDrawCreate}
						/>
					</React.Fragment>
				)}
			</Map>
		);
	}
}

export default Mapp;
