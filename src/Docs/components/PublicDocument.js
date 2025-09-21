import React, { useEffect, useState } from "react";
import { httpClient } from "../../constants/Api";
import { useParams, Link, useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import { DOCS } from "../../constants/AppConstants";
import moment from "moment";
import { FileIcon, defaultStyles } from "react-file-icon";
import { filesize } from "filesize";
import { saveAs } from "file-saver";
import kisLogo from "../../assets/images/logo.png";

const PublicDocuments = () => {
    const { folderId } = useParams();  // Retrieve folderId from URL
    const history = useHistory();        // Initialize useHistory
    const [nodeData, setNodeData] = useState();
    const [loading, setLoading] = useState(false);
    const [allDirectories, setAllDirectories] = useState([]);

    useEffect(() => {
        if (folderId) {
            getFolderData(folderId);  // Fetch folder data based on the folderId
        }
    }, [folderId]);

    const getFolderData = async (folderId) => {
        try {
            setLoading(true);
            const response = await httpClient.get(DOCS.GET_FOLDER_PUBLIC_URL_DATA.replace("{folderId}", folderId));
            if (response.status === 200) {
                    setNodeData(response.data.result.getFomattedData);
                    const flattanDirectories = await flattanTheArray([
                        response.data.result.getFomattedData,
                        response.data.result.getFomattedData.children,
                    ]);
                    setAllDirectories(flattanDirectories);
            }
        } catch (err) {
            console.log({err});
            if(err.response.data.code === 401 && err.response.data.message === "Authorization failed."){
                history.push("/login");
                toast.warning("Permission required to access this folder.");
            }else{
                console.error("Error fetching folder data", err);
                toast.error("Error in fetching folder data");
            }
        } finally {
            setLoading(false);
        }
    };

    const onSelectNode = async (nodeData) => {
        if (nodeData.type === "Folder") {
            // Update the URL with the selected folder ID using history.push
            history.push(`/kis-attendance/public-docs/folder/${nodeData._id}`);
            // Fetch child data when a folder is clicked
            // getFolderData(nodeData._id);  // Assuming nodeData has the folder's _id
        }
    };

    function flattanTheArray(array) {
        var result = [];
        array.forEach(function (a) {
            if (a.type === "Folder") {
                result.push(a);
                if (Array.isArray(a.children)) {
                    result = result.concat(flattanTheArray(a.children));
                }
            }
        });
        return result;
    }

    const handleFilPreViewClick = (data) => {
        {
            ["jpg", "png", "gif", "txt", "pdf"].includes(
                data.path.substring(data.path.lastIndexOf(".") + 1)
            ) ? handlePreviewClick(data._id) : handleDownloadClick(data)
        }
    }

    const handlePreviewClick = (docID) => {
        const type = "doc_vault";
        window.open(`/kis-attendance/preview/public-doc/${docID}?type=${type}`, "_blank");
    };

    // const handleDownloadClick = (data) => {
    //     history.push(`/kis-attendance/public-docs/file/${data._id}`);
    //     // const url = data.path;
    //     // fetch(url)
    //     //     .then((response) => {
    //     //         if (!response.ok) {
    //     //             throw new Error("Network response was not ok");
    //     //         }
    //     //         return response.blob();
    //     //     })
    //     //     .then((blob) => {
    //     //         const fileExtension = data.path.substring(
    //     //             data.path.lastIndexOf(".") + 1
    //     //         );
    //     //         const fileName = data.name + "." + fileExtension;
    //     //         saveAs(blob, fileName);
    //     //     })
    //     //     .catch((error) => {
    //     //         console.error("There was a problem with the fetch operation:", error);
    //     //     });
    // };

    const handleDownloadClick = (data) => {
        const url = `/kis-attendance/public-docs/file/${data._id}`;
        window.open(url, "_blank"); // Opens the URL in a new tab
    };
    

    return (
        <>
        <div className="public-doc">
                <div className="copy-link-document bg-white">
                    <div className="link-document-logo">
                        <img src={kisLogo} className="img-fluid" />
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Last modified</th>
                                <th scope="col">Added By</th>
                                <th scope="col">Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodeData &&
                                nodeData.children &&
                                nodeData.children.map(
                                    (data, i) =>
                                        data.type === "Folder" && (
                                            <tr key={i + 1} onDoubleClick={() => onSelectNode(data)}>
                                                <td>
                                                    <span className="me-2 file-type-icons">
                                                        <i className="fa fa-folder" aria-hidden="true"></i>
                                                    </span>
                                                    {data.name}
                                                </td>
                                                <td>{moment(data.updatedAt).format("lll")}</td>
                                                <td>{data.createdBy && data.createdBy.name
                                                    ? data.createdBy.name
                                                    : "-"}</td>
                                                <td>{"-"}</td>
                                            </tr>
                                        )
                                )}
                            {nodeData &&
                                nodeData.children &&
                                nodeData.children.map(
                                    (data, i) =>
                                        data.type === "File" && (
                                            <tr key={i + 1} onClick={() => handleFilPreViewClick(data)}>
                                                <td>
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
                                                </td>
                                                <td>{moment(data.updatedAt).format("lll")}</td>
                                                <td>{data.createdBy && data.createdBy.name
                                                    ? data.createdBy.name
                                                    : "-"}</td>
                                                <td>
                                                    {filesize(data.fileSize, {
                                                        base: 2,
                                                        standard: "jedec",
                                                    })}
                                                </td>
                                            </tr>
                                        )
                                )}
                        </tbody>
                    </table>
                    {
                      nodeData && nodeData.children.length === 0 && (
                      <p className="text-center mt-5 no-records">No records to display</p>)
                    }
                </div>          
            </div>
        </>
    );
};

export default PublicDocuments;

