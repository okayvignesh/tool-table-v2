import React, { useState } from 'react';

const MultiSelect = ({
	options,
	selectedValues,
	onChange,
	placeholder = 'Select options',
	required = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (value) => {
		const newSelectedValues = selectedValues.includes(value)
			? selectedValues.filter((v) => v !== value)
			: [...selectedValues, value];
		onChange(newSelectedValues);
	};

	return (
		<div className="dropdown">
			<button
				className="btn form-select form-select-sm"
				type="button"
				data-bs-toggle="dropdown"
				data-bs-auto-close="outside"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}>
				{selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
			</button>
			<ul
				className={`dropdown-menu${isOpen ? ' show' : ''}`}
				style={{ maxHeight: '200px', overflowY: 'auto' }}>
				{options.map((option, index) => (
					<li key={index}>
						<label className="dropdown-item">
							<input
								type="checkbox"
								checked={selectedValues.includes(option)}
								onChange={() => handleSelect(option)}
							/>
							{option}
						</label>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MultiSelect;
