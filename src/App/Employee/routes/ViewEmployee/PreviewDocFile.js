import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { USER } from "../../../../constants/AppConstants";
import { toast } from "react-toastify";
import { httpClient } from "../../../../constants/Api";
import FilePreviewer from "react-file-previewer";
import FileViewer from "react-file-viewer";

export const PreviewDocFile = () => {
	const { docId } = useParams();
	const [loading, setLoading] = useState(false);
	const [docuementData, setDocumentData] = useState();
	const [fileType, setFileType] = useState();

	useEffect(() => {
		if (docId) {
			getDocumentData(docId);
		}
	}, []);

	const getDocumentData = async (docId) => {
		try {
			setLoading(true);
			const data = await httpClient.get(
				USER.GET_VERIFICATION_DETAILS_BY_USER_ID.replace('{id}', docId)
			);
			const docData = data.data.verificationDetails;
			const type = docData.document_image.substring(docData.document_image.lastIndexOf(".") + 1);
			setDocumentData(docData);
			setFileType(type);
		} catch (err) {
			console.log(err);
			if (err.response) toast.error(err.response.data.message);
			else toast.error("Error in fetching doc");
		} finally {
			setLoading(false);
		}
	};

	const populatePre = (url) => {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			document.getElementById("contents").textContent = this.responseText;
		};
		xhr.open("GET", url);
		xhr.send();
	};

	useEffect(() => {
		if (docuementData && fileType === "txt") {
			populatePre(docuementData.document_image);
		}
	}, [docuementData, fileType]);

	return (
		<>
			<div className="container-fluid" style={{padding: "2% 10%"}}>
				{docuementData && (
					<>
						{fileType === "pdf" && (
							<FilePreviewer
								file={{
									url: docuementData.document_image,
									hideControls: true,
								}}
							/>
						)}
						{fileType === "txt" && <pre id="contents"></pre>}
						{fileType !== "pdf" && fileType !== "txt" && (
							<FileViewer
								filePath={docuementData.document_image}
								fileType={fileType}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
};
