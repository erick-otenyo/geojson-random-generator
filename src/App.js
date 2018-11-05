import React, { Component } from "react";
import { connect } from "react-redux";
import turfRandom from "turf-random";
import geojsonExtent from "geojson-extent";
import fileDownload from "js-file-download";
import faker from "faker";

import Mapp from "./Map";
import PropertiesForm from "./Form";
import { ACTIONS } from "./reducers";

import "./App.css";

class App extends Component {
	onDrawLoad = (d) => {
		this.drawControl = d;
		this.props.setProperty("drawReady", true);
	};
	generateGeojson = (bbox, properties) => {
		const geojson = turfRandom("points", this.props.num, {
			bbox: bbox
		});

		geojson.features.forEach((feature) => {
			const featureProperties = {};
			properties.forEach((property) => {
				featureProperties[property.title] = faker[property.module][
					property.property
				]();
			});

			feature.properties = featureProperties;
		});

		return geojson;
	};
	handleonDrawCreate = ({ features }) => {
		const feature = features[0];
		const bbox = geojsonExtent(feature);
		this.props.setProperty("bboxPolygon", feature);
		this.props.setExtents(bbox);
		this.drawControl.draw.deleteAll();
	};
	handleDrawButtonClick = (e) => {
		if (!this.props.drawing) {
			this.drawControl.draw.changeMode("draw_rectangle");
		} else {
			this.drawControl.draw.changeMode("simple_select");
			this.drawControl.draw.deleteAll();
			this.props.reset();
		}
		this.props.setProperty("drawing", !this.props.drawing);
	};

	handleGeojsonCreate = (values) => {
		this.props.setProperty("clickedFeature", null);
		const { properties } = values;
		const { bbox } = this.props;
		const geojsonData = this.generateGeojson(bbox, properties || []);

		this.props.setData(geojsonData);
	};

	handleDownloadClick = () => {
		fileDownload(JSON.stringify(this.props.data), "data.geojson");
	};
	onClear = () => {
		this.drawControl.draw.deleteAll();
		this.props.reset();
	};
	onNumChange = (e) => {
		this.props.setPointsNum(e.target.value);
	};
	render() {
		const { drawing, drawReady, data, num } = this.props;
		return (
			<React.Fragment>
				{drawReady && (
					<div className="wrapper">
						<div>
							<p
								style={{
									margin: 0,
									marginTop: 5,
									fontSize: 14,
									fontWeight: "bold",
									padding: 0,
									paddingLeft: 5
								}}
							>
								Number of Points
							</p>
							<input
								type="number"
								value={num}
								onChange={this.onNumChange}
								placeholder="Num of points"
							/>
							<button
								className="button primary"
								onClick={this.handleDrawButtonClick}
							>
								{drawing ? "Cancel" : "Draw Extent"}
							</button>
							{data && data.features.length ? (
								<button className="button danger" onClick={this.onClear}>
									Clear
								</button>
							) : null}
						</div>
						<PropertiesForm
							onCreate={this.handleGeojsonCreate}
							handleDownload={this.handleDownloadClick}
						/>
					</div>
				)}
				<div
					style={{
						position: "fixed",
						zIndex: "9999",
						padding: "20px",
						right: "20px",
						bottom: "20px"
					}}
				/>
				<Mapp
					handleonDrawCreate={this.handleonDrawCreate}
					onDrawLoad={this.onDrawLoad}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		data: state.map.data,
		num: state.map.num,
		bbox: state.map.bbox,
		drawing: state.map.drawing,
		drawReady: state.map.drawReady
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setExtents: (bbox) => {
			dispatch({ type: ACTIONS.SET_EXTENTS, bbox: bbox });
		},
		setData: (data) => {
			dispatch({ type: ACTIONS.SET_DATA, data: data });
		},
		setPointsNum: (num) => {
			dispatch({ type: ACTIONS.SET_POINTS_NUM, num: num });
		},
		setProperty: (property, value) => {
			dispatch({
				type: ACTIONS.SET_PROPERTY,
				property: property,
				value: value
			});
		},
		reset: () => {
			dispatch({ type: ACTIONS.RESET });
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
