import React, { Component } from "react";
import { GeoJSONLayer } from "react-mapbox-gl";
import { connect } from "react-redux";

import { ACTIONS } from "./reducers";

class GeoLayer extends Component {
	handleOnHover = (cursor) => {
		this.props.map.getCanvas().style.cursor = cursor;
	};
	componentDidUpdate() {
		if (this.props.data) {
			this.props.map.getSource("points").setData(this.props.data);
		} else {
			this.props.map
				.getSource("points")
				.setData({ type: "FeatureCollection", features: [] });
		}
	}
	render() {
		return (
			<GeoJSONLayer
				id="points"
				data={{ type: "FeatureCollection", features: [] }}
				circlePaint={{
					"circle-color": "#353866",
					"circle-radius": 7
				}}
				circleOnClick={this.props.onFeatureClick}
				circleOnMouseEnter={this.handleOnHover.bind(this, "pointer")}
				circleOnMouseLeave={this.handleOnHover.bind(this, "")}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		data: state.map.data
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onFeatureClick: (e) => {
			const feature = e.features[0];
			dispatch({ type: ACTIONS.FEATURE_CLICKED, feature: feature });
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GeoLayer);
