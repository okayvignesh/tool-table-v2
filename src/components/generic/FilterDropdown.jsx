import React, { useState, useEffect } from 'react';
import { IoFilterCircleOutline } from 'react-icons/io5';

const FilterDropdown = ({
	items,
	property,
	uniqueValues,
	setFilters,
	filters,
	triggerResetFilter,
	setTriggerResetFilter
}) => {
	const [newFilters, setNewFilters] = useState(
		uniqueValues.reduce((acc, value) => {
			acc[value] = 'true';
			return acc;
		}, {})
	);

	useEffect(() => {
		resetFiltersToDefault();
	}, [triggerResetFilter]);

	const resetFiltersToDefault = () => {
		setNewFilters((prev) =>
			Object.keys(prev).reduce((acc, value) => {
				acc[value] = 'true';
				return acc;
			}, {})
		);
		setTriggerResetFilter(false);
	};

	const metricMapping = items.reduce((acc, item) => {
		acc[item.metric_id] = item.metric_name;
		return acc;
	}, {});

	useEffect(() => {
		const dropdownState = Object.keys(newFilters);
		let parentFilterUpdated = false;

		if (property === 'metric_id' || property === 'metric_name') {
			for (const key of dropdownState) {
				if (!filters[property].includes(key)) {
					parentFilterUpdated = true;
				}
			}
		}

		setNewFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters };

			uniqueValues.forEach((value) => {
				if (property === 'metric_id' || property === 'metric_name') {
					updatedFilters[value] = parentFilterUpdated ? 'false' : 'true';
				}
				if (!updatedFilters[value]) {
					updatedFilters[value] = 'true';
				}
			});
			return updatedFilters;
		});
	}, [uniqueValues]);

	const handleCheckboxChange = (propertyValue) => {
		setNewFilters((prevFilters) => {
			const newFilters = { ...prevFilters };
			const newValue = newFilters[propertyValue] === 'true' ? 'false' : 'true';
			newFilters[propertyValue] = newValue;
			return newFilters;
		});

		setFilters((prevFilters) => {
			const newFilters = { ...prevFilters };

			if (Array.isArray(newFilters[property])) {
				let updatedArray = [...newFilters[property]];
				let linkedProperty =
					property === 'metric_id' ? 'metric_name' : 'metric_id';
				let linkedValue =
					property === 'metric_id'
						? metricMapping[propertyValue]
						: Object.keys(metricMapping).find(
								(key) => metricMapping[key] === propertyValue
						  );

				if (updatedArray.includes(propertyValue)) {
					updatedArray = updatedArray.filter((item) => item !== propertyValue);
					newFilters[linkedProperty] = newFilters[linkedProperty].filter(
						(item) => item !== linkedValue
					);
				} else {
					updatedArray.push(propertyValue);
					newFilters[linkedProperty] = [
						...newFilters[linkedProperty],
						linkedValue,
					];
				}

				newFilters[property] = updatedArray;
			}

			return newFilters;
		});
	};

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
			<div className="dropdown-menu p-2 filterDropdown" style={{ minWidth: '200px' }}>
				<ul className="list-unstyled">
					{uniqueValues.map((value, index) => {
						const isChecked = newFilters[value] === 'true';
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
