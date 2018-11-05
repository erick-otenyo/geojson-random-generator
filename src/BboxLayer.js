import React, { Component } from "react";
import { GeoJSONLayer } from "react-mapbox-gl";
import { connect } from "react-redux";

class BboxLayer extends Component {
	componentDidUpdate() {
		if (this.props.bboxPolygon) {
			this.props.map.getSource("bbox").setData(this.props.bboxPolygon);
		} else {
			this.props.map
				.getSource("bbox")
				.setData({ type: "FeatureCollection", features: [] });
		}
	}
	render() {
		return (
			<GeoJSONLayer
				id="bbox"
				data={{ type: "FeatureCollection", features: [] }}
				linePaint={{
					"line-color": "#353866",
					"line-width": 2
				}}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		bboxPolygon: state.map.bboxPolygon
	};
};

export default connect(mapStateToProps)(BboxLayer);
