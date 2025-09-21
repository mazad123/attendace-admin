import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
	Popover,
	OverlayTrigger,
	Modal,
	Container,
	Button,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import EditAttendence from "../components/Modals/EditAttendence";
import EditWorkingTime from "../components/Modals/EditWorkingTime";
import UrgentLeave from "../components/Modals/UrgentLeave";
import { httpClient } from "../../../constants/Api";
import {
	USER,
	ATTENDENCE,
	LEAVES,
	IMPORTANT_DATES,
} from "../../../constants/AppConstants";
import LeavesApplied from "../components/LeavesApplied";
import ConfirmDialog from "../../common/ConfirmDialog";
import { useHistory } from "react-router-dom";
import AddAttendanceModal from "../components/Modals/AddAttendanceModal";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const WeekendOff = {
	// color: "white",
	background: "#00aba9",
};

const PublicHoliday = {
	// color: "white",
	// background: "#bfff00",
	background: "#00aba9",
};

const UserOnLeave = {
	// color: "white",
	background: "#faaf19",
};

const AbsentUserClass = {
	background: "#b91515",
};

function EmployeeAttendenceDetail() {
	const ref = useRef();
	const btnRef = useRef();
	const userDetail = useSelector((state) => state.user.user.user);
	const { userId } = useParams();
	const [user, setUser] = useState("");
	const [currentSession, setCurrentSession] = useState("");
	const [selectedAttendance, setSelectedAttendance] = useState();
	const [attendenceDetail, setAttendenceDetail] = useState([]);
	const [openEditWorkTimeModal, setOpenEditWorkTimeModal] = useState(false);
	const [urgentLeaveModal, setUrgentLeaveModal] = useState(false);
	const [editAttendence, setEditAttendence] = useState({
		openModal: false,
		attendenceData: "",
	});
	const [addAttendence, setAddAttendence] = useState({
		openModal: false,
		attendenceData: "",
	});
	const [selectedOption, setSelectedOption] = useState("currentMonth");
	const [focus, setFocus] = useState(false);
	const [markAbsent, setMarkAbsent] = useState(false);
	const [checkOnLeave, setCheckOnLeave] = useState(false);
	const [selectedDateRange, setSelectedDateRange] = useState([]);
	const [importantDates, setImportantDates] = useState([]);
	const [userApprovedLeaves, setUserApprovedLeaves] = useState([]);
	const [chekoutImagelink, setCheckoutImageLink] = useState(null);

	let history = useHistory();
	useEffect(() => {
		getImportantDates();
		getUserLeaves();
		getUserDetail();
		checkTodayOnLeave();
	}, []);

	useEffect(() => {
		const dateRangeArray = getDatesInRange(moment().startOf("month"), moment());
		setSelectedDateRange(dateRangeArray);
		getCurrentMonthAttendence(dateRangeArray);
		getUserCurrentSession();
	}, [user]);

	const getDatesInRange = (startDate, endDate) => {
		var dates = [];
		var currDate = moment(startDate).startOf("day");
		var lastDate = moment(endDate).startOf("day");
		dates.push(currDate.clone().toDate());
		if (!moment(currDate).isSame(lastDate)) {
			while (currDate.add(1, "days").diff(lastDate) < 0) {
				// console.log(currDate.toDate());
				dates.push(currDate.clone().toDate());
			}
			dates.push(lastDate.clone().toDate());
		}
		return dates;
	};

	const getUserLeaves = async () => {
		try {
			await httpClient
				.get(`${LEAVES.GET_USER_APPROVED_LEAVES}`.replace("{id}", userId))
				.then((res) => {
					if (res.status === 200) {
						console.log("approved leaves", res.data.leaves);
						setUserApprovedLeaves(res.data.leaves);
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const deleteTimeOut = async (e, id) => {
		const attandence_id = id;
		try {
			await httpClient
				.post(ATTENDENCE.DELETE_TIMEOUT.replace("{id}", attandence_id))
				.then(async (res) => {
					if (res.status === 200) {
						toast.success("Checkout Time Removed Successfully");
						getUserCurrentSession();
						getCurrentMonthAttendence(selectedDateRange);
					}
				})
				.catch((err) => {
					console.log(err);
					if (err.response) {
						toast.error(err.response.data.message);
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const getUserDetail = async () => {
		try {
			await httpClient
				.get(USER.GET_BY_ID.replace("{id}", userId))
				.then((res) => {
					if (res.status === 200) {
						console.log({ userData: res.data });
						setUser(res.data.user);
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const getImportantDates = async () => {
		try {
			const response = await httpClient.get(IMPORTANT_DATES.get);
			if (response.status === 200) {
				console.log(response.data);
				setImportantDates(response.data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const checkTodayOnLeave = async () => {
		try {
			const result = await httpClient.get(
				LEAVES.TODAY_ON_LEAVE.replace("{id}", userId)
			);
			if (result.status === 200) {
				setCheckOnLeave(result.data.onLeave);
			}
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	const getUserCurrentSession = async () => {
		try {
			await httpClient
				.get(ATTENDENCE.GET_CURRENT_SESSION.replace("{id}", userId))
				.then((res) => {
					if (res.status === 200) {
						setCurrentSession(res.data.result);
						btnRef.current.click();
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						console.log(err);
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const getCurrentMonthAttendence = async () => {
		const dateRangeArray = getDatesInRange(moment().startOf("month"), moment());
		try {
			await httpClient
				.get(ATTENDENCE.GET_CURRENT_MONTH_ATTENDENCE.replace("{id}", userId))
				.then((res) => {
					if (res.status === 200) {
						setDataToBind(res.data.result, dateRangeArray);
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const handleDateRange = async (event, picker) => {
		const dateRangeArray = getDatesInRange(picker.startDate, picker.endDate);
		console.log({ dateRangeArray });
		setSelectedDateRange(dateRangeArray);
		try {
			await httpClient
				.post(
					ATTENDENCE.GET_SELECTED_RANGE_ATTENDENCE.replace("{id}", userId),
					{ start: picker.startDate, end: picker.endDate }
				)
				.then((res) => {
					if (res.status === 200) {
						setDataToBind(res.data.result, dateRangeArray);
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (error) {
			console.log(error);
		}
	};

	const setDataToBind = async (response, dateRangeArray) => {
		console.log("setDatatoBind", response);
		try {
			await httpClient
				.get(USER.GET_BY_ID.replace("{id}", userId))
				.then((res) => {
					if (res.status === 200) {
						response.map((data) => {
							let breakTime = [];
							if (data.breaks) {
								data.breaks.map((getTime) => {
									let startTime = "";
									let endTime = "";
									if (getTime.start && getTime.end) {
										startTime = moment(getTime.start);
										endTime = moment(getTime.end);
										const mins = endTime.diff(startTime, "s");
										breakTime.push(mins);
									} else if (
										getTime.start &&
										!data.check_out &&
										moment(data.entry_date).isBefore(
											moment().format("YYYY-MM-DD")
										)
									) {
										startTime = moment(getTime.start);
										// endTime = moment(
										//   moment(data.check_in).format("YYYY-MM-DD") +
										//   user.out_time,
										//   "YYYY-MM-DD hh:mm"
										// );
										endTime = moment(getTime.start);
										const mins = endTime.diff(startTime, "s");
										breakTime.push(mins);
									}
								});
							}
							if (data.breaks.length) {
								let breaksStatusValue = data.breaks[data.breaks.length - 1];
								if (breaksStatusValue.start && !breaksStatusValue.end) {
									let status = 1;
									data.breakStatus = status;
								}
							} else {
								let status = 0;
								data.breakStatus = status;
							}
							let totalBreak = breakTime.reduce((a, b) => a + b, 0);
							var hours = totalBreak / 3600;
							var breakHour = Math.floor(hours);
							var minutes = (hours - breakHour) * 60;
							var breakMinutes = Math.round(minutes);
							if (breakHour === 0 && breakMinutes === 0) {
								data.totalBreakTime = "-";
							} else {
								data.totalBreakTime =
									breakHour + " Hr " + breakMinutes + " Mins";
							}
							const checkIN = moment(data.check_in);
							let checkOut = "";
							const checkOutMeridian = moment(
								moment(data.check_in).format("YYYY-MM-DD") +
								"T" +
								res.data.user.out_time,
								"YYYY-MM-DDTHH:mm:ss"
							).format("A");
							const checkInMeridian = moment(data.check_in).format("A");
							if (
								((data.breaks && data.breaks.length === 0 && !data.check_out) ||
									(!data.check_out &&
										data.breaks &&
										data.breaks.length > 0 &&
										(!data.breaks[data.breaks.length - 1].end ||
											moment(data.breaks[data.breaks.length - 1].end).isBefore(
												moment(data.check_in).format("YYYY-MM-DD") +
												"T" +
												res.data.user.out_time,
												"YYYY-MM-DDTHH:mm:ss"
											)))) &&
								moment(data.entry_date).isBefore(moment().format("YYYY-MM-DD"))
							) {
								if (
									(checkInMeridian === "AM" && checkOutMeridian === "PM") ||
									(checkInMeridian === "PM" && checkOutMeridian === "PM")
								) {
									checkOut = moment(
										moment(data.check_in).format("YYYY-MM-DD") +
										"T" +
										res.data.user.out_time,
										"YYYY-MM-DDTHH:mm:ss"
									);
								} else {
									checkOut = moment(
										moment(data.check_in).format("YYYY-MM-DD") +
										"T" +
										res.data.user.out_time,
										"YYYY-MM-DDTHH:mm:ss"
									).add(1, "days");
								}
								const totalWorking = checkOut.diff(checkIN, "s");
								console.log({ totalWorking });
								const working = totalWorking - totalBreak;
								console.log({ working });
								var workingHours = working / 3600;
								console.log({ workingHours });
								var totalWorkingHour = Math.floor(workingHours);
								console.log({ totalWorkingHour });
								var totalWorkingMin = (workingHours - totalWorkingHour) * 60;
								console.log({ totalWorkingMin });
								data.totalWorkingTime =
									totalWorkingHour +
									":" +
									(totalWorkingMin < 10
										? "0" + Math.floor(totalWorkingMin)
										: Math.floor(totalWorkingMin)) +
									" (HH:MM)";
							} else if (
								!data.check_out &&
								data.breaks &&
								data.breaks.length > 0 &&
								data.breaks[data.breaks.length - 1].end &&
								moment(data.breaks[data.breaks.length - 1].end).isAfter(
									moment(data.check_in).format("YYYY-MM-DD") +
									"T" +
									res.data.user.out_time,
									"YYYY-MM-DDTHH:mm:ss"
								) &&
								moment(data.entry_date).isBefore(moment().format("YYYY-MM-DD"))
							) {
								if (
									(checkInMeridian === "AM" && checkOutMeridian === "PM") ||
									(checkInMeridian === "PM" && checkOutMeridian === "PM")
								) {
									checkOut = moment(
										// moment(data.check_in).format("YYYY-MM-DD") +
										// "T" +
										// res.data.user.out_time,
										data.breaks[data.breaks.length - 1].end
										// "YYYY-MM-DDTHH:mm:ss"
									);
								} else {
									checkOut = moment(
										moment(data.check_in).format("YYYY-MM-DD") +
										"T" +
										res.data.user.out_time,
										"YYYY-MM-DDTHH:mm:ss"
									).add(1, "days");
								}
								const totalWorking = checkOut.diff(checkIN, "s");
								const working = totalWorking - totalBreak;
								var workingHours = working / 3600;
								var totalWorkingHour = Math.floor(workingHours);
								var totalWorkingMin = (workingHours - totalWorkingHour) * 60;
								data.totalWorkingTime =
									totalWorkingHour +
									":" +
									(totalWorkingMin < 10
										? "0" + Math.floor(totalWorkingMin)
										: Math.floor(totalWorkingMin)) +
									" (HH:MM)";
							}
						});
						// setAttendenceDetail(response);
						handleDataAccordingToDateRanges(response, dateRangeArray);
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const handleDataAccordingToDateRanges = async (
		attendanceData,
		dateRangeArray
	) => {
		console.log({ attendanceData });
		const newDataArray = [];
		for (const day of dateRangeArray) {
			const dateOfJoining = moment(user.doj).format("L");
			const formattedDay = moment(day).format("L");
			if (moment(formattedDay).isSameOrAfter(dateOfJoining)) {
				const entryData = attendanceData.find((data) =>
					moment(formattedDay).isSame(moment(data.entry_date).format("L"))
				);
				const isPublicHoliday = importantDates.find((data) =>
					moment(formattedDay).isSame(moment(data.date).format("L"))
				);
				const isUserOnLeave = await checkAttenddanceOnUserLeaves(formattedDay);
				if (entryData) {
					const newEntryData = {
						...entryData,
						isPublicHoliday: isPublicHoliday ? true : false,
						dayOfWeek: moment(day).day(),
					};
					newDataArray.push(newEntryData);
				} else {
					newDataArray.push({
						user_id: attendanceData.user_id,
						entry_date: day,
						dayOfWeek: moment(day).day(),
						isPublicHoliday: isPublicHoliday ? true : false,
						isOnLeave: isUserOnLeave ? true : false,
					});
				}
			}
		}
		console.log({ newDataArray });
		setAttendenceDetail(newDataArray);
	};

	const checkAttenddanceOnUserLeaves = (formattedDay) => {
		const leavesArray = [];
		for (let leaveEntry of userApprovedLeaves) {
			const fromDate = moment(leaveEntry.from).format("L");
			const toDate = moment(leaveEntry.to).format("L");
			const isExist =
				moment(formattedDay).isSameOrAfter(fromDate) &&
				moment(formattedDay).isSameOrBefore(toDate);
			if (isExist) {
				leavesArray.push(leaveEntry);
			}
		}
		return leavesArray.length ? true : false;
	};

	const closeModal = (res) => {
		setOpenEditWorkTimeModal(false);
		setUrgentLeaveModal(false);
		setEditAttendence(false);
		setAddAttendence(false);
		setMarkAbsent(false);
		console.log({ res });
		if (res) {
			getUserDetail();
			getCurrentMonthAttendence();
		}
	};

	const getWorkingHours = (intime, outtime) => {
		const inTime = moment(intime, "hh:mm");
		const outTime = moment(outtime, "HH:mm");
		const duration = moment.duration(outTime.diff(inTime));
		const hours = duration.get("hours");
		const minutes = duration.get("minutes");
		return moment(`${hours}:${minutes}`, "h:m").format("hh:mm");
	};

	const formatTime = (time) => {
		return moment(time, "h:m").format("hh:mm A");
	};

	const handlePendingLeaves = async () => {
		const data = ref.current.innerText;
		setFocus(false);
		try {
			await httpClient
				.put(USER.UPDATE_USER.replace("{id}", userId), { pending_leaves: data })
				.then((res) => {
					if (res.status === 200) {
						getUserDetail();
					}
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const handleOnFocus = async () => {
		setFocus(true);
	};

	const handleMarkAbsent = async () => {
		try {
			const currentUser = JSON.parse(localStorage.getItem('user')).user.id
			const result = await httpClient.post(
				LEAVES.MARK_ABSENT.replace("{id}", userId),{ current_user: currentUser }
			);
			if (result.status === 200) {
				toast.success(result.data.message);
				checkTodayOnLeave();
				closeModal(true);
			}
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	const handleStatusClick = () => {
		history.push(`/project/get-project-detail/general-project-user/${userId}`);
	};

	const handleSubmit = async (value) => {
		let attendenceRecord = attendenceDetail.find(
			(att) => att._id === selectedAttendance
		);
		attendenceRecord.work_from = value;
		try {
			await httpClient
				.put(
					ATTENDENCE.UPDATE_ATTENDENCE.replace("{id}", userId),
					attendenceRecord
				)
				.then((res) => {
					toast.success(res.data.message);
					setSelectedAttendance(null);
				})
				.catch((err) => {
					if (err.response) {
						toast.error(err.response.data.message);
					} else {
						toast.error("Something went wrong");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};
	const updateWorkStatus = (e) => {
		handleSubmit(e.target.value);
	};

	return (
		<>
			<div className="main_content_panel">
				<div className="header_title">
					<h1>
						<span>Employee</span> Attendance Detail
					</h1>
				</div>
				<div className="row">
					<div className="col-lg-12 mb-4">
						<div className="dashboard_card p-0">
							<div className="employee_profile">
								<div className="row">
									<div className="col-lg-4">
										<div className="user_profile text-center">
											<div className="profile_img mb-4">
												<img
													src={user?.profile_image}
													alt=""
													className="img-fluid"
												/>
											</div>
											<h4>{user?.name}</h4>
											<p>{user?.designation}</p>
										</div>
									</div>
									<div className="col-lg-8">
										<div className="card_title admin_heading">
											<h4>Working Time</h4>
											<div style={{ display: "flex" }}>
												<div className="leaves_remain">
													Leaves Pending:{" "}
													<span
														className={
															focus ? "edit_pending_leaves" : "pending_leaves"
														}
														ref={ref}
														suppressContentEditableWarning={true}
														contentEditable="true"
														onBlur={handlePendingLeaves}
														onFocus={handleOnFocus}
													>
														{/* {user?.pending_leaves >= 0
                              ? user?.pending_leaves
                              : 0} */}
														{user?.pending_leaves}
													</span>
												</div>
												{userDetail.role.role === "Super Admin" && (
													<button
														type="button"
														className="btn btn-primary"
														style={{
															padding: "7px 33px",
															marginTop: "10px",
														}}
														onClick={() => handleStatusClick()}
													>
														Status Updates
													</button>
												)}
											</div>
										</div>

										<div className="time_spend">
											<h4>
												{getWorkingHours(user?.in_time, user?.out_time)}hr|{" "}
												<span className="timein">
													{user?.in_time
														? formatTime(user?.in_time)
														: "-- : --"}
												</span>{" "}
												-{" "}
												<span className="timeout">
													{" "}
													{user?.out_time
														? formatTime(user?.out_time)
														: "-- : --"}
												</span>
												{(userDetail.role.role === "Super Admin" ||
													userDetail.role.role === "HR") && (
														<span>
															<button
																title="Request for time change"
																className="edit_emp_detail ms-2 pb-1 pt-1 table_btn"
																// data-bs-toggle="modal"
																// data-bs-target="#exampleModal3"
																onClick={() => setOpenEditWorkTimeModal(true)}
															>
																<i
																	className="fa fa-pencil-square-o"
																	aria-hidden="true"
																></i>
															</button>
														</span>
													)}
											</h4>
										</div>
										<div className="card_title admin_heading">
											<h4>
												Current Session
												{currentSession?.work_from
													? currentSession.work_from === "office"
														? "(WFO)"
														: "(WFH)"
													: ""}
											</h4>
											{(userDetail.role.role === "Super Admin" ||
												userDetail.role.role === "HR") && (
													<div>
														<button
															type="button"
															className="btn btn-danger mx-2"
															onClick={() => setMarkAbsent(true)}
															disabled={checkOnLeave}
														>
															Mark Absent
														</button>
														<button
															type="button"
															className="btn btn-primary"
															onClick={() => setUrgentLeaveModal(true)}
															disabled={checkOnLeave}
														>
															Grant Urgent Leave
														</button>
													</div>
												)}
										</div>
										<div className="time_cards">
											<div className="time_card_base">
												<h3 className="color_blue">TIME IN </h3>
												<p>
													{currentSession?.check_in
														? moment(currentSession?.check_in).format("hh:mm A")
														: "-- : --"}
												</p>
												<div className="edit_btn"></div>
											</div>
											<div className="time_card_base">
												<h3 className="text_green">Breaks </h3>
												{/* <p>
                          <span>01:30 PM </span> - <span>02:15 PM</span>
                        </p> */}
												{currentSession?.breaks?.length > 0
													? currentSession.breaks.map((br, i) => (
														<p key={i}>
															<span>
																{br?.start
																	? moment(br.start).format("hh:mm A")
																	: "-- : --"}{" "}
															</span>{" "}
															-{" "}
															<span>
																{br?.end
																	? moment(br.end).format("hh:mm A")
																	: "-- : --"}
															</span>
														</p>
													))
													: "-- : --"}
												<div className="edit_btn"></div>
											</div>
											<div className="time_card_base">
												<h3 className="color_red">TIME Out </h3>
												<p>
													{currentSession?.check_out
														? moment(currentSession?.check_out).format(
															"hh:mm A"
														)
														: "-- : --"}
												</p>
												{(userDetail.role.role === "Super Admin" ||
													userDetail.role.role === "HR") &&
													(currentSession?.check_out ? (
														<div className="edit_btn">
															<button
																onClick={(e) =>
																	deleteTimeOut(e, currentSession?._id)
																}
																title="Delete Time Out"
																className="edit_emp_detail table_btn mx-1"
																style={{ cursor: "pointer" }}
															>
																<i
																	className="fa fa-trash"
																	aria-hidden="true"
																></i>
															</button>
														</div>
													) : (
														""
													))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{(userDetail.role.role === "Super Admin" ||
						userDetail.role.role === "HR") && (
							<div className="col-lg-12  mb-4">
								<LeavesApplied userId={userId} getUserDetail={getUserDetail} />
							</div>
						)}
					<div className="col-lg-12">
						<div className="dashboard_card employee_lists">
							<div className="card_title calender_heading">
								<h4>Employee Details</h4>
								<div className="btn-groups">
									<button
										ref={btnRef}
										type="button"
										className={
											selectedOption === "currentMonth"
												? "btn btn-secondary calender_view me-4 active_btn"
												: "btn btn-secondary calender_view me-4"
										}
										onClick={() => getCurrentMonthAttendence()}
									>
										<i className="fa fa-calendar-o me-2" aria-hidden="true"></i>
										Current Month
									</button>
									<DateRangePicker
										onApply={handleDateRange}
										initialSettings={{
											startDate: moment(),
											endDate: moment(),
											maxDate: moment(),
										}}
									>
										<button
											type="button"
											className={
												selectedOption === "dateRange"
													? "btn btn-secondary calender_view me-4 active_btn"
													: "btn btn-secondary calender_view me-4"
											}
										>
											<i
												className="fa fa-calendar-o me-2"
												aria-hidden="true"
											></i>
											Select Date Range
										</button>
									</DateRangePicker>
								</div>
							</div>

							{/* <div className="employee_table" onClick={() =>  setSelectedAttendance(null)}> */}
							<div className="employee_table">
								{/* <table className="table table-hover" onClick={() =>  setSelectedAttendance(null)}> */}
								<table className="table table-hover">
									<thead>
										<tr>
											<th scope="col">Date</th>
											<th scope="col">Time In</th>
											<th scope="col" style={{ maxWidth: "160px" }}>
												Time In Location
											</th>
											<th scope="col">Break Time </th>
											<th scope="col">Time Out</th>
											<th scope="col" style={{ maxWidth: "160px" }}>
												Time Out Location
											</th>
											<th scope="col">Total Time</th>
											<th scope="col">Work Status</th>
											{(userDetail.role.role === "Super Admin" ||
												userDetail.role.role === "HR") && (
													<th scope="col">Action</th>
												)}
										</tr>
									</thead>
									{/* <tbody onClick={() =>  setSelectedAttendance(null)}> */}
									<tbody>
										{selectedDateRange.length > 0 &&
											attendenceDetail?.map((attendence, i) =>
												attendence.check_in ? (
													<tr key={i}>
														<td>{moment(attendence.entry_date).format("L")}</td>
														<td>
															{moment(attendence.check_in).format("hh:mm A")}
														</td>
														<td>
															{attendence.check_in_location ? (
																<OverlayTrigger
																	placement="right"
																	// trigger="hover"
																	rootClose
																	overlay={
																		<Popover>
																			<Popover.Title as="h6">
																				Time In Location
																			</Popover.Title>
																			<Popover.Content>
																				{attendence.check_in_location.formatted_address}
																			</Popover.Content>
																		</Popover>
																	}
																>
																	<span
																		style={{
																			maxWidth: "155px",
																			display: "inline-block",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																			cursor: "pointer",
																		}}
																	>
																		{attendence.check_in_location.formatted_address}
																	</span>
																</OverlayTrigger>
															) : (
																<span></span>
															)}
														</td>
														<td>{attendence.totalBreakTime}</td>
														<td>
															{attendence.check_out
																? moment(attendence.check_out).format("hh:mm A")
																: !attendence.check_out &&
																	attendence.breaks &&
																	attendence.breaks.length > 0 &&
																	attendence.breaks[
																		attendence.breaks.length - 1
																	].start &&
																	attendence.breaks[
																		attendence.breaks.length - 1
																	]?.end &&
																	//  moment(attendence.breaks[attendence.breaks.length-1].start).isBefore(moment(
																	//  moment(attendence.check_in).format("YYYY-MM-DD") + "T" + user.out_time, "YYYY-MM-DDTHH:mm:ss")) &&
																	moment(
																		attendence.breaks[
																			attendence.breaks.length - 1
																		]?.end
																	).isAfter(
																		moment(
																			moment(attendence.check_in).format(
																				"YYYY-MM-DD"
																			) +
																			"T" +
																			user.out_time,
																			"YYYY-MM-DDTHH:mm:ss"
																		)
																	) &&
																	moment(attendence.entry_date).isBefore(
																		moment().format("YYYY-MM-DD")
																	)
																	? moment(
																		attendence.breaks[
																			attendence.breaks.length - 1
																		]?.end
																	).format("hh:mm A")
																	: (!attendence.breaks[
																		attendence.breaks.length - 1
																	]?.end ||
																		!attendence.check_out) &&
																		moment(attendence.entry_date).isBefore(
																			moment().format("YYYY-MM-DD")
																		)
																		? formatTime(user?.out_time)
																		: ""}
														</td>
														<td>
															{attendence.location ? (
																<OverlayTrigger
																	placement="right"
																	// trigger="hover"
																	rootClose
																	overlay={
																		<Popover>
																			<Popover.Title as="h6">
																				Time Out Location
																			</Popover.Title>
																			<Popover.Content>
																				{attendence.location.formatted_address}
																			</Popover.Content>
																		</Popover>
																	}
																>
																	<span
																		style={{
																			maxWidth: "155px",
																			display: "inline-block",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																			cursor: "pointer",
																		}}
																	>
																		{attendence.location.formatted_address}
																	</span>
																</OverlayTrigger>
															) : (
																<span></span>
															)}
														</td>
														<td>
															{attendence.working_hours
																? `${attendence.working_hours} (HH:MM)`
																: attendence.totalWorkingTime}
														</td>
														<td>
															{selectedAttendance !== attendence._id && (
																<Link
																	onClick={() =>
																		setSelectedAttendance(attendence._id)
																	}
																>
																	{attendence.work_from
																		? attendence.work_from === "office"
																			? "WFO"
																			: "WFH"
																		: "-"}{" "}
																</Link>
															)}
															{selectedAttendance == attendence._id && (
																<select
																	onChange={updateWorkStatus}
																	value={attendence.work_from}
																	onBlur={() => setSelectedAttendance(null)}
																>
																	<option value="office">WFO</option>
																	<option value="home">WFH</option>
																</select>
															)}
														</td>
														{(userDetail.role.role === "Super Admin" ||
															userDetail.role.role === "HR") && (
																<td>
																	{/* <button className="view_emp_detail table_btn mx-1">
                            <i className="fa fa-eye" aria-hidden="true"></i>
                          </button> */}
																	<button
																		title="Update Time"
																		className="edit_emp_detail table_btn"
																		onClick={() =>
																			setEditAttendence({
																				openModal: true,
																				attendenceData: attendence,
																			})
																		}
																	>
																		<i
																			className="fa fa-pencil-square-o"
																			aria-hidden="true"
																		></i>
																	</button>
																	{attendence.user_image ? (
																		<button
																			title="View image"
																			className="edit_emp_detail table_btn"
																			onClick={() =>
																				setCheckoutImageLink(
																					attendence.user_image
																				)
																			}
																			style={{ marginLeft: "5px" }}
																		>
																			<i
																				className="fa fa-image"
																				aria-hidden="true"
																			></i>
																		</button>
																	) : (
																		<span></span>
																	)}
																</td>
															)}
													</tr>
												) : (
													<tr
														style={
															attendence.dayOfWeek === 0 && !attendence.isOnLeave ||
																attendence.dayOfWeek === 6 && !attendence.isOnLeave
																? WeekendOff
																: attendence.isPublicHoliday && !attendence.isOnLeave
																	? PublicHoliday
																	: attendence.isOnLeave
																		? UserOnLeave
																		: AbsentUserClass
														}
													>
														<td>{moment(attendence.entry_date).format("L")}</td>
														<td> -- </td>
														<td> -- </td>
														<td> -- </td>
														<td> -- </td>
														<td> -- </td>
														<td> -- </td>
														<td>
															{(attendence.dayOfWeek === 0 ||
																attendence.dayOfWeek === 6 ) && !attendence.isOnLeave ? (
																<>WEEKOFF</>
															) : attendence.isPublicHoliday && !attendence.isOnLeave ? (
																<>HOLIDAY</>
															) : attendence.isOnLeave ? (
																<>ON LEAVE</>
															) : (
																<>ABSENT</>
															)}
														</td>
														<td>
															{" "}
															<button
																title="Add Entry"
																className="edit_emp_detail table_btn"
																onClick={() =>
																	setAddAttendence({
																		openModal: true,
																		attendenceData: attendence,
																	})
																}
															>
																<i
																	className="fa fa-plus-square-o"
																	aria-hidden="true"
																></i>
															</button>
														</td>
													</tr>
												)
											)}
										{/* <tr>
                      <td>20/6/2021</td>
                      <td colSpan="5" className="text-danger">
                        Leave
                      </td>
                    </tr> */}
									</tbody>
								</table>
							</div>
							{attendenceDetail.length <= 0 && (
								<div className="d-flex justify-content-center">
									<h5>No Records to Display.</h5>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{openEditWorkTimeModal && (
				<EditWorkingTime
					show={openEditWorkTimeModal}
					close={closeModal}
					data={user}
					userId={userId}
				/>
			)}
			{urgentLeaveModal && (
				<UrgentLeave
					show={urgentLeaveModal}
					close={closeModal}
					data={user}
					userId={userId}
					handleUserOnLeave={checkTodayOnLeave}
				/>
			)}
			{editAttendence?.openModal && (
				<EditAttendence
					open={editAttendence.openModal}
					close={closeModal}
					data={editAttendence.attendenceData}
					userId={userId}
				/>
			)}
			{addAttendence?.openModal && (
				<AddAttendanceModal
					open={addAttendence.openModal}
					close={closeModal}
					data={addAttendence.attendenceData}
					userId={userId}
				/>
			)}
			{markAbsent && (
				<ConfirmDialog
					openDialog={markAbsent}
					title="Confirm Absent"
					body="Are you sure you want to mark absent this employee?"
					onConfirm={handleMarkAbsent}
					closeDialog={closeModal}
				/>
			)}
			{chekoutImagelink && (
				<Container>
					<Modal
						size="lg"
						show={chekoutImagelink}
						onHide={() => setCheckoutImageLink(null)}
						//   backdrop="static"
						keyboard={false}
						centered
					>
						<Modal.Header>
							<Modal.Title>{"Chekout Image"}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<img
								style={{ width: "100%", maxHeight: "60vh" }}
								src={chekoutImagelink}
								alt="checkout"
							/>
						</Modal.Body>
						<Modal.Footer>
							<Button
								className="bg-primary text-white"
								onClick={() => setCheckoutImageLink(null)}
							>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</Container>
			)}
		</>
	);
}

export default EmployeeAttendenceDetail;
