import React from "react";
import { connect } from "react-redux";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import faker from "faker";
import { GoCloudDownload as DownloadIcon, GoPlus } from "react-icons/go";

import SelectInput from "./SelectInput";

let OPTIONS = {};

let modules = Object.keys(faker);

modules = modules.sort();
modules.forEach(function(module) {
	var ignore = ["locale", "locales", "localeFallback", "definitions", "fake"];
	if (ignore.indexOf(module) !== -1) {
		return;
	}
	OPTIONS[module] = Object.keys(faker[module]);
});

const isNonEmptyString = (val) => {
	return typeof val === "string" && val.trim().length > 0;
};

const required = (message) => (value) => {
	if (typeof value === "undefined" || value === null) {
		// undefined or null values are invalid
		return message;
	}
	if (typeof value === "string") {
		// string must be nonempty when trimmed
		return isNonEmptyString(value) ? undefined : message;
	}
	return undefined;
};

const PropertiesForm = (props) => {
	const { data, bbox, handleDownload } = props;
	return (
		<Form
			onSubmit={props.onCreate}
			mutators={{
				...arrayMutators
			}}
			render={({
				handleSubmit,
				form: {
					mutators: { push, pop }
				},
				pristine,
				reset,
				submitting,
				values
			}) => {
				const withProperties =
					values && values.properties && values.properties.length
						? true
						: false;

				return (
					<form onSubmit={handleSubmit}>
						<div className="add-button-container">
							<button
								type="button"
								className="button primary"
								onClick={() => push("properties", undefined)}
							>
								<GoPlus /> Add property
							</button>
						</div>

						<FieldArray name="properties">
							{({ fields, meta }) => (
								<div className={withProperties ? "form" : ""}>
									{fields.map((name, index) => (
										<div key={name}>
											<Field
												name={`${name}.title`}
												className="title-input"
												component="input"
												placeholder="Property Title"
												validate={required("Required")}
											/>
											<Field
												name={`${name}.module`}
												validate={required("Required")}
											>
												{({ input }) => {
													return (
														<SelectInput
															{...input}
															options={Object.keys(OPTIONS)}
														/>
													);
												}}
											</Field>

											{values.properties[index] &&
												values.properties[index].module && (
													<Field
														name={`${name}.property`}
														validate={required("Required")}
													>
														{({ input, meta }) => {
															return (
																<React.Fragment>
																	<SelectInput
																		{...input}
																		options={
																			OPTIONS[values.properties[index].module]
																		}
																	/>
																	{meta.error &&
																		meta.touched && <span>{meta.error}</span>}
																</React.Fragment>
															);
														}}
													</Field>
												)}

											<span
												onClick={() => fields.remove(index)}
												role="img"
												aria-label="remove"
												style={{ cursor: "pointer", color: "red" }}
											>
												❌
											</span>
										</div>
									))}
								</div>
							)}
						</FieldArray>
						<div className="generate-button-container">
							{withProperties ? (
								<button
									type="submit"
									className="button success"
									disabled={submitting || pristine || !props.bbox}
								>
									Generate
								</button>
							) : (
								<button className="button success" disabled={!bbox}>
									Generate
								</button>
							)}
							{data && data.features.length ? (
								<button
									type="button"
									className="button success"
									onClick={handleDownload}
								>
									<DownloadIcon size="2em" />
									<span> Download</span>
								</button>
							) : null}
						</div>
					</form>
				);
			}}
		/>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		bbox: state.map.bbox && state.map.bbox.length ? true : false,
		data: state.map.data
	};
};

export default connect(mapStateToProps)(PropertiesForm);
