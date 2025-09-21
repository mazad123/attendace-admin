import React, { useEffect, useState } from "react";
import moment from "moment";
import { httpClient } from "../../../constants/Api";
import { USER } from "../../../constants/AppConstants";
import "../../../assets/css/reports.css";
import EmployeeReport from "../components/EmployeeReport";
import ReportsFilters from "../components/ReportsFilters";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
function EmployeeAttendanceReport() {
	const [dates, setDates] = useState({
		from: moment().startOf("month").format("YYYY-MM-DD"),
		// from: moment().startOf("month"),
		to: moment().endOf("month").format("YYYY-MM-DD"),
		// to: moment().endOf("month"),
		active: "monthly",
	});

	const [isLoading, setLoading] = useState(false);
	const [totalDates, setTotalDates] = useState([]);
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [initalValue, setInitialValue] = useState("");
	const [selectedOption, setSelectedOption] = useState("currentMonth");
	const [attendanceEntryData, setAttendanceEntryData] = useState([]);
	const [leaveData, setLeaveData] = useState([]);
	const [publicHolidaysDate, setPublicHolidaysDate] = useState([]);
	const [todayOnLeaveData, setTodayOnLeaveData] = useState([]);

	useEffect(() => {
		getReportData();
		const selected_Dates = dates.from;
		setTotalDates(selected_Dates);
	}, [dates]);

	const getReportData = async () => {
		try {
			setLoading(true);
			const result = await httpClient.post(USER.GET_USER_LEAVE_REPORT, {
				from: dates.from,
				to: dates.to,
			});
			if (result.status === 200) {
				resetFilters();
				setPublicHolidaysDate(result.data.users.getPublicHolidaysDate);
				handleData(result.data.users);

				setLoading(false);
			}
		} catch (err) {
			setLoading(false);
		}
	};

	// attendance calculations
	const handleData = (data) => {
		const { totalUsers, leaves, entryDate, approvedTodaysLeaves } = data;
		totalUsers.map((user) => {
			// let filteredAbsent = []
			let filteredAbsent = leaves.filter(
				(leave) =>
					user?.emp_id === leave.user_id?.emp_id && leave.status === "absent"
			);

			// for (let rec of absent) {

			//   const check_present = entryDate.find((entry) => entry.user_id === rec.user_id.id
			//     && moment(entry.check_in,).isSame(rec.from, 'day'));
			//   if (check_present) {
			//     const indxValue = absent.findIndex((currentValue) => {
			//       return (moment(currentValue.from).isSame(check_present.entry_date, 'day'))
			//     });
			//     // console.log({ indxValue })
			//     if (indxValue < 0) {
			//       filteredAbsent.push(rec)
			//     }
			//   }
			//   else {
			//     filteredAbsent.push(rec)
			//   }
			// }

			const half_day = leaves.filter(
				(leave) =>
					user?.emp_id === leave.user_id?.emp_id &&
					leave.status === "approved" &&
					leave.duration === "Half Day"
			);
			const short_day = leaves.filter(
				(leave) =>
					user?.emp_id === leave.user_id?.emp_id &&
					leave.status === "approved" &&
					leave.duration === "Short Day"
			);

			const full_day = leaves.filter(
				(leave) =>
					user?.emp_id === leave.user_id?.emp_id &&
					leave.status === "approved" &&
					leave.duration === "Full Day"
			);

			let total_leaves = [];
			for (let days of full_day) {
				const dates = getDatesBetweenTwoDates(days.from, days.to);
				total_leaves = [...total_leaves, ...dates];

				// dates.map((date) => {
				// 	const check_present = entryDate.find((entry) =>
				// 		moment(entry.entry_date).isSame(date, "day")
				// 	);
				// 	if (!check_present) return (total_leaves = [...total_leaves, date]);
				// });
				// console.log({check_present})
			}

			user["absent"] = filteredAbsent.length;
			user["approved_leaves"] =
				half_day.length / 2 + short_day.length / 4 + total_leaves.length;
			return user;
		});

		const total_users = totalUsers.sort((a, b) => a.name.localeCompare(b.name));
		setFilteredData(total_users);
		setData(total_users);
		setAttendanceEntryData(entryDate);
		setLeaveData(leaves);
		setTodayOnLeaveData(approvedTodaysLeaves);
	};

	const handleDateRange = async (e) => {
		setSelectedOption("dateRange");
		const date_picker = e.target.value.split("-");
		if (!e.target.value) {
			setFilteredData([]);
			setDates({
				from: "",
				to: "",
				active: "monthly",
			});
		} else {
			const date = moment();
			date.set("year", date_picker[0]);
			date.set("month", date_picker[1] - 1);
			setDates({
				from: moment(date).startOf("month").format("YYYY-MM-DD"),
				// from: moment(date).startOf("month"),
				to: moment(date).endOf("month").format("YYYY-MM-DD"),
				// to: moment(date).endOf("month"),
				active: "monthly",
			});
		}
	};

	const getDatesBetweenTwoDates = (startDate, endDate) => {
		let date = [];
		while (moment(startDate).isSameOrBefore(endDate, "day")) {
			const manageDate = moment(startDate).format("YYYY-MM-DD");
			// if (moment(startDate).isSame(endDate, "month")) {
			date.push({ date: manageDate });
			// }
			startDate = moment(startDate).add(1, "day").format("YYYY-MM-DD");
		}
		return date;
	};
	const handleInitialValue = (letter) => {
		setInitialValue(letter);
		const result = data.filter((records) => {
			return (
				records.name.charAt(0).toLowerCase().search(letter.toLowerCase()) !== -1
			);
		});
		setFilteredData(result);
		setSearchValue("");
	};

	const handleSearch = (e) => {
		let result = [];
		setSearchValue(e.target.value);

		if (initalValue) {
			result = data.filter((records) => {
				return (
					records.name
						.charAt(0)
						.toLowerCase()
						.search(initalValue.toLowerCase()) !== -1 &&
					records.name.toLowerCase().includes(e.target.value.toLowerCase())
				);
			});
		} else {
			result = data.filter((records) => {
				return records.name
					.toLowerCase()
					.includes(e.target.value.toLowerCase());
			});
		}
		setFilteredData(result);
	};

	const resetFilters = () => {
		setSearchValue("");
		setInitialValue("");
		setFilteredData(data);
	};

	return (
		<>
			<div className="main_content_panel container">
				<div className="header_title d-block d-lg-flex">
					<h1>
						<span> Employee Leave</span> Reports
					</h1>

					<div className="define_leaves_color align-items-center">
						<ul className="mb-0 ps-0"></ul>
					</div>
				</div>
				<div className="repots_tab">
					<div className="row">
						<div className="col-lg-12">
							<ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
								<li className="nav-item" role="presentation">
									<button
										id="pills-contact-tab"
										data-bs-toggle="pill"
										data-bs-target="#pills-contact"
										type="button"
										role="tab"
										aria-controls="pills-contact"
										aria-selected="false"
										className={
											selectedOption === "currentMonth"
												? "btn btn-secondary calender_view me-4 active_btn"
												: "btn btn-secondary calender_view me-4 "
										}
										onClick={() =>
											setDates({
												from: moment()
													.subtract(1, "months")
													.startOf("month")
													.format("YYYY-MM-DD"),
												to: moment()
													.subtract(1, "months")
													.endOf("month")
													.format("YYYY-MM-DD"),
												active: "monthly",
											})
										}
									>
										<i className="fa fa-calendar-o me-2" aria-hidden="true"></i>
										Previous Month
									</button>
									<button
										id="pills-contact-tab"
										data-bs-toggle="pill"
										data-bs-target="#pills-contact"
										type="button"
										role="tab"
										aria-controls="pills-contact"
										aria-selected="false"
										className={
											selectedOption === "currentMonth"
												? "btn btn-secondary calender_view me-4 active_btn show active"
												: "btn btn-secondary calender_view me-4 "
										}
										onClick={() =>
											setDates({
												// from: moment().startOf("month"),
												from: moment().startOf("month").format("YYYY-MM-DD"),
												// to: moment().endOf("month"),
												to: moment().endOf("month").format("YYYY-MM-DD"),
												active: "monthly",
											})
										}
									>
										<i className="fa fa-calendar-o me-2" aria-hidden="true"></i>
										Current Month
									</button>
								</li>
								<li>
									<input
										type="month"
										value={moment(dates.from).format("YYYY-MM")}
										onChange={handleDateRange}
										max={moment().format("YYYY-MM")}
										className={
											selectedOption === "dateRange"
												? "btn btn-secondary calender_view me-4 active_btn show"
												: "btn btn-secondary calender_view me-4"
										}
									/>
								</li>
							</ul>
						</div>
					</div>

					<div className="filter_letters pt-3 rounded mt-2">
						<ReportsFilters
							searchValue={searchValue}
							handleSearch={handleSearch}
							handleInitialValue={handleInitialValue}
							initalValue={initalValue}
							resetFilters={resetFilters}
						/>
					</div>
					<div className="tab-content" id="pills-tabContent"></div>

					<div
						className="tab-pane fade show active"
						id="pills-contact"
						role="tabpanel"
						aria-labelledby="pills-contact-tab"
					>
						{!isLoading && dates.active === "monthly" && (
							<>
								<EmployeeReport
									data={filteredData}
									month={totalDates}
									attendanceEntryData={attendanceEntryData}
									leaveData={leaveData}
									getPublicHolidaysDate={publicHolidaysDate}
									todayOnLeaveData={todayOnLeaveData}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default EmployeeAttendanceReport;
