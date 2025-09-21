import React, { useState, useEffect } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRequests } from "../../../redux/actions/ChangeRequestActions";
import { httpClient } from "../../../constants/Api";
import { REQUEST } from "../../../constants/AppConstants";

function Dashboard() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState({
    data: [],
    total: 0,
    hasMore: true
  });
  const [show, setShow] = useState(false);
  const [empId, setEmpId] = useState("");
  const [deletedData, setDeletedData] = useState("")
  const [page, setPage] = useState(1); // Start from page 1
  const limit = 10; // Number of items per page

  useEffect(() => {
    const updateSeenNotifications = async () => {
      await httpClient
        .put(REQUEST.UPDATE_SEEN_NOTIFICATIONS)
        .then((res) => {
          if (res.status === 200) {
            dispatch(getRequests());
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    };

    updateSeenNotifications();
    getChangeRequests();
  }, []);

  const handleClose = () => setShow(false);

  const handleShow = (data) => {
    setShow(true);
    setEmpId(data);
    setDeletedData(data);
  };

  const getChangeRequests = async () => {
    try {
      const res = await httpClient.get(
        `${REQUEST.GET_REQUEST}?page=${page}&limit=${limit}`
      );
      
      if (res.status === 200) {
        const newData = res.data.result.data;
        const totalItems = res.data.result.total;
        
        setRequests(prev => ({
          data: [...prev.data, ...newData],
          total: totalItems,
          hasMore: (prev.data.length + newData.length) < totalItems
        }));
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const fetchMoreData = () => {
    if (requests.hasMore) {
      setPage(prevPage => prevPage + 1);
      getChangeRequests();
    }
  };

  const removeRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await httpClient.post(REQUEST.REMOVE_REQUEST, { id: empId._id, deletedData });
      if (res.status === 200) {
        setRequests(prev => ({
          ...prev,
          data: prev.data.filter(item => item._id !== empId._id),
          total: prev.total - 1
        }));
        toast.success("Removed Successfully");
        handleClose();
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
      <div className="main_content_panel">
        <div className="row">
          <div className="main_content_panel container ">
            <div className="row ">
              <div className="offset-lg-2 col-lg-8 ">
                <div className="header_title">
                  <h1><span>All</span> Notifications</h1>
                </div>
              </div>
              <div className="offset-lg-2 col-lg-8 mb-4">
                <div className="dashboard_card">
                  <InfiniteScroll
                    dataLength={requests.data.length}
                    next={fetchMoreData}
                    hasMore={requests.hasMore}
                    loader={
                      <div className="text-center py-3">
                        <h4>Loading more notifications...</h4>
                      </div>
                    }
                    endMessage={
                      requests.data.length > 0 && (
                        <div className="text-center py-3">
                          <p>You've seen all notifications</p>
                        </div>
                      )
                    }
                    scrollableTarget="dashboard_card"
                  >
                    {requests.data.length > 0 ? (
                      requests.data.map((data, i) => (
                        <div
                          className="notification notification-closable list-group-item p-3"
                          role="alert"
                          key={i}
                        >
                          <div className="d-flex justify-content-between mb-3">
                            <div className="noti_sender_time">
                              <strong>{data.user_id?.name} </strong>{" "}
                              <span>
                                {moment(data.createdAt).format("D MMMM YYYY")}
                              </span>
                            </div>
                            <div>
                              {data.type === "Status Added" && (
                                <Link
                                  to={`/project/project-messages/${data.statusSubject_id}?selectedUserId=sales_status`}
                                >
                                  <button
                                    title="View Request"
                                    type="button"
                                    className="border-0  close btn-success mx-1"
                                    style={{ borderRadius: "5px" }}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                  </button>
                                </Link>
                              )}
                              {data.type === "Project Status Added" && (
                                <Link
                                  to={`/project/project-update/all-messages/${data.project_id}/${data.statusSubject_id}`}
                                >
                                  <button
                                    title="View Request"
                                    type="button"
                                    className="border-0  close btn-success mx-1"
                                    style={{ borderRadius: "5px" }}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                  </button>
                                </Link>
                              )}
                              {data.type === "Change Request" && (
                                <Link
                                  to={`/employee/attendence-detail/${data.user_id.id}`}
                                >
                                  <button
                                    type="button"
                                    className="border-0  close btn-success mx-1"
                                    style={{ borderRadius: "5px" }}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                  </button>
                                </Link>
                              )}
                              {(data.type === "Leave Request" || data.type === "WFH Request") && (
                                <Link
                                  to={`/employee/attendence-detail/${data.user_id?.id}`}
                                >
                                  <button
                                    title="View Request"
                                    type="button"
                                    className="border-0  close btn-success mx-1"
                                    style={{ borderRadius: "5px" }}
                                  >
                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                  </button>
                                </Link>
                              )}
                              <button
                                title="Remove Request"
                                type="button"
                                className="border-0 close danger mx-1 hover-zoom"
                                data-close="notification"
                                onClick={(e) => handleShow(data)}
                                style={{ borderRadius: "5px", backgroundColor: "red" }}
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
                          <p>{data.request_message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-center">
                        <h5>No Records to Display.</h5>
                      </div>
                    )}
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Confirm Remove Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ paddingBottom: "10px" }}>
            Are you sure you want to remove this request?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={removeRequest}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Dashboard;