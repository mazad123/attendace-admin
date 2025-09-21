import React, { useEffect, useState } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { httpClient } from "../../../../constants/Api";
import { ATTENDENCE } from "../../../../constants/AppConstants";

function EditAttendence(props) {
	const [values, setValues] = useState(props.data);
	const [deleteBreakId, setDeleteBreakId] = useState("");
	const [disbleOutTime, setDisableOutTime] = useState(false);
	const getTime = (time) => {
		return time ? moment(time).format("YYYY-MM-DDTHH:mm") : "";
	};

	useEffect(() => {
		if (values.breaks && values.breaks.length) {
			if (values.breaks.length === values.breaks.filter((b) => b.end).length) {
				setDisableOutTime(false);
			} else {
				setDisableOutTime(true);
			}
		}
	}, []);

	const handleInTime = (e) => {
		// const data = values;
		// let checkIn = moment(data.check_in);
		// const time = moment(e.target.value, "HH:mm");
		// checkIn.set({
		//   hour: time.get("hour"),
		//   minute: time.get("minute"),
		//   second: time.get("second"),
		// });
		// data.check_in = checkIn;
		const updatedObj = { ...values, check_in: moment(e.target.value).format() };
		// values.check_in = moment(e.target.value).format();
		setValues(updatedObj);
	};
	const handleCheckOut = (e) => {
		// let checkOut = moment(values.check_in);
		// const time = moment(e.target.value, "HH:mm");
		// checkOut.set({
		//   hour: time.get("hour"),
		//   minute: time.get("minute"),
		//   second: time.get("second"),
		// });
		// values.check_out = checkOut;
		// values.check_out = moment(e.target.value).format();
		const updatedObj = {
			...values,
			check_out: moment(e.target.value).format(),
		};

		setValues(updatedObj);
	};

	const handleBreakStart = (e, br) => {
		const index = values.breaks.findIndex((b) => b._id === br._id);
		let newArray = [...values.breaks];
		// const time = moment(e.target.value, "HH:mm");
		const breakStart = moment(e.target.value).format();
		// breakStart.set({
		//   hour: time.get("hour"),
		//   minute: time.get("minute"),
		//   second: time.get("second"),
		// });
		newArray[index] = { ...newArray[index], start: breakStart };
		const updatedObj = {
			...values,
			breaks: newArray,
		};

		setValues(updatedObj);
	};

	const handleBreakEnd = (e, br) => {
		const index = values.breaks.findIndex((b) => b._id === br._id);
		let newArray = [...values.breaks];
		// const time = moment(e.target.value, "HH:mm");
		const breakEnd = moment(e.target.value).format();
		// breakEnd.set({
		//   hour: time.get("hour"),
		//   minute: time.get("minute"),
		//   second: time.get("second"),
		// });
		newArray[index] = { ...newArray[index], end: breakEnd };
		const updatedObj = {
			...values,
			breaks: newArray,
		};

		setValues(updatedObj);
	};

	const deleteBreak = async (breakId, breakIndex) => {
		if (breakId) {
			setDeleteBreakId(breakId);
			let breaksData = [...values.breaks];
			breaksData = breaksData.filter((brk) => brk._id !== breakId);
			// const updatedData = {...values, breaks: breaksData};
			const updatedData = { ...values, breaks: breaksData };
			setValues();
			setValues(updatedData);
		}

		// setRecords(prevRecords => {
		//   // Filter out the record with the given ID
		//   const updatedRecords = prevRecords.filter(record => record.id !== recordId);
		// });

		// try {
		//   await httpClient
		//     .post(ATTENDENCE.DELETE_BREAK.replace("{id}", breakId))
		//     .then(async (res) => {
		//       if (res.status === 200) {
		//       toast.success("Break Deleted Successfully");
		//       let breaksData = values.breaks;
		//       breaksData = breaksData.filter(brk => brk._id !=  breakId)
		//       const updatedData = {...values, breaks: breaksData}
		//       setValues(updatedData);
		//       }
		//     })
		//     .catch((err) => {
		//       console.log(err);
		//       if (err.response) {
		//         toast.error(err.response.data.message);
		//       }
		//     });
		// } catch (err) {
		//   console.log(err);
		// }
	};

	console.log({ deleteBreakId }, { values });

	const handleSubmit = async () => {
		try {
			const userResponse = window.confirm(
				"Are you sure you want to save these changes ?"
			);
			if (userResponse) {
				if (deleteBreakId) {
					await httpClient
						.post(ATTENDENCE.DELETE_BREAK.replace("{id}", deleteBreakId))
						.then(async (res) => {
							if (res.status === 200) {
								toast.success("Break Deleted Successfully");
								let breaksData = values.breaks;
								breaksData = breaksData.filter(
									(brk) => brk._id != deleteBreakId
								);
								const updatedData = { ...values, breaks: breaksData };
								setValues(updatedData);
							}
						})
						.catch((err) => {
							console.log(err);
							if (err.response) {
								toast.error(err.response.data.message);
							}
						});
				}
				await httpClient
					.put(
						ATTENDENCE.UPDATE_ATTENDENCE.replace("{id}", props.userId),
						values
					)
					.then((res) => {
						if (!deleteBreakId) {
							toast.success(res.data.message);
						}
						props.close(true);
					})
					.catch((err) => {
						if (err.response) {
							toast.error(err.response.data.message);
						} else {
							toast.error("Something went wrong");
						}
					});
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Modal
				show={props.open}
				onHide={props.close}
				keyboard={false}
				size="md"
				centered
			>
				<Modal.Header className="border-0">
					<h5 className="modal-title" id="exampleModalLabel">
						Update Time
					</h5>
					<button
						type="button"
						className="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						onClick={() => props.close(false)}
					></button>
				</Modal.Header>
				<Modal.Body>
					<div className="row mb-4" style={{ width: "96%" }}>
						<div className="col-md-6">
							<label>In Time</label>
							<input
								type="datetime-local"
								max={getTime(values?.check_out)}
								className="form-control"
								placeholder="10:00 AM"
								defaultValue={getTime(values?.check_in)}
								onChange={(e) => handleInTime(e)}
							/>
						</div>
						<div className="col-md-6">
							<label>Out Time</label>
							<input
								type="datetime-local"
								min={getTime(values?.check_in)}
								name="check_out"
								className="form-control"
								placeholder="07:00 PM"
								defaultValue={getTime(values?.check_out)}
								onChange={(e) => handleCheckOut(e)}
								disabled={disbleOutTime}
							/>
						</div>
					</div>
					{values?.breaks?.map((br, i) => (
						<div style={{ display: "flex", alignItems: "center" }}>
							<div className="row mb-4" key={i}>
								<div className="col-md-6">
									<label>Break {i + 1} IN</label>
									<input
										type="datetime-local"
										max={getTime(br.end)}
										className="form-control"
										placeholder="10:00 AM"
										defaultValue={getTime(br.start)}
										onChange={(e) => handleBreakStart(e, br)}
									/>
								</div>
								<div className="col-md-6">
									<label>Break {i + 1} OUT</label>
									<input
										type="datetime-local"
										min={getTime(br?.end)}
										className="form-control"
										placeholder="07:00 PM"
										defaultValue={getTime(br?.end)}
										onChange={(e) => handleBreakEnd(e, br)}
									/>
								</div>
							</div>
							<div style={{ marginLeft: "8px" }}>
								<button
									title="Delete Break"
									type="button"
									className="border-0 close danger mx-1 hover-zoom"
									data-close="notification"
									onClick={() => deleteBreak(br?._id, i)}
									style={{ borderRadius: "5px", backgroundColor: "red" }}
								>
									<i
										className="fa fa-trash-o"
										data-id={br?._id}
										aria-hidden="true"
										style={{ color: "white" }}
									></i>
								</button>
							</div>
						</div>
					))}
				</Modal.Body>
				<Modal.Footer className="border-0 pt-0">
					<button
						type="button"
						className="btn btn-secondary"
						data-bs-dismiss="modal"
						onClick={() => props.close(false)}
					>
						Close
					</button>
					<button
						type="button"
						className="btn btn-submit "
						onClick={() => handleSubmit()}
					>
						Save changes
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default EditAttendence;
