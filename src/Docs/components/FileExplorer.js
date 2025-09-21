import React, { useEffect, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import moment from "moment";
import { filesize } from "filesize";
import { saveAs } from "file-saver";
import {
	ContextMenuTrigger,
	ContextMenu,
	ContextMenuItem,
} from "rctx-contextmenu";
import DeleteFileOrFolderModal from "../Modals/DeleteFileOrFolder.Modal";
import RenameModal from "../Modals/Rename.Modal";
import PreviewFileModal from "../Modals/PreviewFile.Modal";
import ShareDocumentModal from "../Modals/ShareDocument.Modal";
import { DropdownButton, Dropdown } from "react-bootstrap";
import AddNewFolder from "../Modals/AddNewFolder.Modal";
import AddNewFile from "../Modals/AddNewFile.Modal";
import { DOCS } from "../../constants/AppConstants";
import { toast } from "react-toastify";
import { httpClient } from "../../constants/Api";
import { FileUploader } from "react-drag-drop-files";
import { useSelector } from "react-redux";
import Loader from "../../App/Layouts/Loader";
import { Link } from 'react-router-dom';
import CopyLinkImage from "../../assets/images/copy-link.png";

const FileExplorer = ({ nodeData, onSelectNode, callback, breadCrumbData, callBackForAddDoc }) => {
	const userId = useSelector((state) => state.user.user.user.id);
	const [isDownloading, setIsDownloading] = useState(false);
	const [showFolderModal, setShowFolderModal] = useState({
		open: false,
		data: "",
	});
	const [data, setData] = useState();
	const [showFileModal, setShowFileModal] = useState({ open: false, data: "" });
	const [showDeleteModal, setShowDeleteModal] = useState({
		open: false,
		folderId: "",
		type: "",
		data: "",
		from: "file-explorer"
	});
	const [showRenameModal, setShowRenameModal] = useState({
		open: false,
		folderId: "",
		type: "",
		value: "",
	});
	const [showPreviewModal, setShowPreviewModal] = useState({
		open: false,
		folderId: "",
		type: "",
		value: "",
	});
	const [shareModal, setShowShareModal] = useState({
		open: false,
		id: "",
		type: "",
		name: "",
		permittedUsers: "",
		data: ""
	});
	const [fileDetails, setFileDetails] = useState({});
	const [selectedUser, setSelectedUser] = useState([
		{ user_id: userId, permission: "Editor" },
	]);
	const [loading, setLoading] = useState(false);
	const [labelText, setLabelText] = useState("Drag & Drop/Upload File here");
	const [fileUploaderKey, setFileUploaderKey] = useState(0); // Control re-render of FileUploader
	const fileTypes = [
		"JPG",
		"PNG",
		"GIF",
		"TXT",
		"PDF",
		"XLSX",
		"DOCX",
		"DOC",
		"XLS",
		"PPT",
		"PPTX",
		"ZIP",
		"RAR"
	];
	useEffect(() => {
		getAllDocuments();
	}, []);
	const handleCloseDeleteModal = () => {
		setShowDeleteModal({ open: false });
		callback(nodeData._id);
	};

	const handleCloseFolder = () => {
		setShowFolderModal({ open: false });
		// callback(folderId);
		callback(nodeData._id);
	};

	const handleCloseFile = () => {
		setShowFileModal({ open: false });
		// callback(folderId);
		callback(nodeData._id);
	};

	const handleCloseRenameModal = () => {
		setShowRenameModal({ open: false });
		callback(nodeData._id);
	};

	const handleClosePreviewModal = () => {
		setShowPreviewModal({ open: false });
	};

	const handleCloseShareModal = () => {
		setShowShareModal({ open: false });
		callback(nodeData._id);
	};

	const handlePreviewClick = (docID) => {
		const type = "doc_vault";
		window.open(`/preview/${docID}?type=${type}`, "_blank");
		// window.open("/preview/" + docID, "_blank"); //open preview in new Tab
	};

	// const handleDownloadClick = (data) => {
	// 	const url = data.path;
	// 	fetch(url)
	// 		.then((response) => {
	// 			if (!response.ok) {
	// 				throw new Error("Network response was not ok");
	// 			}
	// 			return response.blob();
	// 		})
	// 		.then((blob) => {
	// 			const fileExtension = data.path.substring(
	// 				data.path.lastIndexOf(".") + 1
	// 			);
	// 			const fileName = data.name + "." + fileExtension;
	// 			saveAs(blob, fileName);
	// 		})
	// 		.catch((error) => {
	// 			console.error("There was a problem with the fetch operation:", error);
	// 		});
	// };

	const handleDownloadClick = async (data) => {
		setIsDownloading(true); // Show loader

		try {
			const url = data.path;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const blob = await response.blob();
			const fileExtension = data.path.substring(data.path.lastIndexOf(".") + 1);
			const fileName = data.name + "." + fileExtension;

			saveAs(blob, fileName);
		} catch (error) {
			console.error("There was a problem with the fetch operation:", error);
			// Optionally show an error message to the user
		} finally {
			setIsDownloading(false); // Hide loader
		}
	};

	const getAllDocuments = async () => {
		try {
			const users = await httpClient.get(DOCS.GET_ALL_FOLDER);
			if (users.data.result.getFomattedData.length > 0) {
				setData(users.data.result.getFomattedData[0].children);
				return users.data.result.getFomattedData;
			}
		} catch (err) {
			if (err.response) toast.error(err.response.data.message);
			else toast.error("Error in fetching docs hello");
		}
	};

	const addFile = async (file) => {
		if (file) {
			// Check if file size is more than 25 MB
			const maxSizeInBytes = 25 * 1048576; // 25 MB in bytes
			if (file.size > maxSizeInBytes) {
				toast.error("Please upload a file less than 25MB");
				setLabelText("File size exceeds 25 MB, please try again.");
				setFileUploaderKey(prevKey => prevKey + 1); // Reset FileUploader component
				return;
			}
			fileDetails.name = file.name;
			fileDetails["parentFolder"] = nodeData._id;
			fileDetails["isPublic"] = "false";
			fileDetails["type"] = "File";
			fileDetails["path"] = file;
			// fileDetails["permittedUsers"] = selectedUser;
			// fileDetails["permittedUsers"] = [{ user_id: nodeData.permittedUsers[0].user_id.id, permission: nodeData.permittedUsers.permission }];
			if (nodeData.permittedUsers.length > 0) {
				fileDetails["permittedUsers"] = [];
				nodeData.permittedUsers.map((user) => {
					fileDetails.permittedUsers.push({ user_id: user.user_id.id, permission: user.permission });
				})
			} else {
				fileDetails["permittedUsers"] = selectedUser;
			}
			const formData = new FormData();
			for (let key of Object.keys(fileDetails)) {
				if (key == "permittedUsers") {
					formData.append("permittedUsers", JSON.stringify(fileDetails[key]));
				} else {
					formData.append([key], fileDetails[key]);
				}
			}
			try {
				setLoading(true);
				setLabelText("File Uploading...");
				setFileUploaderKey(prevKey => prevKey + 1); // Reset FileUploader component
				const resp = await httpClient.post(DOCS.CREATE_FOLDER, formData);
				callBackForAddDoc(resp.data.result, "ADD");
				toast.success("File Added Successfully");
				setLabelText("File uploaded successfully, upload another");
				callback(nodeData._id);
			} catch (err) {
				console.log(err);
				if (err.response) toast.error(err.response.data.message);
				else {
					toast.error("Error");
				}
				setLabelText("File upload failed. Please try again.");
			} finally {
				setLoading(false);
			}
		} else {
			toast.warn("Please Upload File");
		}
	};

	const handleFilPreViewClick = (data) => {
		{
			["jpg", "png", "gif", "txt", "pdf"].includes(
				data.path.substring(data.path.lastIndexOf(".") + 1)
			) ? handlePreviewClick(data._id) : handleDownloadClick(data)
		}
	}

	// Function to copy the document link for file
	const copyLinkToClipboard = (data) => {
		const fileId = data._id;
		const link = `${window.location.origin}/kis-attendance/public-docs/file/${fileId}`; // Generate the full link

		if (navigator.clipboard) {
			navigator.clipboard.writeText(link)
				.then(() => {
					toast.success("Link copied to clipboard!");
				})
				.catch((err) => {
					toast.error("Failed to copy the link.");
					console.error("Error copying link: ", err);
				});
		} else {
			// Fallback method for browsers without clipboard API
			const textArea = document.createElement("textarea");
			textArea.value = link;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand("copy");
				toast.success("Link copied to clipboard!");
			} catch (err) {
				toast.error("Failed to copy the link.");
			}
			document.body.removeChild(textArea);
		}
	};

	// Function to copy the document link for folder
	const handleCopyFolderLinkToClipboard = (data) => {
		const folderId = data._id; // Folder ID
		const link = `${window.location.origin}/kis-attendance/public-docs/folder/${folderId}`; // Generating the link
		if (navigator.clipboard) {
			navigator.clipboard.writeText(link)
				.then(() => {
					toast.success("Link copied to clipboard!");
				})
				.catch((err) => {
					toast.error("Failed to copy the link.");
					console.error("Error copying link: ", err);
				});
		} else {
			// Fallback method
			const textArea = document.createElement("textarea");
			textArea.value = link;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand("copy");
				toast.success("Link copied to clipboard!");
			} catch (err) {
				toast.error("Failed to copy the link.");
			}
			document.body.removeChild(textArea);
		}
	};

	const handleOptionSelect = async (option) => {
		const { data } = option;
		try {
			const res = await httpClient
				.patch(DOCS.UPDATE_DOCUMNET_ACCESS_MODE.replace("{docId}", data._id), { accessMode: option.accessMode })
			if (res.status === 200) {
				toast.success(`Access permission updated Sucessfully`);
				callback();
			}
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};


	return (
		<>
			{/* Add overlay when downloading */}
			{isDownloading && <div className="page-overlay"></div>}
			{/* <div className="align-items-center justify-content-between d-flex main_breadcrumb"> */}
			<div className={`align-items-center justify-content-between d-flex main_breadcrumb ${isDownloading ? 'disabled' : ''}`}>
				{/* {nodeData && data && (
					<nav aria-label="breadcrumb">
						{breadCrumbData.length == 0 && (
							<ol className="breadcrumb mb-0">
								<li className="breadcrumb-item">
									<a href="/docs/main-page">{"Documents"}</a>
								</li>
							</ol>
						)}
						<ol className="breadcrumb mb-0">
							{breadCrumbData.length > 0 &&
								breadCrumbData.map((item, i) => (
									<li className="breadcrumb-item">
										<a
											href="javascript:void(0)"
											onClick={() =>
												i === breadCrumbData.length - 1
													? console.log(i)
													: onSelectNode(item)
											}
										>
											{item.name}
										</a>
									</li>
								))}
						</ol>
					</nav>
				)} */}
				{
					nodeData && <div className="breadcrumb-item">
						<a
							href="javascript:void(0)"
						>
							{nodeData.name}
						</a>
					</div>
				}
				<DropdownButton
					id="dropdown-basic-button"
					title={
						<span>
							<i className="fa fa-sharp fa-solid fa-plus"></i> Add
						</span>
					}
				>
					<Dropdown.Item
						onClick={() => setShowFolderModal({ open: true, data: nodeData })}
					>
						Add Folder
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => setShowFileModal({ open: true, data: nodeData })}
					>
						Add File
					</Dropdown.Item>
				</DropdownButton>
			</div>
			{nodeData && nodeData.children && nodeData.children.length > 0 && (
				<div className="col-md-12 border-bottom grid-table-heading">
					<div className="row m-0">
						<div className="col-md-3 fw-bold">Name</div>
						<div className="col-md-4 fw-bold">Last modified</div>
						<div className="col-md-3 fw-bold">Added By</div>
						<div className="col-md-2 fw-bold">Size</div>
					</div>
				</div>
			)}
			<div className="col-md-12 grid-table-body">
				{nodeData &&
					nodeData.children &&
					nodeData.children.map(
						(data, i) =>
							data.type === "Folder" && (
								<>
									{" "}
									<ContextMenuTrigger id={i + 1}>
										<div
											className="row row-highlight"
											onDoubleClick={() => onSelectNode(data)}
										>
											<div className="col-md-3 border-bottom py-1">
												<span className="me-2 file-type-icons">
													<i className="fa fa-folder" aria-hidden="true"></i>
												</span>
												{data.name}
											</div>
											<div className="col-md-4 border-bottom py-1">
												{moment(data.updatedAt).format("lll")}
											</div>
											<div className="col-md-3 border-bottom py-1">
												{data.createdBy && data.createdBy.name
													? data.createdBy.name
													: "-"}
											</div>
											<div className="col-md-2 border-bottom py-1">{"-"}</div>
										</div>
									</ContextMenuTrigger>
									<ContextMenu id={i + 1}>
										{/* <ContextMenuItem
											onClick={() =>
												setShowFolderModal({ open: true, data: data })
											}
										>
											Add Folder
										</ContextMenuItem> */}
										{/* <ContextMenuItem
											onClick={() =>
												setShowFileModal({ open: true, data: data })
											}
										>
											Add File
										</ContextMenuItem> */}
										<ContextMenuItem
											onClick={() =>
												setShowRenameModal({
													open: true,
													folderId: data._id,
													type: data.type,
													value: data.name,
												})
											}
										>
											Rename
										</ContextMenuItem>
										<ContextMenuItem
											disabled={data.isPublic}
											onClick={() =>
												setShowShareModal({
													open: true,
													id: data._id,
													type: data.type,
													name: data.name,
													permittedUsers: data.permittedUsers,
													data: data
												})
											}
										>
											Share
										</ContextMenuItem>
										<ContextMenuItem
											onClick={() =>
												setShowDeleteModal({
													open: true,
													folderId: data._id,
													type: data.type,
													data: data,
													from: "file-explorer"
												})
											}
										>
											Delete
										</ContextMenuItem>
										<ContextMenuItem
											onClick={
												() => handleCopyFolderLinkToClipboard(data)
											}
										>
											Copy public link  <img className="float-end mt-1" src={CopyLinkImage} />
										</ContextMenuItem>
										<div className="form-dropdown link-accessblity">
											<ContextMenuItem className="dropdown-item">
												Link accessibility <i className="fa-solid  fa fa-chevron-right" style={{ float: 'right', marginTop: '4px' }}></i>
											</ContextMenuItem>
											<div className="dropdown-content dropdown-submenu">
												<ul>
													<li onClick={() => handleOptionSelect({ text: 'Anyone with the link', accessMode: 'public', data })} style={{ cursor: 'pointer' }} className={data.accessMode === 'public' || !data.accessMode ? 'active' : ''} >
														Anyone with the link
													</li>
													<li onClick={() => handleOptionSelect({ text: 'Restricted', accessMode: 'private', data })} style={{ cursor: 'pointer' }} className={data.accessMode === 'private' ? 'active' : ''}>
														Restricted
													</li>
												</ul>
											</div>
										</div>
									</ContextMenu>
								</>
							)
					)}
				{nodeData &&
					nodeData.children &&
					nodeData.children.map(
						(data, i) =>
							data.type === "File" && (
								<>
									{" "}
									<ContextMenuTrigger id={i + 1}>
										<div className="row row-highlight"
											// onClick={() => onSelectNode(data)}
											onClick={() => handleFilPreViewClick(data)}
										>
											<div className="col-md-3 border-bottom py-1">
												<Link style={{ wordBreak: 'break-all' }} className="d-flex row-highlight" to="#">
													<span className="pdf-file-icon">
														<FileIcon
															extension={data.path.substring(
																data.path.lastIndexOf(".") + 1
															)}
															{...defaultStyles[
															data.path.substring(
																data.path.lastIndexOf(".") + 1
															)
															]}
														/>
													</span>
													{data.name}
												</Link>
											</div>
											<div className="col-md-4 border-bottom py-1">
												{moment(data.updatedAt).format("lll")}
											</div>
											<div className="col-md-3 border-bottom py-1">
												{data.createdBy && data.createdBy
													? data.createdBy.name
													: "-"}
											</div>
											<div className="col-md-2 border-bottom py-1">
												{filesize(data.fileSize, {
													base: 2,
													standard: "jedec",
												})}
											</div>
										</div>
									</ContextMenuTrigger>
									<ContextMenu id={i + 1}>
										{["jpg", "png", "gif", "txt", "pdf"].includes(
											data.path.substring(data.path.lastIndexOf(".") + 1)
										) ? (
											<ContextMenuItem
												onClick={
													() => handlePreviewClick(data._id)
													// setShowPreviewModal({
													// 	open: true,
													// 	folderId: data._id,
													// 	type: data.path.substring(
													// 		data.path.lastIndexOf(".") + 1
													// 	),
													// 	value: data.path,
													// })
												}
											>
												Preview
											</ContextMenuItem>
										) : (
											<ContextMenuItem
												onClick={() => handleDownloadClick(data)}
											>
												Preview
											</ContextMenuItem>
										)}
										<ContextMenuItem
											onClick={() =>
												setShowRenameModal({
													open: true,
													folderId: data._id,
													type: data.type,
													value: data.name,
													permittedUsers: data.permittedUsers,
												})
											}
										>
											Rename
										</ContextMenuItem>
										<ContextMenuItem onClick={() => handleDownloadClick(data)}>
											Download
										</ContextMenuItem>
										<ContextMenuItem
											disabled={data.isPublic}
											onClick={() =>
												setShowShareModal({
													open: true,
													id: data._id,
													type: data.type,
													name: data.name,
													permittedUsers: data.permittedUsers,
													data: data
												})
											}
										>
											Share
										</ContextMenuItem>
										<ContextMenuItem
											onClick={() =>
												setShowDeleteModal({
													open: true,
													folderId: data._id,
													type: data.type,
													data: data,
													from: "file-explorer"
												})
											}
										>
											Delete
										</ContextMenuItem>
										<ContextMenuItem
											onClick={
												() => copyLinkToClipboard(data)
											}
										>
											Copy public link  <img className="float-end mt-1" src={CopyLinkImage} />
										</ContextMenuItem>
										<div className="form-dropdown link-accessblity">
											<ContextMenuItem className="dropdown-item">
												Link accessibility <i className="fa-solid  fa fa-chevron-right" style={{ float: 'right', marginTop: '4px' }}></i>
											</ContextMenuItem>
											<div className="dropdown-content dropdown-submenu">
												<ul>
													<li onClick={() => handleOptionSelect({ text: 'Anyone with the link', accessMode: 'public', data })} style={{ cursor: 'pointer' }} className={data.accessMode === 'public' || !data.accessMode ? 'active' : ''} >
														Anyone with the link
													</li>
													<li onClick={() => handleOptionSelect({ text: 'Restricted', accessMode: 'private', data })} style={{ cursor: 'pointer' }} className={data.accessMode === 'private' ? 'active' : ''}>
														Restricted
													</li>
												</ul>
											</div>
										</div>
									</ContextMenu>
									{/* loader code */}
									{
										isDownloading && (
											<div className="download-loader">
												<div className="spinner"></div>
												<span>Preparing your download...</span>
											</div>
										)
									}
								</>
							)
					)}
				{nodeData && nodeData.type === "Folder" && (
					<>
						<div className="m-4 drag_drop_section">
							{loading && <Loader />}
							<FileUploader
								key={fileUploaderKey} // Reset component on key change
								classes="drop_area"
								// label="Drag & Drop/Upload File here"
								label={labelText}
								onDrop={addFile}
								onSelect={addFile}
								name="file"
								types={fileTypes}
							/>
						</div>
					</>
				)}
			</div>
			{showFolderModal.open && (
				<AddNewFolder
					show={showFolderModal.open}
					onHide={handleCloseFolder}
					data={showFolderModal.data}
					updateBreadCrumArray={callBackForAddDoc}
					callback={callback}
				/>
			)}
			{showFileModal.open && (
				<AddNewFile
					show={showFileModal.open}
					onHide={handleCloseFile}
					data={showFileModal.data}
					updateBreadCrumArray={callBackForAddDoc}
					callback={callback}
				/>
			)}
			{showDeleteModal.open && (
				<DeleteFileOrFolderModal
					show={showDeleteModal.open}
					onHide={handleCloseDeleteModal}
					folderId={showDeleteModal.folderId}
					type={showDeleteModal.type}
					nodeData={nodeData}
					targetedData={showDeleteModal.data}
					callback={callback}
					data={showDeleteModal.data}
					updateBreadCrumArray={callBackForAddDoc}
					from={showDeleteModal.from}
				/>
			)}
			{showRenameModal.open && (
				<RenameModal
					show={showRenameModal.open}
					onHide={handleCloseRenameModal}
					folderId={showRenameModal.folderId}
					type={showRenameModal.type}
					name={showRenameModal.value}
				/>
			)}
			{showPreviewModal.open && (
				<PreviewFileModal
					show={showPreviewModal.open}
					onHide={handleClosePreviewModal}
					folderId={showPreviewModal.folderId}
					type={showPreviewModal.type}
					name={showPreviewModal.value}
				/>
			)}
			{shareModal.open && (
				<ShareDocumentModal
					show={shareModal.open}
					onHide={handleCloseShareModal}
					id={shareModal.id}
					type={shareModal.type}
					name={shareModal.name}
					permittedUsers={shareModal.permittedUsers}
					targetedData={shareModal.data}

				/>
			)}
		</>
	);
};

export default FileExplorer;
