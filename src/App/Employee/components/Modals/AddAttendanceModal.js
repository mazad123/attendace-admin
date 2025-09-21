import React, { useEffect, useState } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { httpClient } from "../../../../constants/Api";
import { ATTENDENCE } from "../../../../constants/AppConstants";

function AddAttendanceModal(props) {
	const [values, setValues] = useState({
		check_in: "",
		check_out: "",
		work_from: "office",
	});
	const [selectedDate, setSelectedDate] = useState("");
	useEffect(() => {
		console.log(props);
		if (props.data.entry_date) {
			const formattedDate = moment(props.data.entry_date).format("YYYY-MM-DD");
			const formattedStartTime = moment("09:00", "HH:mm").format("HH:mm");
			const formattedEndTime = moment("18:00", "HH:mm").format("HH:mm");
			console.log({ formattedDate, formattedStartTime, formattedEndTime });
			const updateObj = {
				check_in: moment(
					formattedDate + " " + formattedStartTime,
					"YYYY-MM-DD HH:mm"
				),
				check_out: moment(
					formattedDate + " " + formattedEndTime,
					"YYYY-MM-DD HH:mm"
				),
				work_from: "office",
			};
			setSelectedDate(formattedDate);
			setValues(updateObj);
		}
	}, [props]);

	const getTime = (time) => {
		// return time ? moment(time).format("YYYY-MM-DDTHH:mm") : "";
		return time ? moment(time).format("HH:mm") : "";
	};

	const handleInTime = (e) => {
		console.log(e.target.value);
		values.check_in = moment(
			selectedDate + " " + e.target.value,
			"YYYY-MM-DD HH:mm"
		).format("YYYY-MM-DDTHH:mm");
		setValues(values);
	};
	const handleCheckOut = (e) => {
		console.log(e.target.value);
		values.check_out = moment(
			selectedDate + " " + e.target.value,
			"YYYY-MM-DD HH:mm"
		).format("YYYY-MM-DDTHH:mm");
		setValues(values);
	};

	const updateWorkStatus = (e) => {
		const entryOBj = { ...values, work_from: e.target.value };
		setValues(entryOBj);
	};

	const handleSubmit = async () => {
		console.log({ values });
		try {
			const userResponse = window.confirm(
				"Are you sure you want to save the changes ?"
			);
			if (userResponse) {
				await httpClient
					.put(ATTENDENCE.ADD_ATTENDENCE.replace("{id}", props.userId), values)
					.then((res) => {
						toast.success(res.data.message);
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
				onHide={() => props.close(false)}
				keyboard={false}
				size="md"
				centered
			>
				<Modal.Header className="border-0">
					<h5 className="modal-title" id="AddAttendanceModalLabel">
						Add Attendance Time
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
					<div className="row mb-2" style={{ width: "96%" }}>
						<div className="col-md-6">
							<h6
								className="modal-title form-control"
								style={{ background: "#cccccc8a" }}
							>
								Date : {moment(props.data.entry_date).format("YYYY-MM-DD")}
							</h6>
						</div>

						<div className="col-md-6">
							<select
								onChange={updateWorkStatus}
								value={values.work_from}
								className="form-control"
							>
								<option value="office">WFO</option>
								<option value="home">WFH</option>
							</select>
						</div>
					</div>
					<div className="row mb-4" style={{ width: "96%" }}>
						<div className="col-md-6">
							<label>In Time</label>
							<input
								type="time"
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
								type="time"
								min={getTime(values?.check_in)}
								name="check_out"
								className="form-control"
								placeholder="07:00 PM"
								defaultValue={getTime(values?.check_out)}
								onChange={(e) => handleCheckOut(e)}
							/>
						</div>
					</div>
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

export default AddAttendanceModal;
