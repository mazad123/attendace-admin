import moment from "moment";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronCircleUp,
	faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import ReactExport from "react-export-excel";
import { toast } from "react-toastify";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function MonthlyReport({ data, month, getPublicHolidaysDate }) {
	const filterStartdate = month[0].date;
	const filterLastdate = month[month.length - 1].date;
	const [monthlyReports, setMonthlyReports] = useState([]);
	const [arr, setArr] = useState([]);
	const [checkAll, setCheckAll] = useState(false);
	useEffect(() => {
		setArr([]);
		setCheckAll(false);
		handleMonthlyData();
	}, [data, month]);

	const handleMonthlyData = () => {
		const weekEnds = getSatAndSundays();
		const addHolidays = data.map((e) => {
			if (!e.entry) {
				e.entry = [];
			}
			weekEnds.map((s) => {
				const checkSameDate = e.entry.filter((entry) =>
					moment(entry.date).isSame(s.date, "day")
				);
				if (checkSameDate.length <= 0) {
					e.entry.push(s);
				}
			});
			return e;
		});
		const fitlerMonthDates = addHolidays.map((d) => {
			const alpha = month.map((m) => {
				const previousEntry = d.entry.filter((entry) =>
					moment(m.date).isSame(entry.date, "day")
				);
				if (previousEntry.length === 0) {
					d.entry.push({ date: m.date, type: "-" });
				}
				return d.entry;
			});
			return d;
		});

		const newResult = fitlerMonthDates.map((e) => {
			const sortAttendence = e.entry.sort(
				(a, b) => new Date(a.date) - new Date(b.date)
			);
			e.entry = sortAttendence;
			return e;
		});

		const new_result = newResult.sort((a, b) =>
			a?.name?.localeCompare(b?.name)
		);

		setMonthlyReports(new_result);
	};

	const handleOnChange = (arr1) => {
		const arr2 = [...arr];
		if (arr2.indexOf(arr1) === -1) {
			arr2.push(arr1);
		} else {
			const index = arr2.indexOf(arr1);
			if (index > -1) {
				arr2.splice(index, 1);
			}
		}
		const arr3 = arr2.sort((a, b) => a?.name?.localeCompare(b?.name));
		setArr(arr3);
	};

	const handleChecked = (id) => {
		const checkbox = arr.filter((e) => e.emp_id === id);
		if (checkbox.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	console.log(arr);

	const handleCheckALL = (e) => {
		if (e.target.checked) {
			setCheckAll(true);
			const Data = data.sort((a, b) => a.name.localeCompare(b.name));
			setArr(Data);
		} else {
			setCheckAll(false);
			setArr([]);
		}
	};

	const handleSort = () => {
		const entries = [...monthlyReports];
		entries.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});
		setMonthlyReports(entries);
	};
	const handleDesort = () => {
		const entries = [...monthlyReports];
		entries.sort(function (a, b) {
			return b.name.localeCompare(a.name);
		});
		setMonthlyReports(entries);
	};

	const getSatAndSundays = () => {
		const totalSatAndSunInMonth = [];
		for (
			let startDate = moment(filterStartdate);
			startDate.isSameOrBefore(moment(filterLastdate));
			startDate.add(1, "days")
		) {
			if (startDate._d.getDay() == 0 || startDate._d.getDay() == 6) {
				totalSatAndSunInMonth.push({
					date: moment(startDate._d).format("YYYY-MM-DD"),
					type: "",
				});
			}
		}
		return totalSatAndSunInMonth;
	};

	return (
		<>
			{!arr.length ? (
				<button
					onClick={() =>
						toast.warn("Please check the checkbox to download the sheet")
					}
					className="btn btn-primary mt-3 mb-3"
				>
					Download as XLS
				</button>
			) : (
				<ExcelFile
					element={
						<button className="btn btn-primary mt-3 ">Download as XLS</button>
					}
					filename="Attendance Report"
				>
					<ExcelSheet data={arr} name="Monthly Report">
						<ExcelColumn label="Name" value="name" />
						{arr[0] &&
							arr[0].entry.map((data, i) =>
								moment(data.date).isSameOrBefore(moment()) ? (
									<ExcelColumn
										label={moment(data.date).format("YYYY/MM/DD")}
										value={(dat) => {
											return moment(data.date).isBefore(
												moment(dat.doj).format("YYYY-MM-DD")
											)
												? "-"
												: dat.entry[i].type === "P"
												? "P"
												: dat.entry[i].type === "HD"
												? "HD"
												: dat.entry[i].type === "SD"
												? "SD"
												: dat.entry[i].type === "L"
												? "L"
												: dat.entry[i].type === "A"
												? "A"
												: dat.entry[i].type === "-" &&
												  !getPublicHolidaysDate.includes(data.date)
												? "A"
												: dat.entry[i].type === " "
												? " "
												: dat.entry[i].type === "Comp Off"
												? "Comp Off"
												: "";
										}}
									/>
								) : (
									<ExcelColumn label={moment(data.date).format("YYYY/MM/DD")} />
								)
							)}
					</ExcelSheet>
				</ExcelFile>
			)}
			<div className="table-outer">
				<div className="report_table_main table-inner table-responsive">
					<table
						id="monthly"
						className="report_table table table-striped  mb-0 w-auto"
					>
						<thead>
							<tr>
								<th>
									{" "}
									<input
										type="checkbox"
										checked={checkAll}
										onChange={(e) => handleCheckALL(e)}
									/>
								</th>
								<th>#</th>
								<th>
									Name{" "}
									<span>
										<FontAwesomeIcon
											icon={faChevronCircleUp}
											style={{ cursor: "pointer" }}
											onClick={handleSort}
										/>
										<FontAwesomeIcon
											icon={faChevronCircleDown}
											style={{ cursor: "pointer" }}
											onClick={handleDesort}
										/>
									</span>
								</th>
								{month &&
									month.map((m, i) => (
										<th key={i}>{moment(m.date).format("YYYY/MM/DD")}</th>
									))}
							</tr>
						</thead>
						<tbody>
							{monthlyReports &&
								monthlyReports.map((d, i) => (
									<tr key={i}>
										<td>
											<input
												type="checkbox"
												checked={handleChecked(d.emp_id)}
												onChange={(e) => handleOnChange(d)}
											/>
										</td>

										<td>
											{" "}
											<span className="number">{i + 1}</span>
										</td>

										<td>{d.name}</td>
										{d.entry.map((a, i) =>
											moment(moment(a.date).format("YYYY-MM-DD")).isBefore(
												moment(d.doj).format("YYYY-MM-DD")
											) ? (
												<td>-</td>
											) : moment(
													moment(a.date).format("YYYY-MM-DD")
											  ).isSameOrBefore(moment().format("YYYY-MM-DD")) ? (
												<td
													key={i}
													className={
														a.type === "HD" || a.type === "SD"
															? "half_leave"
															: a.type === "L" || a.type === "Comp Off"
															? "full_leave"
															: a.type === "A"
															? "absent"
															: a.type === "-" &&
															  !getPublicHolidaysDate.includes(a.date)
															? "absent"
															: a.type === "P"
															? "present"
															: a.type === "" ||
															  getPublicHolidaysDate.includes(a.date)
															? "holiday"
															: ""
													}
												>
													{a.type === "HD" ||
													a.type === "SD" ||
													a.type === "L" ||
													a.type === "Comp Off" ||
													a.type === "A" ||
													a.type === "P" ||
													a.type === "" ? (
														a.type
													) : a.type === "-" &&
													  !getPublicHolidaysDate.includes(a.date) ? (
														"A"
													) : (
														<span style={{ color: "transparent" }}>-</span>
													)}
												</td>
											) : (
												<td></td>
											)
										)}
									</tr>
								))}
						</tbody>
					</table>
					{data.length <= 0 && (
						<div className="d-flex justify-content-center">
							<h5>No Records to Display.</h5>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default memo(MonthlyReport);
