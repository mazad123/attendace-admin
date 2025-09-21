import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { httpClient } from "../../constants/Api";
import { PROJECT } from "../../constants/AppConstants";
import { useParams } from "react-router-dom";
import moment from "moment";
import BlankImage from "../../assets/images/dummy_profile.jpeg";
import EditMessageModal from "./Modals/EditMessage.Modal";
import DeleteMessageModal from "./Modals/DeleteMessage.Modal";
import Select from "react-select";
import CkEditor from "../../App/common/CkEditor";

function SubjectDetails() {
	useEffect(() => {
		getSubjectMessages();
		queryParams();
		getCountires();
	}, []);

	const user = JSON.parse(localStorage.getItem("user")).user.id;
	const [values, setValues] = useState({ message: "" });
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [showEditMessage, setShowEditMessage] = useState({
		open: false,
		id: "",
	});
	const [showDelMessage, setShowDelMessage] = useState({ open: false, id: "" });
	const { subjectId } = useParams();
	const [statusType, setStatusType] = useState();
	const [inputFields, setInputFields] = useState([]);
	const [inputFields1, setInputFields1] = useState([]);
	const [tempUsername, setTempUsername] = useState();
	const [tempUsername1, setTempUsername1] = useState();
	const [options, setOptions] = useState();
	const [options1, setOptions1] = useState();
	const [userId, setUserId] = useState();
	const [userId1, setUserId1] = useState();
	const [selectedUser, setSelectedUser] = useState([]);
	const [selectedUser1, setSelectedUser1] = useState([]);
	const [clientLocationData, setclientLocationData] = useState([]);
	const [channelData, setchannelData] = useState([]);
	const [countries, setCountries] = useState([]);
	const [previousSelectedUser, setPreviousSelectedUser] = useState('');

	const queryParams = () => {
		const query = new URLSearchParams(window.location.search);
		const queryParameter = query.get("selectedUserId");
		setStatusType(queryParameter);
	};

	const history = useHistory();
	const validation = () => {
		let valid = true;
		if (!values.message.trim()) {
			toast.error("Please type Message");
			valid = false;
		}
		return valid;
	};

	const params = subjectId.substr(0, subjectId.indexOf("?"));
	const getSubjectMessages = async () => {
		try {
			const res = await httpClient.get(
				PROJECT.GET_SUBJECT_DETAILS.replace(
					"{subjectId}",
					!params ? subjectId : params.toString()
				)
			);
			if (res.status === 200) {
				setData(res.data.result.subjectDetail);
				const recipients = res.data.result.subjectDetail;
				// const allRecipients = res.data.result.recipientsArray
				let channel = recipients[0].channel;
				let clientLocation = recipients[0].clientLocation;
				let createdBy = "";
				recipients.forEach(recipient => {
					// Access properties for each recipient object
					// channel = recipient.channel;
					// clientLocation = recipient.clientLocation;
					createdBy = recipient.createdBy;
				})
				let recipientArray = [];
				const array = recipients.map((d) =>
					d.recipients.map((id) => {
						recipientArray.push(id);
					})
				);
				// const uniqueIds = [...new Set(allRecipients)];
				// setInputFields(allRecipients);
				const uniqueIds = [...new Set(recipientArray)];
				setInputFields(uniqueIds);
				setInputFields1(createdBy);
				setclientLocationData(clientLocation);
				setchannelData(channel);
				getUsers(uniqueIds);
				if (!res.data.result.subjectDetail.length) {
					if (statusType === "daily_status")
						history.push(`/project/get-project/general-project/${statusType}`);
					else if (statusType === "sales_status")
						history.push(
							`/project/get-project-detail/sales-project/${statusType}`
						);
					else
						history.push(
							`/project/get-project-detail/general-project-user/${statusType}`
						);
				}
			}
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};
	const getCountires = async () => {
		try {
			const response = await fetch('https://restcountries.com/v3.1/all');
			const text = await response.text();

			// Parse the JSON data
			const countriesData = JSON.parse(text);

			// Extract the name of each country
			const countryNames = countriesData.map(country => country.name.common);
			setCountries(countryNames);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const usersId = [...inputFields, ...selectedUser];
	const createdBy = [...inputFields1, ...selectedUser1];
	const submitData = async () => {
		if (statusType === "sales_status") {
			values.type = "sales_status";
			values.recipients = usersId;
			values.createdBy = createdBy;
			values.channel = channelData;
			values.clientLocation = clientLocationData;
			// values.messageType = "message";
		} else {
			values.type = "daily_status";
		}
		try {
			const valid = validation();
			if (valid) {
				await httpClient
					.post(
						`${PROJECT.ADD_DAILY_STATUS}?subjectId=${!params ? subjectId : params
						}`,
						values
					)
					.then(async (res) => {
						if (res.status === 200) {
							toast.success("Message posted successfully");
							getSubjectMessages();
							setValues({ message: "" });
							setSelectedUser([]);
							setSelectedUser1([]);
							if (Object.keys(res.data).length > 0 && res.data.result.isuserTagged) {
								await httpClient.post(PROJECT.SEND_MAIL_TO_TAGGED_USERS, res.data.result.emailData);
							}
						}
					});
			}
		} catch (err) {
			if (err.response) toast.error(err.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	const handleClick = () => {
		if (statusType === "daily_status") {
			history.push(`/project/get-project/general-project/${statusType}`);
		} else if (statusType === "sales_status") {
			history.push(`/project/get-project-detail/sales-project/${statusType}`);
		} else
			history.push(
				`/project/get-project-detail/general-project-user/${statusType}`
			);
	};

	const parser = (data) => {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: data.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("<a ", "<a target='_blank'"),
				}}
			/>
		);
	};

	const handleClose = () => {
		setShowEditMessage(false);
		getSubjectMessages();
	};

	const handleCountryChange = (selectedOption) => {
		setclientLocationData(selectedOption);
	};

	const handleCloseDeleteMessage = () => {
		setShowDelMessage({ open: false, id: "" });
		getSubjectMessages();
		setclientLocationData('');
	};

	const getUsers = async (uniqueIds) => {
		try {
			const users = await httpClient.get(PROJECT.GET_ALL_EMPLOYEES);
			let usersList = users.data.result;
			usersList = usersList.filter((usr) => !uniqueIds.includes(usr.id));
			const Labels = usersList.map((data) => {
				return { label: `${data.name} (${data.emp_id})`, value: "" };
			});
			const LabelswithId = users.data.result.map((data) => {
				return { label: `${data.name} (${data.emp_id})`, value: data.id };
			});
			setUserId(LabelswithId);
			setUserId1(LabelswithId);
			setOptions(Labels);
			setOptions1(Labels);
		} catch (err) {
			if (err.response) toast.error(err.response.data.message);
			else toast.error("Error in fetching user detail");
		} finally {
		}
	};

	const handleChange = (event, index) => {
		const id = userId.find(({ label }) => label === event.label);
		const selectedUserIndex = options.findIndex((x) => x.label === id.label);
		if (selectedUserIndex >= 0) {
			options.splice(selectedUserIndex, 1);
		}
		setSelectedUser((selectedUser) => [...selectedUser, id.value]);
	};

	const handleRemove = (index, id) => {
		const removedUserData = userId.find((x) => x.value === id);
		const removedUser = { label: removedUserData.label, value: "" };
		options.push(removedUser);
		const values = [...selectedUser];
		values.splice(index, 1);
		setSelectedUser(values);
	};

	const handleChange1 = (event, index) => {
		setPreviousSelectedUser(event);
		const id = userId.find(({ label }) => label === event.label);
		const existingIndex = options1.findIndex((x) => x.label === id.label);
		if (existingIndex >= 0) {
			// If the user already exists, remove it
			options1.splice(existingIndex, 1);
		}
		setSelectedUser1([id.value]);
		setValues({ ...values, createdBy: id.value });
		if (previousSelectedUser) {
			options1.push(previousSelectedUser);
		}
	};

	const handleRemove1 = (index, id) => {
		const removedUserData = userId.find((x) => x.value === id);
		const removedUser = { label: removedUserData.label, value: "" };
		options.push(removedUser);
		const values = [...selectedUser1];
		values.splice(index, 1);
		setSelectedUser1(values);
	};

	const Styles = {
		container: (provided) => ({
			...provided,
			minWidth: "45%",
			marginTop: "8px",
		}),
	};

	const handleChannelChange = (event) => {
		setchannelData(event.target.value);
	};

	return (
		<>
			<div className="main_content_panel main_content_panel2 subjec-content">
				<div className="row justify-content-center">
					<div className="col-md-12">
						<div className="header-title-wrap pb-4">
							<div className="thread-name">
								<h4 className="head-title-info">
									{data && data[0]?.subject_id?.subject}
								</h4>
								<button className="btn btn-secondary" title="Back" onClick={handleClick}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
							</div>
							{data &&
								(data.length ? (
									<p className="description-info">
										Posted by {data[0]?.user_id?.name} on{" "}
										{moment(data[0]?.createdAt).format("ll")}
									</p>
								) : (
									""
								))}
						</div>
					</div>
					<div className="col-lg-6">
						<div className="dashboard_card">
							<div className="projects-update-wrapper">
								<div className="discussions-data-wrap">
									<div className="discussions-data-info  mt-2 pb-2 ">
										<div className="row">
											<div className="col-md-8">
												<div className="content-wrap">
													<div className="head-title-wrap">
														<h5 className="head-title-info col-black fw-light m-0 pe-4">
															Discuss this message
														</h5>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{!showEditMessage.open ?
									<CkEditor values={values} setValues={setValues} inputFields={inputFields} inputFields1={inputFields1} userId={userId} /> : ""
								}
								{statusType === "sales_status" && (
									<div className="mb-3">

										<div className="head-title-wrap">
											<h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">
												Recipients
											</h5>
										</div>
										{/* <div className="mt-2">
											<div
												style={{
													display: "flex",
													flexWrap: "wrap",
												}}
											>
												{inputFields.length > 0 &&
													userId &&
													inputFields.map((item, index) => {
														// Check if item exists in inputFields1; if yes, skip rendering
														if (inputFields1.includes(item)) {
															return null; // Skip rendering this item
														}
														return (
															<div
																key={index}
																className="boxed"
																style={{
																	fontSize: "14px",
																	borderRadius: "4px",
																	marginBottom: "10px",
																	marginRight: "10px",
																	padding: "4px 8px",
																	backgroundColor: "#d4ecff",
																}}
															>
																{userId.find((opt) => opt.value === item)?.label}
															</div>
														);
													})}
											</div>
										</div> */}
										<div className="mt-2">
											<div style={{ display: "flex", flexWrap: "wrap" }}>
												{inputFields.length > 0 &&
													userId &&
													inputFields.map((item, index) => {
														// Skip if item exists in inputFields1
														if (inputFields1.includes(item)) {
															return null;
														}

														const matchedUser = userId.find((opt) => opt.value === item);
														// Only render if we found a matching user
														return matchedUser ? (
															<div
																key={index}
																className="boxed"
																style={{
																	fontSize: "14px",
																	borderRadius: "4px",
																	marginBottom: "10px",
																	marginRight: "10px",
																	padding: "4px 8px",
																	backgroundColor: "#d4ecff",
																}}
															>
																{matchedUser.label}
															</div>
														) : null;
													})}
											</div>
										</div>
										<div className="mt-2">
											<div
												style={{
													display: "flex",
													flexWrap: "wrap",
												}}
											>
												{selectedUser &&
													userId &&
													selectedUser?.map((item, index) => (
														<div
															className="boxed"
															style={{
																fontSize: "14px",
																borderRadius: "4px",
																marginBottom: "10px",
																marginRight: "10px",
																padding: "4px 8px",
																backgroundColor: "#d4ecff",
															}}
														>
															{userId.find((opt) => opt.value === item).label}
															{item ? (
																<i
																	className="fa fa-close mx-2"
																	aria-hidden="true"
																	style={{
																		fontSize: "20px",
																		color: "grey",
																		cursor: "pointer",
																	}}
																	onClick={() => handleRemove(index, item)}
																></i>
															) : null}
														</div>
													))}
											</div>
											{options && (
												<div className="full-selectbox">
													<div
														style={{
															display: "flex",
															alignItems: "center",
														}}
													>
														<Select
															isSearchable={true}
															closeMenuOnSelect={true}
															styles={Styles}
															menuPosition={"fixed"}
															placeholder="search user"
															value={tempUsername}
															options={options}
															onChange={(e) => {
																handleChange(e);
																setTempUsername(e.target ? e.target.value : "");
															}}
														/>
													</div>
												</div>
											)}
										</div>
									</div>
								)}
								{statusType === "sales_status" && (
									<div className="mb-0 mt-3">
										<div className="head-title-wrap">
											<h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">
												Created By
											</h5>
										</div>

										<div className="mt-2">
											<div
												style={{
													display: "flex",
													flexWrap: "wrap",
												}}
											>
												{inputFields1.length > 0 &&
													userId1 &&
													inputFields1.map((item, index) => (
														<div
															className="boxed"
															style={{
																fontSize: "14px",
																borderRadius: "4px",
																marginBottom: "10px",
																marginRight: "10px",
																padding: "4px 8px",
																backgroundColor: "#d4ecff",
															}}
														>
															{userId1.find((opt) => opt.value === item)?.label}
														</div>
													))}

											</div>
										</div>
									</div>
								)}
								{statusType === "sales_status" && inputFields1.length === 0 && (
									<div className="mt-2">
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
											}}
										>
											{selectedUser1 &&
												userId1 &&
												selectedUser1?.map((item, index) => (
													<div
														className="boxed"
														style={{
															fontSize: "14px",
															borderRadius: "4px",
															marginBottom: "10px",
															marginRight: "10px",
															padding: "4px 8px",
															backgroundColor: "#d4ecff",
														}}
													>
														{userId1.find((opt) => opt.value === item).label}
														{item ? (
															<i
																className="fa fa-close mx-2"
																aria-hidden="true"
																style={{
																	fontSize: "20px",
																	color: "grey",
																	cursor: "pointer",
																}}
																onClick={() => handleRemove1(index, item)}
															></i>
														) : null}
													</div>
												))}
										</div>
										{options1 && (
											<div className="full-selectbox">
												<div
													style={{
														display: "flex",
														alignItems: "center",
													}}
												>
													<Select
														isSearchable={true}
														closeMenuOnSelect={true}
														styles={Styles}
														menuPosition={"fixed"}
														placeholder="search user"
														value={tempUsername1}
														options={options1}
														onChange={(e) => {
															handleChange1(e);
															setTempUsername1(e.target ? e.target.value : "");
														}}
													/>
												</div>
											</div>
										)}
									</div>
								)}
								<div className="row mt-3">
									<div className="col-lg-6">
										{statusType === 'sales_status' && (
											<div className="mb-3">
												<div className="head-title-wrap">
													<h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">Channel</h5>
													<div className="mt-2">
														<select className="form-select-view form-select" value={channelData} onChange={handleChannelChange}>
															<option value="">Select Channel</option>
															<option value="Upwork">Upwork</option>
															<option value="Guru">Guru</option>
															<option value="Directlead">Direct Lead</option>
														</select>
													</div>
												</div>
											</div>
										)}
									</div>
									<div className="col-lg-6">
										{statusType === 'sales_status' && (
											<div className="mb-3">
												<div className="head-title-wrap">
													<h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">Client Location</h5>
													<div className="mt-2 full-selectbox">
														<Select
															className="form-select-view w-100"
															options={countries.map(country => ({ label: country, value: country }))}
															onChange={(selectedOption) => handleCountryChange(selectedOption.value)}
															value={clientLocationData ? { label: clientLocationData, value: clientLocationData } : null}
															placeholder={clientLocationData === null ? "Select Country" : ""}
															isSearchable
														/>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
								<div className="mt-3 mb-4 text-end">
									<button
										type="button"
										className="btn btn-secondary text-center px-4 mx-2"
										onClick={handleClick}
									>
										Cancel
									</button>

									<button
										type="button"
										className="btn btn-primary text-center px-4 mx-2 me-0"
										onClick={submitData}
									>
										Post this message
									</button>

									{data && data.length <= 0 && (
										<div className="d-flex justify-content-center">
											<h5>No Records to Display.</h5>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<h5 className="head-title-info col-black fw-light m-0 pe-4 mb-2 pt-2">Previous Messages</h5>
						<div className="previous-chat">

							{data &&
								data.length > 0 &&
								data.map((data, i) => (
									<div key={i}>
										<div className="discussions-list-content-info  project_discussions_list pb-2">
											<hr />
											<div className="img-wrap  me-2 w-100">
												<div className="main_follow_info d-flex">
													{" "}
													<div className="follow-up-info_name">
														<div className="d-flex align-items-center gap-2">
															{

																<img
																	src={
																		data?.user_id?.profile_image
																			? data?.user_id?.profile_image
																			: BlankImage
																	}
																	alt="profile_image"
																/>
															}{" "}
															{data?.user_id?.name}
														</div>
													</div>
													{data.user_id.id === user ? (
														<div className="ms-auto mt-2">
															<div>
																<h6 className="m-0">{moment(data.createdAt).format('lll')}</h6>
																<div className="text-end mt-2">
																	<button
																		title="Edit Message"
																		type="button"
																		className="border-0  close btn-success mx-1"
																		onClick={(e) =>
																			setShowEditMessage({
																				open: true,
																				data: data,
																			})
																		}
																		style={{ borderRadius: "5px" }}
																	>
																		<i
																			className="fa fa-pencil-square-o"
																			aria-hidden="true"
																		></i>
																	</button>
																	<button
																		title="Delete Message"
																		type="button"
																		className="border-0 close danger ms-1 me-0 hover-zoom"
																		data-close="notification"
																		onClick={() =>
																			setShowDelMessage({
																				open: true,
																				messageId: data._id,
																			})
																		}
																		style={{
																			borderRadius: "5px",
																			backgroundColor: "red",
																		}}
																	>
																		<i
																			className="fa fa-trash-o"
																			data-id={data.id}
																			aria-hidden="true"
																			style={{ color: "white" }}
																		></i>
																	</button>
																</div>
															</div>
														</div>
													) : (
														<div className="ms-auto mt-2">
															<h6 className="m-0">{moment(data.createdAt).format('lll')}</h6>
														</div>
													)}
												</div>
												<div className="mt-2">{parser(data.message)}</div>
											</div>
										</div>
										<hr />
									</div>
								))}
						</div>
					</div>
				</div>
				{showEditMessage.open && (
					<EditMessageModal show={showEditMessage} onHide={handleClose} selectedRecipients={inputFields} createdBy={inputFields1} />
				)}
				{showDelMessage.open && (
					<DeleteMessageModal
						show={showDelMessage}
						onHide={handleCloseDeleteMessage}
					/>
				)}
			</div>
		</>
	);
}

export default SubjectDetails;