import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../constants/Api";
import { PROJECT } from "../../constants/AppConstants";
import { useParams } from "react-router-dom";
import MessageModal from "./Modals/Message.Modal";
import BlankImage from "../../assets/images/dummy_profile.jpeg"
import moment from "moment";
import ViewMessageModal from "./Modals/ViewMessage.Modal";
import EditMessageModal from "./Modals/EditMessage.Modal";

function UserProjectUpdates() {
    const { userId } = useParams();
    const [showDialog, setShowDialog] = useState({ open: false, id: "" });
    const [showViewMessage, setShowViewMessage] = useState({open:false, subject:"",message:""});
    const [showEditMessage, setShowEditMessage] = useState({ open: false, id: "" });
    const [data, setData] = useState([]);
    const [projectDetails, setProjectDetails] = useState("")

    useEffect(() => {
        getUserStatuses();
        handleClose();
    }, []);

    const handleClose = () => {
        setShowDialog(false);
        setShowViewMessage(false);
        setShowEditMessage(false)
        getUserStatuses();
    };
    const getUserStatuses = async () => {
        try {
            const res = await httpClient
                .get(PROJECT.GET_PROJECT_UPDATES_BY_ID.replace("{userId}", userId));
            if (res.status === 200) {
                setData(res.data.result.projectUpdates);
                setProjectDetails(res.data.result.projectDetails)
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };
    const parser = (data) => {
        return <div dangerouslySetInnerHTML={{
            __html: data
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">"),
        }} />
    }

    return (
        <>
            <div className="main_content_panel container">
                <div className="header_title d-block d-lg-flex">
                    <h1>
                        <span>Users Updates</span>
                    </h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-10 mb-4">
                        <div className="dashboard_card">
                            <div className="projects-update-wrapper">
                                <div className="row">
                                    <div className="col-md-8">
                                    <div className="header-title-wrap">
                                            <h4 className="head-title-info">{projectDetails?.name}</h4>
                                            <p className="description-info">
                                                {projectDetails?.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="last-project-updates-wrap pt-4">
                                    <div className="head-title-wrap mb-4">
                                        <h5 className="head-title-info col-red fw-light">
                                            Latest Project Updates
                                        </h5>
                                    </div>
                                    {data?.filter(data => moment(data.createdAt).format('ll') == moment().format('ll'))?.map((data, i) => (
                                        <div className="last-project-updates-info" key={i}>
                                            <div className="project-updates-content-info pb-2">
                                                <div className="date-wrap pe-4">
                                                    <h6 className="date-info m-0"><strong>{moment(data.createdAt).format('ll')}</strong></h6>
                                                </div>
                                                <div className="user-name-wrap pe-1">
                                                    <span>{data.user_id.name} Commented on </span>
                                                </div>
                                                <div className="follow-up-wrap">
                                                    <div className="follow-up-info text-primary text-decoration-underline">{data.subject}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="discussions-data-wrap">
                                    <div className="discussions-data-info pt-4 mt-4 pb-3">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="content-wrap">
                                                    <div className="head-title-wrap">
                                                        <h5 className="head-title-info col-red fw-light m-0 pe-4">Discussions</h5>
                                                    </div>
                                                    {/*<div className="post-new-message-wrap">
                                                      <button type="button" className="btn btn-default border rounded-3" onClick={() => {
                                                            setShowDialog(true);
                                                        }}>Post a new message</button>
                                                    </div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {data?.map((data, i) => (
                                    <div className="discussions-list-wrap" key={i}>
                                        <div className="discussions-list-content-info pb-2" onClick={(e) =>
                                            setShowViewMessage({
                                                open: true,
                                                subject: data.subject,
                                                message: data.message,
                                            })}
                                            style={{ cursor: "pointer" }}>
                                            <hr />
                                            <div className="user-name-wrap">

                                                <div className="d-flex align-items-center">
                                                    <div className="img-wrap me-2">
                                                        {<img src={data.user_id.profile_image ? data.user_id.profile_image : BlankImage} alt="profile_image" />}
                                                    </div>
                                                    <span>{data.user_id.name} </span>
                                                </div>
                                            </div>
                                            <div className="follow-up-wrap">
                                                <div className="follow-up-info me-2 text-primary text-decoration-underline">{data.subject}</div>
                                                <div className="pu-message-wrap">{parser(data.message)}</div>
                                            </div>
                                            <div className="date-wrap">
                                                <h6 className="date-info m-0 d-flex justify-content-evenly">
                                                    <span>{moment(data.createdAt).format('ll')}</span>
                                                    <span className="total-count-info"><div className="btn-group dropend">
                                                        {/*<button
                                                  className="btn "
                                                  type="button"
                                                  id="dropdownMenu2"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                >
                                                  <i
                                                    className="fa fa-ellipsis-v"
                                                    aria-hidden="true"
                                                  ></i>
                                                </button> <ul
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenu2"
                                              >
                                                <li>
                                                  <button
                                                    className="dropdown-item text-success"
                                                    type="button"
                                                    onClick={(e) =>
                                                        setShowViewMessage({
                                                          open: true,
                                                          data : data,
                                                        })
                                                      }
                                                  >
                                                    View
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                    className="dropdown-item text-danger"
                                                    type="button"
                                                    onClick={(e) =>
                                                        setShowEditMessage({
                                                        open: true,
                                                        data : data,
                                                      })
                                                    }
                                                  >
                                                    Edit
                                                  </button> 
                                                </li>
                                              </ul>*/}</div></span>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {showDialog && (
                    <MessageModal
                        show={showDialog}
                        onHide={handleClose}
                    />
                )}
                {showViewMessage && (
                    <ViewMessageModal
                        show={showViewMessage}
                        onHide={handleClose}
                    />
                )}
            </div>
        </>
    );
}

export default UserProjectUpdates;
