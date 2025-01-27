import React, { useState } from 'react';
import { IoFilterCircleOutline } from 'react-icons/io5';

const FilterDropdown = ({ items, property, changeState }) => {
	const [filters, setFilters] = useState({});

	const handleCheckboxChange = (propertyValue) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[propertyValue]: !prevFilters[propertyValue],
		}));

		changeState((prev) => {
			return prev.map((region) => ({
				...region,
				child_metrics: region.child_metrics.map((child) => {
					if (child[property] === propertyValue) {
						return {
							...child,
							show: !filters[propertyValue],
						};
					}
					return child;
				}),
			}));
		});
	};

	const uniqueValues = [
		...new Set(
			items.flatMap((region) =>
				region.child_metrics.map((child) => child[property])
			)
		),
	];

	return (
		<div className="dropdown d-flex align-items-center">
			<button
				className="filterbtn"
				type="button"
				data-bs-auto-close="outside"
				data-bs-toggle="dropdown"
				aria-expanded="false">
				<IoFilterCircleOutline size={25} color="gray" />
			</button>
			<div className="dropdown-menu p-2" style={{ minWidth: '200px' }}>
				<ul className="list-unstyled">
					{uniqueValues.map((value, index) => {
						const isChecked = filters[value] !== false;
						return (
							<li key={index} className="mb-2">
								<input
									type="checkbox"
									id={`checkbox-${index}`}
									checked={isChecked}
									onChange={() => handleCheckboxChange(value)}
									className="form-check-input me-2"
								/>
								<label
									htmlFor={`checkbox-${index}`}
									className="form-check-label">
									{value}
								</label>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default FilterDropdown;
