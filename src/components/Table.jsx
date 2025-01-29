import { metadata } from '../data/metadata';
import { useEffect, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa6';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FiPlusCircle } from 'react-icons/fi';
import Modal from './generic/Modal';
import FilterDropdown from './generic/FilterDropdown';
import { MdDelete } from 'react-icons/md';

function Table() {
	const [metrics, setMetrics] = useState(
		metadata.items.map((metric) => ({
			...metric,
			expanded: false,
			show: true,
			child_metrics: metric.child_metrics.map((child) => ({
				...child,
				show: true,
				selected: false,
			})),
		}))
	);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedMetric, setSelectedMetric] = useState(null);
	const [enableDelete, setEnableDelete] = useState(false);

	const toggleExpand = (index) => {
		setMetrics((prevMetrics) =>
			prevMetrics.map((metric, i) =>
				i === index ? { ...metric, expanded: !metric.expanded } : metric
			)
		);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [search]);

	useEffect(() => {
		if (debouncedSearch === '') {
			setMetrics((prevMetrics) =>
				prevMetrics.map((metric) => ({
					...metric,
					expanded: false,
				}))
			);
			return;
		}

		setMetrics((prevMetrics) =>
			prevMetrics.map((metric) => {
				const hasMatchingState = metric.child_metric.some(
					(state) =>
						state.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
						state.capital.toLowerCase().includes(debouncedSearch.toLowerCase())
				);
				return {
					...metric,
					expanded: hasMatchingState ? true : metric.expanded,
				};
			})
		);
	}, [debouncedSearch]);

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	const toggleAll = (expanded) => {
		setMetrics((prevMetrics) =>
			prevMetrics.map((metric) => ({
				...metric,
				expanded: expanded,
			}))
		);
	};

	const handleSelectChild = (metricName, childLob, childGeo) => {
		setMetrics((prevMetrics) => {
			const updatedMetrics = prevMetrics.map((metric) => {
				if (metric.metric_name === metricName) {
					return {
						...metric,
						child_metrics: metric.child_metrics.map((child) => {
							if (child.lob === childLob && child.geo === childGeo) {
								return {
									...child,
									selected: !child.selected, // Toggle the selected state
								};
							}
							return child;
						}),
					};
				}
				return metric;
			});

			const isAnyChildSelected = updatedMetrics.some((metric) =>
				metric.child_metrics.some((child) => child.selected)
			);

			setEnableDelete(isAnyChildSelected);

			return updatedMetrics;
		});
	};

	const handleDelete = () => {
		
	};

	return (
		<div>
			<div className="search-bar">
				<button className="border-img" onClick={() => toggleAll(true)}>
					Expand All
				</button>
				<button className="border-img" onClick={() => toggleAll(false)}>
					Collapse All
				</button>
				{/* <input
					type="text"
					placeholder="Search"
					value={search}
					onChange={handleSearch}
				/> */}
			</div>

			<div className="table-parent">
				<table>
					<thead>
						<tr>
							<th>Action</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'metric_id'}
									/> */}
									Metric ID
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'metric_name'}
									/> */}
									Metric Name
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'geo'}
									/> */}
									Geo
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'lob'}
									/> */}
									LOB
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'rtm'}
									/> */}
									RTM
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'same_day_domestic'}
									/> */}
									Same Day Domestic
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'metric_type'}
									/> */}
									Metric Type
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'benchmark_value'}
									/> */}
									Benchmark Value
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									{/* <FilterDropdown
										items={metrics}
										changeState={setMetrics}
										property={'metric_weightage'}
									/> */}
									Metric Weightage
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{metrics ? (
							metrics.filter((metric) => metric.show).length > 0 ? (
								metrics
									.filter((metric) => metric.show)
									.map((metric, index) => (
										<>
											<tr>
												<td>
													<div className="d-flex">
														<button
															className="actionbtn"
															data-bs-toggle="modal"
															data-bs-target="#actionModal"
															onClick={() => setSelectedMetric(metric)}>
															<FiPlusCircle size={20} color="gray" />
														</button>
														<button
															disabled={!enableDelete}
															className="actionbtn"
															onClick={handleDelete}>
															<MdDelete size={20} color="gray" />
														</button>
													</div>
												</td>
												<td>{metric.metric_id}</td>
												<td>
													<button
														onClick={() => toggleExpand(index)}
														className="no-border-img">
														{metric.expanded ? (
															<TiArrowSortedDown size={20} color="gray" />
														) : (
															<FaCaretRight size={18} color="gray" />
														)}
													</button>
													<span style={{ padding: '5px' }}>
														{metric.metric_name}
													</span>
												</td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
											</tr>
											{metric.expanded &&
												metric.child_metrics
													.filter((child_metric) => child_metric.show)
													.map((child_metric, child_metricIndex) => (
														<tr
															key={`${metric.name}-${child_metric.name}-${child_metricIndex}`}
															className="sub-tr">
															<td></td>
															<td></td>
															<td className="text-start">
																<input
																	type="checkbox"
																	id={`checkbox-${
																		metric.metric_name + '-' + child_metric.lob
																	}`}
																	onChange={() =>
																		handleSelectChild(
																			metric.metric_name,
																			child_metric.lob,
																			child_metric.geo
																		)
																	}
																	checked={child_metric.selected}
																	className="form-check-input me-2"
																/>
																{metric.metric_name + ' - ' + child_metric.lob}
															</td>
															<td className="text-start">{child_metric.geo}</td>
															<td className="text-start">{child_metric.lob}</td>
															<td className="text-start">
																{Array.isArray(child_metric?.rtm) &&
																child_metric.rtm.length > 0
																	? child_metric.rtm.join(', ')
																	: ''}
															</td>
															<td className="text-start">
																{child_metric.same_day_domestic}
															</td>
															<td className="text-start">
																{child_metric.metric_type}
															</td>
															<td className="text-start">
																{child_metric.benchmark_value}
															</td>
															<td className="text-start">
																{child_metric.metric_weightage}
															</td>
														</tr>
													))}
										</>
									))
							) : (
								<p className="text-center py-3">No filter selected</p>
							)
						) : (
							<p>No records found</p>
						)}
					</tbody>
				</table>
			</div>

			<Modal id="actionModal" metric={selectedMetric} setMetric={setMetrics} />
		</div>
	);
}

export default Table;
