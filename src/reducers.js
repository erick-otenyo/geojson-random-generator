export const ACTIONS = {
	FEATURE_CLICKED: "FEATURE_CLICKED",
	SET_EXTENTS: "SET_EXTENTS",
	SET_DATA: "SET_DATA",
	SET_POINTS_NUM: "SET_POINTS_NUM",
	SET_PROPERTY: "SET_PROPERTY",
	RESET: "RESET"
};

const defaultState = {
	data: { type: "FeatureCollection", features: [] },
	num: 100,
	bbox: null,
	bboxPolygon: null,
	drawing: false,
	drawReady: false
};

export default (state = defaultState, action) => {
	switch (action.type) {
		case "FEATURE_CLICKED":
			return {
				...state,
				clickedFeature: action.feature
			};
		case "SET_EXTENTS":
			return {
				...state,
				bbox: action.bbox
			};
		case "SET_DATA":
			return {
				...state,
				data: action.data
			};
		case "SET_POINTS_NUM":
			return {
				...state,
				num: action.num
			};
		case "SET_PROPERTY":
			return {
				...state,
				[action.property]: action.value
			};
		case "RESET":
			return {
				...defaultState,
				drawReady: state.drawReady
			};
		default:
			return state;
	}
};
