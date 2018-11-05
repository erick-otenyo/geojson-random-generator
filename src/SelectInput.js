import React from "react";

const SelectInput = (props) => {
	const { options, ...input } = props;
	return (
		<select {...input}>
			<option />
			{options.map((property) => (
				<option
					key={property}
					value={property}
					style={{
						textTransform: "capitalize"
					}}
				>
					{property}
				</option>
			))}
		</select>
	);
};

export default SelectInput;
