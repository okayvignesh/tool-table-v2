import React, { useState, useRef, useEffect } from 'react';
import { metricData } from '../../data/metricData';
import { metadata } from '../../data/metadata';
import { regionData } from '../../data/regionData';
import { HiMiniCheck } from 'react-icons/hi2';
import MultiSelect from './MultiSelect';
import { Modal } from 'bootstrap';
import { PiTrainRegionalBold } from 'react-icons/pi';

const ActionModal = ({
	id,
	metric,
	setMetric,
	updateFilters,
	setUpdate,
	setTriggerResetFilter,
}) => {
	const [page, setPage] = useState(1);
	const [region, setRegion] = useState(
		regionData.map((region) => ({
			...region,
			selected: false,
		}))
	);
	const [selectedCountries, setSelectedCountries] = useState([]);
	const [selectedMarketTeams, setSelectedMarketTeams] = useState([]);
	const [selectedMarkets, setSelectedMarkets] = useState([]);
	const [selectedStores, setSelectedStores] = useState([]);
	const [finalSelections, setfinalSelections] = useState([]);
	const [finalSelectionType, setfinalSelectionType] = useState('');
	const [isDirty, setIsDirty] = useState(false);
	const [metricFormData, setMetricFormData] = useState({
		geo: [],
		lob: [],
		rtm: '',
		same_day_domestic: '',
		metric_type: '',
		benchmark_value: '',
		metric_weightage: '',
		metric_ceiling: '',
		metric_floor: '',
		metric_sign: '',
		benchmark_ceiling: '',
		benchmark_logic_type: '',
		ranking_metric: '',
	});
	const initialFormState = useRef(JSON.stringify(region));
	const [errors, setErrors] = useState({});
	const [createdRecords, setCreatedRecords] = useState([]);
	const [updatedRecords, setUpdatedRecords] = useState([]);
	const closeBtnRef = useRef(null);

	useEffect(() => {
		setIsDirty(JSON.stringify(region) !== initialFormState.current);
	}, [region]);

	const handleCancel = (e) => {
		console.log(region, initialFormState, isDirty);
		if (isDirty) {
			const confirmLeave = window.confirm(
				'You have unsaved changes. Are you sure you want to discard them?'
			);
			if (!confirmLeave) {
				e.preventDefault();
				e.stopPropagation();
				return;
			} else {
				resetgeo();
			}
		}
		closeBtnRef.current.click();

		// const modalElement = document.getElementById(id);
		// if (modalElement) {
		// 	const modalInstance = Modal.getInstance(modalElement);
		// 	if (modalInstance) {
		// 		modalInstance.hide();
		// 		const backdropElement = document.querySelector('.modal-backdrop');
		// 		if (backdropElement) {
		// 		  backdropElement.remove();
		// 		}
		// 	}
		// }
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setMetricFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSelect = (type, item) => {
		switch (type) {
			case 'region':
				toggleRegion(item);
				break;
			case 'country':
				toggleCountry(item);
				break;
			case 'marketTeam':
				toggleMarketTeam(item);
				break;
			case 'market':
				toggleMarket(item);
				break;
			case 'store':
				toggleStore(item);
				break;
			default:
				break;
		}

		addToFinalSelections(type, item);
	};

	const typePrecedence = {
		region: 1,
		country: 2,
		marketTeam: 3,
		market: 4,
		store: 5,
	};

	let previousSelections = {};

	const addToFinalSelections = (type, item) => {
		let updatedSelection = [...finalSelections];
		let deselected = false;

		if (typePrecedence[type] < typePrecedence[finalSelectionType]) {
			if (!item.selected) return;

			const deselectingItems = extractAllItems(item);
			deselected = true;

			updatedSelection = updatedSelection.filter(
				(selection) =>
					!deselectingItems.some((deselect) => deselect.id === selection.id)
			);

			if (updatedSelection.length === 0) {
				adjustSelectionHierarchy();
				return;
			}

			updateSelections(updatedSelection);
			return;
		}

		if (type !== finalSelectionType) {
			setfinalSelectionType(type);
			if (deselected) return;

			updatedSelection =
				typePrecedence[type] < typePrecedence[finalSelectionType]
					? previousSelections[finalSelectionType] || [item]
					: [item];
		} else {
			updatedSelection = item.selected
				? updatedSelection.filter((selection) => selection.id !== item.id)
				: [...updatedSelection, item];

			if (updatedSelection.length === 0 && type !== 'region') {
				adjustSelectionHierarchy();
				return;
			}
		}

		updateSelections(updatedSelection);

		function adjustSelectionHierarchy() {
			let currentPrecedence = typePrecedence[finalSelectionType] - 1;
			let newType = Object.keys(typePrecedence).find(
				(key) => typePrecedence[key] === currentPrecedence
			);

			const selectionMap = {
				region: region.filter((market) => market.selected),
				country: selectedCountries.filter((market) => market.selected),
				marketTeam: selectedMarketTeams.filter((market) => market.selected),
				market: selectedMarkets.filter((market) => market.selected),
			};

			let updatedSelection = [];

			while (newType) {
				updatedSelection = selectionMap[newType] || [];

				if (deselected && updatedSelection.length) {
					const deselectingItems = extractAllItems(item);
					updatedSelection = updatedSelection.filter(
						(selection) =>
							!deselectingItems.some((deselect) => deselect.id === selection.id)
					);
				}

				if (updatedSelection.length === 0) {
					currentPrecedence--;
					newType = Object.keys(typePrecedence).find(
						(key) => typePrecedence[key] === currentPrecedence
					);
				} else {
					break;
				}
			}

			if (newType) {
				setfinalSelectionType(newType);
				updateSelections(updatedSelection);
			}
		}

		function updateSelections(newSelections) {
			setfinalSelections(newSelections);

			setMetricFormData((prev) => ({
				...prev,
				geo: newSelections.map((e) => {
					if (e.region) return e.region;
					if (e.country) return e.country;
					if (e.marketTeam) return e.marketTeam;
					if (e.market) return e.market;
					if (e.store) return e.store;
					return e.name;
				}),
			}));
		}
	};

	const extractAllItems = (region) => {
		let result = [];

		function traverse(item) {
			if (item && typeof item === 'object') {
				if (item.id) {
					result.push(item);
				}

				Object.values(item).forEach((value) => {
					if (Array.isArray(value)) {
						value.forEach(traverse);
					}
				});
			}
		}

		traverse(region);
		return result;
	};

	const toggleRegion = (item) => {
		setRegion((prevRegions) => {
			return prevRegions.map((region) => {
				if (region.region === item.region) {
					if (!region.selected) {
						setSelectedCountries((prevCountries) => {
							const countriesToAdd = region.countries.filter(
								(country) =>
									!prevCountries.some(
										(selected) => selected.country === country.country
									)
							);
							return [...prevCountries, ...countriesToAdd];
						});
					} else {
						setSelectedCountries((prevCountries) =>
							prevCountries.filter(
								(country) =>
									!region.countries.some(
										(item) => item.country === country.country
									)
							)
						);
						region.countries.forEach((country) => {
							setSelectedMarketTeams((prevSelectedMarketTeams) =>
								prevSelectedMarketTeams.filter(
									(team) =>
										!country.marketTeams.some(
											(teamItem) => teamItem.marketTeam === team.marketTeam
										)
								)
							);
							country.marketTeams.forEach((team) => {
								setSelectedMarkets((prevSelectedMarkets) =>
									prevSelectedMarkets.filter(
										(market) =>
											!team.markets.some(
												(marketItem) => marketItem.market === market.market
											)
									)
								);
								team.markets.forEach((market) => {
									setSelectedStores((prevSelectedStores) =>
										prevSelectedStores.filter(
											(store) =>
												!market.stores.some(
													(storeItem) => storeItem.name === store.name
												)
										)
									);
								});
							});
						});
					}
					return {
						...region,
						selected: !region.selected,
					};
				}
				return region;
			});
		});
	};

	const toggleCountry = (item) => {
		setSelectedCountries((prevCountries) => {
			return prevCountries.map((country) => {
				if (country.country === item.country) {
					if (!country.selected) {
						setSelectedMarketTeams((prevSelectedMarketTeams) => {
							const marketTeamsToAdd = item.marketTeams.filter(
								(team) =>
									!prevSelectedMarketTeams.some(
										(selectedTeam) =>
											selectedTeam.marketTeam === team.marketTeam
									)
							);
							return [...prevSelectedMarketTeams, ...marketTeamsToAdd];
						});
						return {
							...country,
							selected: true,
						};
					} else {
						setSelectedMarketTeams((prevMarketTeams) =>
							prevMarketTeams.filter(
								(team) =>
									!item.marketTeams.some(
										(teamItem) => teamItem.marketTeam === team.marketTeam
									)
							)
						);
						country.marketTeams.forEach((team) => {
							setSelectedMarkets((prevSelectedMarkets) =>
								prevSelectedMarkets.filter(
									(market) =>
										!team.markets.some(
											(marketItem) => marketItem.market === market.market
										)
								)
							);
							team.markets.forEach((market) => {
								setSelectedStores((prevSelectedStores) =>
									prevSelectedStores.filter(
										(store) =>
											!market.stores.some(
												(storeItem) => storeItem.name === store.name
											)
									)
								);
							});
						});
						return {
							...country,
							selected: false,
						};
					}
				}
				return country;
			});
		});
	};

	const toggleMarketTeam = (item) => {
		setSelectedMarketTeams((prevMarketTeams) => {
			return prevMarketTeams.map((team) => {
				if (team.marketTeam === item.marketTeam) {
					if (!team.selected) {
						setSelectedMarkets((prevSelectedMarkets) => {
							const marketsToAdd = item.markets.filter(
								(market) =>
									!prevSelectedMarkets.some(
										(selectedMarket) => selectedMarket.market === market.market
									)
							);
							return [...prevSelectedMarkets, ...marketsToAdd];
						});
						return {
							...team,
							selected: true,
						};
					} else {
						setSelectedMarkets((prevSelectedMarkets) =>
							prevSelectedMarkets.filter(
								(market) =>
									!item.markets.some(
										(marketItem) => marketItem.market === market.market
									)
							)
						);
						team.markets.forEach((market) => {
							setSelectedStores((prevSelectedStores) =>
								prevSelectedStores.filter(
									(store) =>
										!market.stores.some(
											(storeItem) => storeItem.name === store.name
										)
								)
							);
						});
						return {
							...team,
							selected: false,
						};
					}
				}
				return team;
			});
		});
	};

	const toggleMarket = (item) => {
		setSelectedMarkets((prevSelectedMarkets) => {
			return prevSelectedMarkets.map((market) => {
				if (market.market === item.market) {
					if (!market.selected) {
						setSelectedStores((prevSelectedStores) => {
							const storesToAdd = item.stores.filter(
								(store) =>
									!prevSelectedStores.some(
										(selectedStore) => selectedStore.name === store.name
									)
							);
							return [...prevSelectedStores, ...storesToAdd];
						});
						return {
							...market,
							selected: true,
						};
					} else {
						setSelectedStores((prevSelectedStores) =>
							prevSelectedStores.filter(
								(store) =>
									!item.stores.some(
										(storeItem) => storeItem.name === store.name
									)
							)
						);
						return {
							...market,
							selected: false,
						};
					}
				}
				return market;
			});
		});
	};

	const toggleStore = (item) => {
		setSelectedStores((prevSelectedStores) => {
			return prevSelectedStores.map((store) => {
				if (store.name === item.name) {
					return {
						...store,
						selected: !store.selected,
					};
				}
				return store;
			});
		});
	};

	const nextPage = () => {
		const requiredFields = ['geo', 'lob', 'rtm', 'same_day_domestic'];
		let newErrors = {};

		requiredFields.forEach((field) => {
			if (Array.isArray(metricFormData[field])) {
				if (!metricFormData[field].length) {
					newErrors[field] = 'This field is required';
				}
			} else if (!metricFormData[field] || !metricFormData[field].trim()) {
				newErrors[field] = 'This field is required';
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setErrors({});
		generateRecords(metricFormData);

		setPage(2);
	};

	const handleMultiChange = (selectedValues, key) => {
		setMetricFormData((prev) => ({
			...prev,
			[key]: selectedValues,
		}));
	};

	const generateRecords = (formData) => {
		const { geo, lob, ...rest } = formData;

		const records = geo.flatMap((g) =>
			lob.map((l) => ({
				...rest,
				geo: g,
				lob: l,
			}))
		);

		const updatedRecords = [];
		const createdRecords = [];

		records.forEach((record) => {
			const existingRecord = metric.child_metrics.find(
				(child) => child.geo === record.geo && child.lob === record.lob
			);

			if (existingRecord) {
				updatedRecords.push({ ...existingRecord, ...record });
			} else {
				createdRecords.push(record);
			}
		});

		setUpdatedRecords(updatedRecords);
		setCreatedRecords(createdRecords);
	};

	const updateMetrics = async (metricId, createdRecords, updatedRecords) => {
		setMetric((prevMetrics) =>
			prevMetrics.map((metric) => {
				if (metric.metric_id === metricId) {
					const updatedMetric = { ...metric };

					const existingChildMetrics = updatedMetric.child_metrics || [];

					if (updatedRecords) {
						updatedMetric.child_metrics = updatedRecords.map((record) => ({
							...record,
							show: true,
							selected: false,
						}));
					}

					if (createdRecords) {
						updatedMetric.child_metrics = [
							...existingChildMetrics,
							...createdRecords.map((record) => ({
								...record,
								show: true,
								selected: false,
							})),
						];
					}

					return updatedMetric;
				}
				return metric;
			})
		);

		updateFilters();
		setUpdate(true);
		setTriggerResetFilter(true);
		if (closeBtnRef.current) {
			closeBtnRef.current.click();
		}
		await resetgeo();
	};

	const resetgeo = () => {
		setPage(1);
		setMetricFormData({
			geo: [],
			lob: [],
			rtm: '',
			same_day_domestic: '',
			metric_type: '',
			benchmark_value: '',
			metric_weightage: '',
			metric_ceiling: '',
			metric_floor: '',
			metric_sign: '',
			benchmark_ceiling: '',
			benchmark_logic_type: '',
			ranking_metric: '',
		});
		setRegion((prevRegions) =>
			prevRegions.map((region) => ({
				...region,
				selected: false,
			}))
		);
		setSelectedCountries([]);
		setSelectedMarketTeams([]);
		setSelectedMarkets([]);
		setSelectedStores([]);
		setfinalSelections([]);
	};

	return (
		<div
			className="modal fade"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			id={id}
			tabIndex="-1"
			aria-labelledby={`${id}Label`}
			aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered modal-xl">
				<div className="modal-content">
					<button
						type="button"
						className="btn-close closebtn"
						data-bs-dismiss="modal"
						ref={closeBtnRef}
						aria-label="Close"></button>

					<p className="modal-title">
						<b>{metric?.metric_name}</b>
					</p>

					<div className="main-title-btns">
						<div className="d-flex align-items-center">
							<p className="page-no-title">
								<b className={`page-no ${page != 1 ? 'current' : ''}`}>1</b>
							</p>
							<span className="line"></span>
							<p className="page-no-title">
								<b className={`page-no ${page != 2 ? 'current' : ''}`}>2</b>
							</p>
						</div>
						<div className="d-flex align-items-center page-title-gap">
							<p>Configure</p>
							<p>Preview</p>
						</div>
					</div>

					<div className="modal-body">
						{page === 1 ? (
							<>
								<div>
									<div className="geo-container">
										<div>
											<p className="geo-header">Geo</p>
											<div className="d-flex justify-content-around align-items-center row">
												<div className="geo-box-container">
													<div className="geo-title">
														Region (
														{region.filter((reg) => reg.selected).length})
													</div>
													<div className="geo-box">
														<li>
															<HiMiniCheck
																color="#57A0ED"
																size={15}
																className="me-2"
															/>
															WW
														</li>
														<div className="ww"></div>
														{region &&
															region.map((reg, regIndex) => (
																<li
																	key={regIndex}
																	onClick={() => handleSelect('region', reg)}>
																	<HiMiniCheck
																		color="#57A0ED"
																		size={15}
																		className="me-2"
																		style={{
																			visibility: reg.selected
																				? 'visible'
																				: 'hidden',
																		}}
																	/>
																	{reg.region}
																</li>
															))}
													</div>
												</div>
												<div className="geo-box-container">
													<div className="geo-title">
														Country (
														{
															selectedCountries.filter((reg) => reg.selected)
																.length
														}
														)
													</div>
													<div className="geo-box">
														{selectedCountries.map((count, countryIndex) => (
															<li
																key={countryIndex}
																onClick={(e) => {
																	e.stopPropagation();
																	handleSelect('country', count);
																}}>
																<HiMiniCheck
																	color="#57A0ED"
																	size={15}
																	className="me-2"
																	style={{
																		visibility: count.selected
																			? 'visible'
																			: 'hidden',
																	}}
																/>
																{count.country}
															</li>
														))}
													</div>
												</div>
												<div className="geo-box-container">
													<div className="geo-title">
														Market Team (
														{
															selectedMarketTeams.filter((reg) => reg.selected)
																.length
														}
														)
													</div>
													<div className="geo-box">
														{selectedMarketTeams.map((mt, teamIndex) => (
															<li
																key={teamIndex}
																onClick={(e) => {
																	e.stopPropagation();
																	handleSelect('marketTeam', mt);
																}}>
																<HiMiniCheck
																	color="#57A0ED"
																	size={15}
																	className="me-2"
																	style={{
																		visibility: mt.selected
																			? 'visible'
																			: 'hidden',
																	}}
																/>
																{mt.marketTeam}
															</li>
														))}
													</div>
												</div>
												<div className="geo-box-container">
													<div className="geo-title">
														Markets (
														{
															selectedMarkets.filter((reg) => reg.selected)
																.length
														}
														)
													</div>
													<div className="geo-box">
														{selectedMarkets.map((m, marketIndex) => (
															<li
																key={marketIndex}
																onClick={(e) => {
																	e.stopPropagation();
																	handleSelect('market', m);
																}}>
																<HiMiniCheck
																	color="#57A0ED"
																	size={15}
																	className="me-2"
																	style={{
																		visibility: m.selected
																			? 'visible'
																			: 'hidden',
																	}}
																/>
																{m.market}
															</li>
														))}
													</div>
												</div>
												<div className="geo-box-container">
													<div className="geo-title">
														Store (
														{
															selectedStores.filter((reg) => reg.selected)
																.length
														}
														)
													</div>
													<div className="geo-box">
														{selectedStores.map((store, storeIndex) => (
															<li
																key={storeIndex}
																onClick={(e) => {
																	e.stopPropagation();
																	handleSelect('store', store);
																}}>
																<HiMiniCheck
																	color="#57A0ED"
																	size={15}
																	className="me-2"
																	style={{
																		visibility: store.selected
																			? 'visible'
																			: 'hidden',
																	}}
																/>
																{store.name}
															</li>
														))}
													</div>
												</div>
												<div className="geo-box-container">
													<div className="geo-title">
														Selected ({finalSelections.length})
													</div>
													<div
														className={`geo-box selected ${
															errors.geo ? 'error' : ''
														}`}>
														{finalSelections.map((final, storeIndex) => (
															<li key={storeIndex}>
																{
																	final[
																		finalSelectionType != 'store'
																			? finalSelectionType
																			: 'name'
																	]
																}
															</li>
														))}
													</div>
												</div>
											</div>
										</div>
										<div className="d-flex align-items-center">
											<div className="col-3 left-column">
												<div className="py-2">
													<label className="select-label">LOB</label>
													<MultiSelect
														options={
															metricData.find((metric) => metric.key === 'lob')
																?.values || []
														}
														selectedValues={metricFormData.lob}
														onChange={(e) => handleMultiChange(e, 'lob')}
														placeholder="Select LOB"
														required
													/>
													{errors.lob && (
														<span className="text-danger">{errors.lob}</span>
													)}
												</div>
												<div className="py-2">
													<label className="select-label">RTM</label>
													<MultiSelect
														options={
															metricData.find((metric) => metric.key === 'rtm')
																?.values || []
														}
														selectedValues={metricFormData.rtm}
														onChange={(e) => handleMultiChange(e, 'rtm')}
														placeholder="Select RTM"
														required
													/>
													{errors.rtm && (
														<span className="text-danger">{errors.rtm}</span>
													)}
												</div>
												<div className="py-2">
													<label className="select-label">
														Same Day Domestic
													</label>
													<select
														className="form-select form-select-sm m-0"
														name="same_day_domestic"
														value={metricFormData.same_day_domestic}
														onChange={handleChange}
														required>
														<option value="">Select Same Day Domestic</option>
														{metricData
															.find(
																(metric) => metric.key === 'same_day_domestic'
															)
															?.values.map((metric, index) => (
																<option value={metric} key={index}>
																	{metric}
																</option>
															))}
													</select>
													{errors.same_day_domestic && (
														<span className="text-danger">
															{errors.same_day_domestic}
														</span>
													)}
												</div>
											</div>
											<div className="vertical-line"></div>
											<div className="col-9 d-flex flex-wrap right-column">
												<div className="input-grp">
													<label className="select-label">Metric Type</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="metric_type"
														value={metricFormData.metric_type}
														onChange={handleChange}
													/>
												</div>

												<div className="input-grp">
													<label className="select-label">
														Benchmark Value
													</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="benchmark_value"
														value={metricFormData.benchmark_value}
														onChange={handleChange}
													/>
												</div>

												<div className="input-grp">
													<label className="select-label">
														Metric Weightage
													</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="metric_weightage"
														value={metricFormData.metric_weightage}
														onChange={handleChange}
													/>
												</div>

												<div className="input-grp">
													<label className="select-label">Metric Ceiling</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="metric_ceiling"
														value={metricFormData.metric_ceiling}
														onChange={handleChange}
													/>
												</div>

												<div className="input-grp">
													<label className="select-label">Metric Floor</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="metric_floor"
														value={metricFormData.metric_floor}
														onChange={handleChange}
													/>
												</div>

												<div className="input-grp">
													<label className="select-label">Metric Sign</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="metric_sign"
														value={metricFormData.metric_sign}
														onChange={handleChange}
													/>
												</div>

												<div className="input-grp">
													<label className="select-label">
														Benchmark Ceiling
													</label>
													<input
														type="number"
														placeholder="%"
														className="form-control"
														name="benchmark_ceiling"
														value={metricFormData.benchmark_ceiling}
														onChange={handleChange}
													/>
												</div>

												<div className="p-2">
													<label className="select-label">
														Benchmark Logic Type
													</label>
													<select
														className="form-select form-select-sm m-0"
														name="benchmark_logic_type"
														value={metricFormData.benchmark_logic_type}
														onChange={handleChange}>
														<option value="">
															Select Benchmark Logic Type
														</option>
														{metricData
															.find(
																(metric) =>
																	metric.key === 'benchmark_logic_type'
															)
															?.values.map((metric, index) => (
																<option value={metric} key={index}>
																	{metric}
																</option>
															))}
													</select>
												</div>

												<div className="p-2">
													<label className="select-label">Ranking Metric</label>
													<select
														className="form-select form-select-sm m-0"
														name="ranking_metric"
														value={metricFormData.ranking_metric}
														onChange={handleChange}>
														<option value="">Select Ranking Metric</option>
														{metricData
															.find((metric) => metric.key === 'ranking_metric')
															?.values.map((metric, index) => (
																<option value={metric} key={index}>
																	{metric}
																</option>
															))}
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<div>
								{createdRecords && createdRecords.length > 0 && (
									<div className="py-3">
										<h5>
											<b>Ready To Create ({createdRecords.length})</b>
										</h5>
										<table className="newtable">
											<thead>
												<tr>
													<th>Metric Name</th>
													<th>Geo </th>
													<th>LOB</th>
													<th>RTM</th>
													<th>Same Day Domestic</th>
												</tr>
											</thead>
											<tbody>
												{createdRecords &&
													createdRecords.map((record, index) => {
														return (
															<tr key={index}>
																<td>
																	{metric.metric_name} - {record.lob}
																</td>
																<td>{record.geo}</td>
																<td>{record.lob}</td>
																<td>{record.rtm}</td>
																<td>{record.same_day_domestic}</td>
															</tr>
														);
													})}
											</tbody>
										</table>
									</div>
								)}

								{updatedRecords && updatedRecords.length > 0 && (
									<div className="py-3">
										<h5>
											<b>Already Exists ({updatedRecords.length})</b>
										</h5>
										<table className="newtable">
											<thead>
												<tr>
													<th>Metric Name</th>
													<th>Geo </th>
													<th>LOB</th>
													<th>RTM</th>
													<th>Same Day Domestic</th>
												</tr>
											</thead>
											<tbody>
												{updatedRecords &&
													updatedRecords.map((record, index) => {
														return (
															<tr key={index}>
																<td>
																	{metric.metric_name} - {record.lob}
																</td>
																<td>{record.geo}</td>
																<td>{record.lob}</td>
																<td>{record.rtm}</td>
																<td>{record.same_day_domestic}</td>
															</tr>
														);
													})}
											</tbody>
										</table>
									</div>
								)}
							</div>
						)}
					</div>

					<div className="footer">
						{page === 1 ? (
							<>
								<button
									className="btn btn-secondary"
									aria-label="Close"
									onClick={handleCancel}>
									Cancel
								</button>
								<button className="btn btn-primary" onClick={nextPage}>
									Next
								</button>
							</>
						) : (
							<>
								<button
									className="btn btn-secondary"
									aria-label="Close"
									onClick={handleCancel}>
									Cancel
								</button>
								<button
									className="btn btn-secondary"
									onClick={() => setPage(1)}>
									Back
								</button>
								<button
									className="btn btn-success"
									onClick={() =>
										updateMetrics(
											metric.metric_id,
											createdRecords,
											updatedRecords
										)
									}>
									Finish
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActionModal;
