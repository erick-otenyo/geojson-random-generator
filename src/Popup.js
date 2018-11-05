import React from "react";
import { Popup } from "react-mapbox-gl";
import { connect } from "react-redux";

const FeaturePopup = (props) => {
	const { clickedFeature } = props;
	if (clickedFeature) {
		const properties = Object.keys(clickedFeature.properties);
		return (
			<Popup coordinates={clickedFeature.geometry.coordinates}>
				<table>
					<tbody>
						{properties.length ? (
							properties.map((property) => (
								<tr>
									<th>{property}</th>
									<td>{clickedFeature.properties[property]}</td>
								</tr>
							))
						) : (
							<p>No Properties</p>
						)}
					</tbody>
				</table>
			</Popup>
		);
	}
	return null;
};

const mapStateToProps = (state, ownProps) => {
	return {
		clickedFeature: state.map.clickedFeature
	};
};

export default connect(mapStateToProps)(FeaturePopup);
