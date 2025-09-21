import React, { useEffect, useState } from "react";
import { httpClient } from "../../constants/Api";
import { useParams, useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import { DOCS } from "../../constants/AppConstants";
import { saveAs } from "file-saver";
import FilePreviewer from "react-file-previewer";
import FileViewer from "react-file-viewer";

const PublicFileDocument = () => {
    const { fileId } = useParams();  // Retrieve folderId from URL
    const history = useHistory();        // Initialize useHistory
    const [loading, setLoading] = useState(false);
    const [docuementData, setDocumentData] = useState();
    const [fileType, setFileType] = useState();
    const [downloading, setDownloading] = useState(false); // State for download progress

    useEffect(() => {
        if (fileId) {
            getFileData(fileId);  // Fetch folder data based on the folderId
        }
    }, []);

    const getFileData = async (fileId) => {
        try {
            setLoading(true);
            const response = await httpClient.get(DOCS.GET_FILE_PUBLIC_URL_DATA.replace("{fileId}", fileId));
            if (response.status === 200) {
                const docData = response.data.result;
                const fileType = docData.path.substring(docData.path.lastIndexOf(".") + 1);
                const supportedPreviewExtensions = ["jpg", "png", "gif", "txt", "pdf"];
                if (supportedPreviewExtensions.includes(fileType)) {
                    setDocumentData(docData);
                    setFileType(fileType);
                }
                handleFilPreViewClick(response.data.result);
            }
        } catch (err) {
            if (err.response.data.code === 401 && err.response.data.message === "Authorization failed.") {
                history.push("/login");
                toast.warning("Permission required to access this file.");
            } else {
                console.error("Error fetching folder data", err);
                toast.error("Error in fetching folder data");
            }
        } finally {
            setLoading(false);
        }
    };

    // const handleFilPreViewClick = (data) => {
    //     console.log({data});
    //     {
    //         ["jpg", "png", "gif", "txt", "pdf"].includes(
    //             data.path.substring(data.path.lastIndexOf(".") + 1)
    //         ) ? handlePreviewClick(data._id) : handleDownloadClick(data)
    //     }
    // }

    const handleFilPreViewClick = (data) => {
        const type = "doc_vault";
        const fileExtension = data.path.substring(data.path.lastIndexOf(".") + 1).toLowerCase();
        const supportedPreviewExtensions = ["jpg", "png", "gif", "txt", "pdf"];
        let targetUrl = '';
        if (supportedPreviewExtensions.includes(fileExtension)) {
            targetUrl = `/kis-attendance/public-docs/file/${data._id}`
        } else {
            targetUrl = `/kis-attendance/public-docs/file/${data._id}?type=${type}`;
        }

        // Check if already at the target URL
        if (window.location.pathname === targetUrl) {
            console.log("Already at the target URL");
            return; // Prevent infinite loop
        }

        if (supportedPreviewExtensions.includes(fileExtension)) {
            // Navigate directly to the file's public URL for supported extensions
            window.location.href = targetUrl;
        } else {
            // Trigger file download for unsupported preview formats
            handleDownloadClick(data);
        }
    };

    // const handlePreviewClick = (docID) => {
    //     console.log({docID});
    //     const type = "doc_vault";
    //     // window.open(`/kis-attendance/preview/public-doc/${docID}?type=${type}`, "_blank");
    //     window.open(`/kis-attendance/preview/public-doc/${docID}?type=${type}`);
    //     // window.open(`/kis-attendance/public-docs/file/${docID}`);
    // };

    const handleDownloadClick = (data) => {
        setDownloading(true); // Set download progress state
        const url = data.path;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.blob();
            })
            .then((blob) => {
                const fileExtension = data.path.substring(
                    data.path.lastIndexOf(".") + 1
                );
                const fileName = data.name + "." + fileExtension;
                saveAs(blob, fileName);
            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            })
            .finally(() => {
                setTimeout(() => setDownloading(false), 500); // Remove loader after download starts
            });
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
            populatePre(docuementData.path);
        }
    }, [docuementData, fileType]);

    return (
        <>
            {/* <div className="container-fluid" style={{padding: "2% 10%"}}>
				{docuementData && (
					<>
						{fileType === "pdf" && (
							<FilePreviewer
								file={{
									url: docuementData.path,
									hideControls: true,
								}}
							/>
						)}
						{fileType === "txt" && <pre id="contents"></pre>}
						{fileType !== "pdf" && fileType !== "txt" && (
							<FileViewer
								filePath={docuementData.path}
								fileType={fileType}
							/>
						)}
					</>
				)}
			</div> */}

            <div className="container-fluid" style={{ padding: "2% 10%" }}>
                {loading ? (
                    <p>Loading...</p>
                ) : downloading ? (
                    <p>Downloading in progress...</p>
                ) : docuementData && (
                    <>
                        {fileType === "pdf" && (
                            <FilePreviewer
                                file={{
                                    url: docuementData.path,
                                    hideControls: true,
                                }}
                            />
                        )}
                        {fileType === "txt" && <pre id="contents"></pre>}
                        {fileType !== "pdf" && fileType !== "txt" && (
                            <FileViewer
                                filePath={docuementData.path}
                                fileType={fileType}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default PublicFileDocument;

