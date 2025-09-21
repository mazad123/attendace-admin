import React, { useEffect, useState } from "react";
import moment from "moment";
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
function WeeklyReport({ data, week, getPublicHolidaysDate }) {
	const [weeklyReports, setWeeklyReports] = useState([]);
	const [arr, setArr] = useState([]);
	const [checkAll, setCheckAll] = useState(false);

	useEffect(() => {
		setArr([]);
		setCheckAll(false);
		handleWeeklyData();
	}, [week, data]);

	const handleWeeklyData = () => {
		const saturday = getSaturdays();
		const sunday = getSundays();
		const weekEnds = [...saturday, ...sunday];
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
			const alpha = week.map((m) => {
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

		setWeeklyReports(new_result);
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
		const entries = [...weeklyReports];
		entries.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});
		setWeeklyReports(entries);
	};
	const handleDesort = () => {
		const entries = [...weeklyReports];
		entries.sort(function (a, b) {
			return b.name.localeCompare(a.name);
		});
		setWeeklyReports(entries);
	};

	const getSundays = () => {
		const sundays = [];
		const sunday = moment().endOf("week").add(1, "day").format();
		sundays.push({ date: sunday, type: "" });

		return sundays;
	};

	const getSaturdays = () => {
		const saturdays = [];
		const saturday = moment().endOf("week").format();
		saturdays.push({ date: saturday, type: "" });

		return saturdays;
	};
	const download = () => {
		setArr(arr);
		if (arr.length === 0) {
			toast.warning("Please Check the Checkbox to download the sheet");
		}
		// For creating alert on download button if arr is empty.
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
						<button onClick={download} className="btn btn-primary mt-3 ">
							Download as XLS
						</button>
					}
					filename="Attendance Report"
					// a.type === "HD" || a.type === "SD"
					// ? "half_leave"
					// : a.type === "L" || a.type === "Comp Off"
					// ? "full_leave"
					// : a.type === "A"
					// ? "absent"
					// : a.type === "-" &&
					//   !getPublicHolidaysDate.includes(a.date)
					// ? "absent"
					// : a.type === "P"
					// ? "present"
					// : a.type === "" ||
					//   getPublicHolidaysDate.includes(a.date)
					// ? "holiday"
					// : ""
				>
					<ExcelSheet data={arr} name="Weekly Report">
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
												: dat.entry[i].type === ""
												? ""
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
			<div className="report_table_main">
				<table
					id="weekly"
					className="report_table table table-striped mb-0 w-100"
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
							{week.map((w, i) => (
								<th key={i}>{moment(w.date).format("YYYY/MM/DD")}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{weeklyReports.map((d, i) => (
							<tr key={i}>
								<td>
									<input
										type="checkbox"
										checked={handleChecked(d.emp_id)}
										onChange={(e) => handleOnChange(d)}
									/>
								</td>
								<td>{i + 1}</td>
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
		</>
	);
}

export default WeeklyReport;
