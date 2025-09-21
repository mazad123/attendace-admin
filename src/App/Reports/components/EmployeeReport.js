import moment from "moment";
import React, { useState, useEffect, memo } from "react";
import ReactExport from "react-export-excel";
import { toast } from "react-toastify";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function EmployeeReport({
	data,
	attendanceEntryData,
	leaveData,
	month,
	getPublicHolidaysDate,
	todayOnLeaveData,
}) {
	console.log(
		{ data },
		{ attendanceEntryData },
		{ leaveData },
		{ todayOnLeaveData }
	);
	const currentMonth = moment(month).isSame(
		moment().startOf("month").format("YYYY-MM-DD")
	);
	// const endDate = moment(month).endOf('month').format("YYYY-MM-DD");

	const [arr, setArr] = useState([]);
	const [checkAll, setCheckAll] = useState(false);
	const [leavesData, setLeavesData] = useState(data);

	useEffect(() => {
		setArr([]);
		setCheckAll(false);
		console.log({ data });
	}, [data]);

	useEffect(() => {
		if (currentMonth) {
			const updateEntryes = [];
			for (let user of data) {
				const todayEntry = attendanceEntryData.find(
					(entry) => entry.user_id.toString() === user.id.toString()
				);
				const isOnLeave = todayOnLeaveData.find(
					(leave) => leave.user_id.toString() === user.id.toString()
				);

				if (
					!todayEntry &&
					!isOnLeave &&
					moment().day() !== 0 &&
					moment().day() !== 6 &&
					!getPublicHolidaysDate.includes(moment().format("YYYY-MM-DD"))
				) {
					const objNew = { ...user, absent: user.absent + 1 };
					updateEntryes.push(objNew);
				} else {
					updateEntryes.push(user);
				}
			}
			setLeavesData(updateEntryes);

			//       const checkInUsers = attendanceEntryData.filter((entry) => {
			//         if (moment(entry.createdAt).isSameOrBefore(moment().format('YYYY-MM-DD'), 'month')) {
			//           return entry;
			//         }
			//       });

			//       const usersOnLeave = leaveData.filter((entry) => {
			//         if (moment(entry.from).isSame(moment().format('YYYY-MM-DD'), 'month') && entry.status==="approved") {
			//         // if (moment(entry.from).isSame(moment().format('YYYY-MM-DD'), 'month')) {
			//           return entry;
			//         }
			//       });

			//       //merge check in and on leave users arrays
			//       const mergerArray = [...checkInUsers, ...usersOnLeave];
			//       console.log({mergerArray})

			//       let monthStartDate = month;
			//       let daysInMonth = moment(month).daysInMonth();
			//       let currentDate = moment().format('YYYY-MM-DD');
			//       const arrDays = [];
			//       while (daysInMonth) {
			//         if (
			//           monthStartDate <= currentDate &&
			//           moment(monthStartDate).day() !== 0 &&
			//           moment(monthStartDate).day() !== 6 &&
			//           !getPublicHolidaysDate.includes(monthStartDate)
			//         ) {
			//           arrDays.push(monthStartDate);
			//         }
			//         monthStartDate = moment(monthStartDate).add(1, 'days').format('YYYY-MM-DD');
			//         daysInMonth--;
			//       }
			// console.log({arrDays});
			//       const finalArray = [];
			//       for (let user of data) {
			//         let objNew = { ...user };
			//         for (let date of arrDays) {
			//           if (moment(moment(user.doj).format('YYYY-MM-DD')).isSameOrBefore(date)) {
			//             // if(!(mergerArray.some(ele => (ele.user_id === user.id  && moment(ele.createdAt).format("YYYY-MM-DD") === date) || (ele.user_id.emp_id === user.emp_id && moment(ele.from).format("YYYY-MM-DD") === date)))){
			//             if (
			//               !mergerArray.some(
			//                 (ele) =>
			//                   (ele.user_id === user.id && moment(ele.createdAt).format('YYYY-MM-DD') === date) ||
			//                   (ele.user_id.emp_id === user.emp_id &&
			//                     (moment(new Date(ele.from)).format('YYYY-MM-DD') === date || moment(new Date(ele.to)).format('YYYY-MM-DD') >= date))
			//               )
			//             ) {
			//               objNew = { ...objNew, absent: objNew.absent + 1 };
			//             }
			//           }
			//         }
			//         finalArray.push(objNew);
			//       }
			//       setLeavesData(finalArray);
		} else {
			setLeavesData(data);
		}
	}, [data]);

	const handleOnChange = async (arr1) => {
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
		const checkbox = arr.filter((e) => e?.emp_id === id);
		if (checkbox.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	const handleCheckALL = (e) => {
		if (e.target.checked) {
			setCheckAll(true);
			const Data = leavesData.sort((a, b) => a.name.localeCompare(b.name));
			setArr(Data);
		} else {
			setCheckAll(false);
			setArr([]);
		}
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
						<button className="btn btn-primary mt-3 mb-3">
							Download as XLS
						</button>
					}
					filename="Employee Leave Report"
				>
					<ExcelSheet data={arr} name="Leaves">
						<ExcelColumn label="Name" value="name" />
						<ExcelColumn label="Approved Leaves" value="approved_leaves" />
						<ExcelColumn label="Total Absents" value="absent" />
						{currentMonth ? (
							<ExcelColumn label="Pending Leaves" value="pending_leaves" />
						) : (
							<ExcelColumn label="" value="" />
						)}
					</ExcelSheet>
				</ExcelFile>
			)}
			<div className="table-outer">
				<div className="report_table_main table-inner table-responsive leaves-report-table">
					<table
						// id="monthly"
						className="report_table table table-striped  mb-auto w-100"
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
								<th>Name </th>
								<th>Approved Leaves</th>
								<th>Total Absents</th>
								{currentMonth && <th>Pending Leaves</th>}
							</tr>
						</thead>
						<tbody>
							{leavesData.map((d, i) => (
								<tr key={i}>
									<td>
										<input
											type="checkbox"
											checked={handleChecked(d.emp_id)}
											onChange={(e) => handleOnChange(d)}
										/>
									</td>

									<td>
										<span className="number">{i + 1}</span>
									</td>
									<td>{d.name}</td>
									<td>{d.approved_leaves}</td>
									<td>{d.absent}</td>
									{currentMonth ? <td>{d.pending_leaves}</td> : ""}
								</tr>
							))}
						</tbody>
					</table>
					{/* {data.length <= 0 && ( */}
					{leavesData.length <= 0 && (
						<div className="justify-content-center mr-2">
							<h5>No Records to Display.</h5>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default memo(EmployeeReport);
