import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { httpClient } from "../../../../constants/Api";
import { ORGANISATION } from "../../../../constants/AppConstants";
import { Modal } from "react-bootstrap";
function AddEditLevelModal(props) {
	const { show, onHide, selectedUser, userLevel, userOptions } = props;

	const [values, setValues] = useState("");
	const [loading, setLoading] = useState(false);
	const [organisationData, setOrganisationData] = useState("");
	useEffect(() => {
		getOrganisationData();
		if (selectedUser) {
			{
				setValues({
					user: {
						label: selectedUser.user_id.name,
						value: selectedUser.user_id.id,
					},
					level: {
						label: selectedUser.level.level,
						value: selectedUser.level._id,
					},
				});
			}
		}
	}, []);

	const getOrganisationData = async () => {
		try {
			setLoading(true);
			const final_result = await httpClient.get(
				ORGANISATION.GET_ORGANISATION_DATA
			);
			setOrganisationData(final_result.data.result);
		} catch (err) {
			if (err.response) toast.error(err.response.data.message);
			else toast.error("Error in fetching user detail");
		} finally {
			setLoading(false);
		}
	};

	const handleSelectedOption = (selectedOption, selector) => {
		let selectedUserLevel = {};
		if (selector === "user") {
			const records = organisationData.userLevels.find(
				(org) => selectedOption.value === org.user_id
			);
			if (records) {
				selectedUserLevel = {
					label: records.level.level,
					value: records.level._id,
				};
			}
			setValues({
				...values,
				[selector]: selectedOption,
				level: selectedUserLevel,
			});
		} else {
			setValues({ ...values, [selector]: selectedOption });
		}
	};

	// const submitData = async () => {
	//     try {
	//         setLoading(true);
	//         await httpClient.post(ORGANISATION.ADD_USER_LEVEL, values);
	//         toast.success("Added Successfully");
	//         setValues({ ...values });
	//         getOrganisationData();
	//         window.location.reload();
	//     } catch (err) {
	//         if (err.response) toast.error("Please select User and Level");
	//         else toast.error("Error in fetching user detail");
	//     } finally {
	//         setLoading(false);
	//     }
	// };

	const handelClick = async () => {
		// submitData();
		try {
			setLoading(true);
			await httpClient.post(ORGANISATION.ADD_USER_LEVEL, values);
			toast.success("Added Successfully");
			setValues({ ...values });
			getOrganisationData();
			// window.location.reload();
		} catch (err) {
			if (err.response) toast.error("Please select User and Level");
			else toast.error("Error in fetching user detail");
		} finally {
			setLoading(false);
		}
		onHide(true);
	};

	return (
		<>
			<Modal show={show} onHide={() => onHide(false)} centered>
				<Modal.Body>
					<div className="row justify-content-center">
						<div className="col-12">
							<div className="header_title ">
								<h1>{selectedUser ? "Edit User Level" : "Add User Level"}</h1>
							</div>
							<div className="select_role px-4">
								<p>Select User</p>
								<Select
									isDisabled={selectedUser ? true : false}
									onChange={(e) => handleSelectedOption(e, "user")}
									value={values.user}
									options={userOptions}
								/>
							</div>
							<div className="select_role px-4">
								<p>Select Level</p>
								<Select
									onChange={(e) => handleSelectedOption(e, "level")}
									// value={selectedUser?{label:selectedUser.level.level,value:selectedUser.level._id}:values.level}
									value={values.level}
									options={userLevel}
								/>
							</div>
							<div className="mt-5 text-end">
								<button
									type="button"
									className="btn btn-outline-secondary text-center px-4 mx-2"
									onClick={() => onHide(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-primary text-center px-4 mx-2"
									onClick={handelClick}
								>
									{selectedUser ? "Update" : "Add"}
								</button>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default AddEditLevelModal;
