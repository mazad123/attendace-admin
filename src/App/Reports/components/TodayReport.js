import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactExport from "react-export-excel";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronCircleUp,
	faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
function TodayReport({ data, getPublicHolidaysDate }) {
	const [arr, setArr] = useState([]);
	const [checkAll, setCheckAll] = useState(false);
	const [isSorted, setIsSortedData] = useState(true);
	const [todayReports, setTodayReports] = useState([]);
	useEffect(() => {
		setArr([]);
		setCheckAll(false);
	}, [data]);

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
		arr2.map((ietm) => {
			if (
				ietm.entry.length === 0 &&
				getPublicHolidaysDate.includes(moment().format("YYYY-MM-DD"))
			) {
				ietm.entry.push({ date: moment().format("YYYY-MM-DD"), type: "" });
			} else if (ietm.entry.length === 0) {
				ietm.entry.push({ date: moment().format("YYYY-MM-DD"), type: "A" });
			}
		});
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
			Data.map((ietm) => {
				if (
					ietm.entry.length === 0 &&
					getPublicHolidaysDate.includes(moment().format("YYYY-MM-DD"))
				) {
					ietm.entry.push({ date: moment().format("YYYY-MM-DD"), type: "" });
				} else if (ietm.entry.length === 0) {
					ietm.entry.push({ date: moment().format("YYYY-MM-DD"), type: "A" });
				}
			});
			setArr(Data);
		} else {
			setCheckAll(false);
			setArr([]);
		}
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
				>
					<ExcelSheet data={arr} name="Today Report">
						<ExcelColumn label="Name" value="name" />
						{arr[0] &&
							arr[0].entry.map((data, i) => (
								<ExcelColumn
									label={moment(data.date).format("YYYY/MM/DD")}
									value={(dat) =>
										dat.entry[i].type === "P"
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
											: " "
									}
								/>
							))}
					</ExcelSheet>
				</ExcelFile>
			)}
			<div className="report_table_main">
				<table
					id="today"
					className="report_table table table-striped mb-0 w-100"
				>
					<thead>
						<tr>
							<th>
								<input
									type="checkbox"
									checked={checkAll}
									onChange={(e) => handleCheckALL(e)}
								/>
							</th>
							<th>
								<span className="number">#</span>
							</th>
							<th>
								Name{" "}
								<span>
									<FontAwesomeIcon
										icon={faChevronCircleUp}
										style={{ cursor: "pointer" }}
										onClick={() => setIsSortedData(true)}
									/>
									<FontAwesomeIcon
										icon={faChevronCircleDown}
										style={{ cursor: "pointer" }}
										onClick={() => setIsSortedData(false)}
									/>
								</span>
							</th>
							<th>{moment().format("YYYY/MM/DD")}</th>
						</tr>
					</thead>
					<tbody>
						{/* {data.map((d, i) => (
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
                {d.entry.map((a, i) => (
                  <td
                    key={i}
                    className={
                      a.type === "HD" || a.type === "SD"
                        ? "half_leave"
                        : a.type === "L" || a.type === "Comp Off"
                        ? "full_leave"
                        :a.type === 'P'
                        ? 'present'
                        : a.type === "A"
                        ? "absent"
                        : ""
                    }
                  >
                  {console.log(a.type)}
                    {a.type}
                  </td>
                ))}
              </tr>
            ))} */}
						{isSorted &&
							data
								.sort(function (a, b) {
									return a.name.localeCompare(b.name);
								})
								.map((d, i) => (
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
										{
											d.entry && d.entry.length > 0 ? (
												d.entry.map((a, i) => (
													<td
														key={i}
														className={
															a.type === "HD" || a.type === "SD"
																? "half_leave"
																: a.type === "L" || a.type === "Comp Off"
																? "full_leave"
																: a.type === "P"
																? "present"
																: a.type === "A"
																? "absent"
																: a.type === ""
																? "holiday"
																: ""
														}
													>
														{a.type}
													</td>
												))
											) : getPublicHolidaysDate.includes(
													moment().format("YYYY-MM-DD")
											  ) ? (
												<td className="holiday"></td>
											) : (
												<td className="absent">A</td>
											)
											// )):<td className="absent">A</td>
										}
									</tr>
								))}
						{!isSorted &&
							data
								.sort(function (a, b) {
									return b.name.localeCompare(a.name);
								})
								.map((d, i) => (
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
										{
											d.entry && d.entry.length > 0 ? (
												d.entry.map((a, i) => (
													<td
														key={i}
														className={
															a.type === "HD" || a.type === "SD"
																? "half_leave"
																: a.type === "L" || a.type === "Comp Off"
																? "full_leave"
																: a.type === "P"
																? "present"
																: a.type === "A"
																? "absent"
																: a.type === ""
																? "holiday"
																: ""
														}
													>
														{a.type}
													</td>
												))
											) : getPublicHolidaysDate.includes(
													moment().format("YYYY-MM-DD")
											  ) ? (
												<td className="holiday"></td>
											) : (
												<td className="absent">A</td>
											)
											// )):<td className="absent">A</td>
										}
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

export default TodayReport;
