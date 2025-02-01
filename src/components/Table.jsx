import { metadata } from '../data/metadata';
import { useEffect, useRef, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa6';
import { TiArrowSortedDown } from 'react-icons/ti';
import { FiPlusCircle } from 'react-icons/fi';
import ActionModal from './generic/Modal';
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
	const [update, setUpdate] = useState(false);
	const [filters, setFilters] = useState({
		geo: [],
		lob: [],
		rtm: [],
		same_day_domestic: [],
		metric_id: [],
		metric_name: [],
	});
	const [triggerResetFilter, setTriggerResetFilter] = useState(false);

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

	const updateFilters = () => {
		const newFilters = {
			geo: [...new Set([...filters.geo, ...getUniqueValues(metrics, 'geo')])],
			lob: [...new Set([...filters.lob, ...getUniqueValues(metrics, 'lob')])],
			rtm: [...new Set([...filters.rtm, ...getUniqueValues(metrics, 'rtm')])],
			same_day_domestic: [
				...new Set([
					...filters.same_day_domestic,
					...getUniqueValues(metrics, 'same_day_domestic'),
				]),
			],
			metric_id: [
				...new Set([
					...filters.metric_id,
					...getUniqueValues(metrics, 'metric_id', 'parent'),
				]),
			],
			metric_name: [
				...new Set([
					...filters.metric_name,
					...getUniqueValues(metrics, 'metric_name', 'parent'),
				]),
			],
		};
		setFilters(newFilters);
		setUpdate(false);
	};

	useEffect(() => {
		updateFilters();
	}, [update]);

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

	const handleDelete = () => {};

	function getUniqueValues(items, property, level = 'child') {
		if (level === 'parent') {
			return [...new Set(items.map((item) => item[property]))];
		} else {
			return [
				...new Set(
					items.flatMap((item) =>
						item.child_metrics.map((child) => child[property])
					)
				),
			];
		}
	}

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
									<FilterDropdown
										triggerResetFilter={triggerResetFilter}
										setTriggerResetFilter={setTriggerResetFilter}
										items={metrics}
										changeState={setMetrics}
										property={'metric_id'}
										setFilters={setFilters}
										filters={filters}
										uniqueValues={getUniqueValues(
											metrics,
											'metric_id',
											'parent'
										)}
									/>
									Metric ID
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									<FilterDropdown
										triggerResetFilter={triggerResetFilter}
										setTriggerResetFilter={setTriggerResetFilter}
										items={metrics}
										changeState={setMetrics}
										property={'metric_name'}
										setFilters={setFilters}
										filters={filters}
										uniqueValues={getUniqueValues(
											metrics,
											'metric_name',
											'parent'
										)}
									/>
									Metric Name
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									<FilterDropdown
										triggerResetFilter={triggerResetFilter}
										setTriggerResetFilter={setTriggerResetFilter}
										items={metrics}
										changeState={setMetrics}
										property={'geo'}
										setFilters={setFilters}
										filters={filters}
										uniqueValues={getUniqueValues(metrics, 'geo')}
									/>
									Geo
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									<FilterDropdown
										triggerResetFilter={triggerResetFilter}
										setTriggerResetFilter={setTriggerResetFilter}
										items={metrics}
										changeState={setMetrics}
										property={'lob'}
										setFilters={setFilters}
										filters={filters}
										uniqueValues={getUniqueValues(metrics, 'lob')}
									/>
									LOB
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									<FilterDropdown
										triggerResetFilter={triggerResetFilter}
										setTriggerResetFilter={setTriggerResetFilter}
										items={metrics}
										changeState={setMetrics}
										property={'rtm'}
										setFilters={setFilters}
										filters={filters}
										uniqueValues={getUniqueValues(metrics, 'rtm')}
									/>
									RTM
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									<FilterDropdown
										triggerResetFilter={triggerResetFilter}
										setTriggerResetFilter={setTriggerResetFilter}
										items={metrics}
										changeState={setMetrics}
										property={'same_day_domestic'}
										setFilters={setFilters}
										filters={filters}
										uniqueValues={getUniqueValues(metrics, 'same_day_domestic')}
									/>
									Same Day Domestic
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									Metric Type
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									Benchmark Value
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-start column-gap-2">
									Metric Weightage
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{metrics ? (
							metrics.filter((metric) =>
								Object.keys(filters)
									.filter((key) => key == 'metric_id' || key == 'metric_name')
									.every((key) => filters[key].includes(metric[key]))
							).length > 0 ? (
								metrics
									.filter((metric) =>
										Object.keys(filters)
											.filter(
												(key) => key == 'metric_id' || key == 'metric_name'
											)
											.every((key) => filters[key].includes(metric[key]))
									)
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
													.filter((child_metric) =>
														Object.keys(filters)
															.filter(
																(key) =>
																	key !== 'metric_id' && key !== 'metric_name'
															)
															.every((key) =>
																filters[key].includes(child_metric[key])
															)
													)
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

			<ActionModal
				id="actionModal"
				metric={selectedMetric}
				setTriggerResetFilter={setTriggerResetFilter}
				updateFilters={updateFilters}
				setMetric={setMetrics}
				setUpdate={setUpdate}
			/>
		</div>
	);
}

export default Table;
