import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { Popover, OverlayTrigger } from "react-bootstrap";
import { httpClient } from "../../../constants/Api";
import { LEAVES } from "../../../constants/AppConstants";
import RejectLeave from "../components/Modals/RejectLeave";
import { saveAs } from "file-saver";

function LeaveHistory() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  // const [searchAlphaTerm, setSearchAlphaTerm] = useState("");
  let [initialValue, setInitialValue] = useState("");
  let [searchValue, setSearchValue] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  let [optionValue, setOptionValue] = useState("");
  let [leaveData, setleaveData] = useState([]);
  let [updatedList, setLeaveUpdateData] = useState("");
  let [total, setDataBind] = useState("");
  let [page, setPage] = useState(0);
  const [show, setShow] = useState({ open: false, leaveId: "" });
  const alpha = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  useEffect(() => {
    getUserLeaves(initialValue, searchValue, optionValue, page);
  }, [userId]);

  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue);
    updatedList = "";
    leaveData = "";
    page = 0;
    setPage(page);
    setleaveData(leaveData);
    setLeaveUpdateData(updatedList);
    getUserLeaves(initValue, searchValue, optionValue, page);
  };

  const handleSearchValue = (e) => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(e.target.value)) {
      toast.error("Special Characters Not Allowed")
    }else{
    const searchInitValue = e.target.value;
    setSearchValue(searchInitValue);
    updatedList = "";
    leaveData = "";
    page = 0;
    setPage(page);
    setleaveData(leaveData);
    setLeaveUpdateData(updatedList);
    getUserLeaves(initialValue, searchInitValue, optionValue, page);
    }
  };

  const handleOptionValue = (e) => {
    const optionInitValue = e.target.value;
    setOptionValue(optionInitValue);
    updatedList = "";
    leaveData = "";
    page = 0;
    setPage(page);
    setleaveData(leaveData);
    setLeaveUpdateData(updatedList);
    getUserLeaves(initialValue, searchValue, optionInitValue, page);
  };

  const getUserLeaves = async (
    initValue,
    searchInitValue,
    optionInitValue,
    page
  ) => {
    try {
      setPage(page + 1);
      setLoading(true);
      await httpClient
        .get(
          `${LEAVES.GET_ALL_EMPLOYEE_LEAVES}?page=${
            page + 1
          }&alphaTerm=${initValue}&searchText=${searchInitValue}&optionTerm=${optionInitValue}`
        )
        .then((res) => {
          if (res.status === 200) {
            if (!updatedList) {
              setDataToBind(res.data.leaves.data);
              setDataBind(res.data.leaves.total);
              setLoading(false);
            } else {
              const updatedData = [...updatedList, ...res.data.leaves.data];
              setDataToBind(updatedData);
              setLoading(false);
            }
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time) => {
    return moment(time, "h:m").format("hh:mm A");
  };

  const fetchMoreData = () => {
    getUserLeaves(initialValue, searchValue, optionValue, page);
  };

  const setDataToBind = (response) => {
    setleaveData(response);
    setLeaveUpdateData(response);
  };

  const resetSearch = () => {
    setInitialValue("");
    setSearchValue("");
    setOptionValue("");
    updatedList = "";
    page = 0;
    initialValue = "";
    searchValue = "";
    optionValue = "";
    getUserLeaves(initialValue, searchValue, optionValue, page);
  };

  const approveLeave = async (leaveId) => {
    try {
      await httpClient
        .put(LEAVES.APPROVE_LEAVE.replace("{id}", leaveId), {
          userId: userId,
          status: "approved",
        })
        .then((res) => {
          if (res.status === 200) {
            window.location.reload();
            getUserLeaves(initialValue, searchValue, optionValue, page);
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  const rejectLeave = async (reason) => {
    try {
      const formModal = {
        reject_reason: reason,
        userId: userId,
        status: "rejected",
      };
      await httpClient
        .put(LEAVES.REJECT_LEAVE.replace("{id}", show.leaveId), formModal)
        .then((res) => {
          if (res.status === 200) {
            window.location.reload();
            getUserLeaves(initialValue, searchValue, optionValue, page);
            toast.success(res.data.message);
            handleClose();
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const canceLeave = async (leaveId) => {
    try {
      await httpClient
        .put(LEAVES.CANCEL_LEAVE.replace("{id}", leaveId))
        .then((res) => {
          if (res.status === 200) {
            window.location.reload();
            getUserLeaves(initialValue, searchValue, optionValue, page);
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setShow({ open: false });
  };

  const handleFilPreViewClick = (data) => {
		{["jpg", "png", "gif", "txt", "pdf"].includes(
			data.path.substring(data.path.lastIndexOf(".") + 1)
		) ? handlePreviewClick(data._id) : handleDownloadClick(data)
	  }
  }

  const handlePreviewClick = (docID) => {
    const type = "sick_leave_attachment";
    window.open(`/preview/${docID}?type=${type}`, "_blank");
		// window.open("/preview/" + docID, "_blank"); //open preview in new Tab
	};

  const handleDownloadClick = (data) => {
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
				const fileName = data.file_name + "." + fileExtension;
				saveAs(blob, fileName);
			})
			.catch((error) => {
				console.error("There was a problem with the fetch operation:", error);
			});
	};


  return (
    <>
      <div
        className="main_content_panel  employees-leaves-page"
        style={{ width: "100%" }}
      >
        <div className="header_title">
          <h1>
            <span>Leaves</span> History
          </h1>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard_card employee_lists">
              <div className="card_title calender_heading">
                <div className="d-lg-flex w-100 justify-content-end">
                  <div className="col-lg-3 me-lg-3 mb-3 mb-lg-0">
                    <div className="dropdown_icon">
                      <select
                        className="form-control rounded-50"
                        aria-label="Default select example"
                        onChange={handleOptionValue}
                        value={optionValue}
                      >
                        <option value="">Leave Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group has-search mb-3 mb-lg-0">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name"
                      value={searchValue}
                      onChange={handleSearchValue}
                    />
                  </div>
                  <button
                    className="btn btn-primary text-nowrap ms-lg-3 rounded-pill"
                    onClick={resetSearch}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
              <div className="filter_letters">
                <ul>
                  <li className=""></li>
                </ul>
              </div>
              <div className="filter_letters">
                <ul>
                  {alpha.map((data, i) => (
                    <li
                      className={initialValue === data ? "active" : ""}
                      key={i}
                    >
                      <Link
                        to="#"
                        data-target={data}
                        onClick={handleInitialValue}
                      >
                        {data}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="employee_table table-responsive leave-history-table">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Employee Id</th>
                      <th scope="col">Date</th>
                      <th scope="col">Time</th>
                      <th scope="col">Type</th>
                      <th scope="col">Duration</th>
                      <th scope="col" className="text-nowrap">
                        Comp Off Date
                      </th>
                      <th scope="col">Reason of Leave</th>
                      <th scope="col">Status</th>
                      <th scope="col">Requested To</th>
                      <th scope="col">Action</th>
                      {/* <th scope="col">Team Lead</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {updatedList?.length > 0 &&
                      updatedList.map((leave, i) => (
                        <tr key={i}>
                          <td className="text-nowrap">
                            {leave?.user_id[0]?.name}
                          </td>
                          <td className="text-nowrap">
                            {leave?.user_id[0]?.emp_id}
                          </td>
                          <td className="text-nowrap">
                            <span> {moment(leave.from).format("L")}</span>
                            {leave.type === "Half Day" ||
                            leave.type === "Short Leave" ||
                            moment(
                              moment(leave.from).format("YYYY/MM/DD")
                            ).isSame(
                              moment(moment(leave.to).format("YYYY/MM/DD"))
                            )
                              ? ""
                              : "-" + moment(leave.to).format("L")}
                          </td>
                          <td className="text-nowrap">
                            {" "}
                            {leave.start_time
                              ? formatTime(leave.start_time)
                              : "-- : --"}{" "}
                            -{" "}
                            {leave.end_time
                              ? formatTime(leave.end_time)
                              : "-- : --"}
                          </td>
                          <td>{leave.type}</td>
                          <td className="text-nowrap">{leave.duration}</td>
                          <td className="text-nowrap">
                            {" "}
                            {leave.comp_off_date
                              ? moment(leave.comp_off_date).format("L")
                              : "-"}
                          </td>
                          <td>{leave.leave_reason}</td>
                          <td className="text-nowrap">
                            {leave.status === "pending" && (
                              <span className=" text-capitalize badge bg-warning">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "approved" && (
                              <span className=" text-capitalize badge bg-success">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "cancelled" && (
                              <span className=" text-capitalize badge bg-dark">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "absent" && (
                              <span className=" text-capitalize badge bg-danger">
                                {leave.status}
                              </span>
                            )}
                            {leave.status === "rejected" && (
                              <div className="d-flex">
                                <span
                                  className=" text-capitalize badge bg-danger"
                                  style={{ marginRight: "5px" }}
                                >
                                  {leave.status}
                                </span>
                                <OverlayTrigger
                                  placement="bottom"
                                  trigger="click"
                                  rootClose
                                  overlay={
                                    <Popover>
                                      <Popover.Title as="h6">
                                        Reject Reason
                                      </Popover.Title>
                                      <Popover.Content>
                                        {leave.reject_reason}
                                      </Popover.Content>
                                    </Popover>
                                  }
                                >
                                  <i
                                    className="fa fa-commenting"
                                    aria-hidden="true"
                                    style={{ fontSize: "20px" }}
                                  ></i>
                                </OverlayTrigger>
                              </div>
                            )}
                          </td>
                          { leave.approved_by && leave.approved_by.length > 0 ? 
                            <td>{leave.approved_by[0].name}</td> :
                            <td></td>
                          }
                          <td className="action_lh">
                            {leave.status === "pending" && (
                              <div className="btn-group dropend">
                                <button
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
                                </button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="dropdownMenu2"
                                >
                                  <li>
                                    <button
                                      className="dropdown-item text-success"
                                      type="button"
                                      onClick={(e) => approveLeave(leave._id)}
                                    >
                                      Approve
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item text-danger"
                                      type="button"
                                      onClick={(e) =>
                                        setShow({
                                          open: true,
                                          leaveId: leave._id,
                                        })
                                      }
                                    >
                                      Reject
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                            {leave.status === "approved" && (
                              <div className="btn-group dropend">
                                <button
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
                                </button>
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="dropdownMenu2"
                                >
                                  <li>
                                    <button
                                      className="dropdown-item text-dark"
                                      type="button"
                                      onClick={(e) => canceLeave(leave._id)}
                                    >
                                      Cancel
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                            {leave.file_name ? (
                              <div className="btn-group dropend" onClick={()=>handleFilPreViewClick(leave)}>
                                <button
                                 className="btn "
                                 type="button"
                                 id="dropdownMenu2"
                                 data-bs-toggle="dropdown"
                                 aria-expanded="false">
                                  <i className=" d-inline-flex  fa fa-eye" aria-hidden="true"></i>
                                  </button>
                              </div>
                            ) : <div></div>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {!loading && updatedList.length <= 0 && (
                  <div className="d-flex justify-content-center">
                    <h5>No Records to Display.</h5>
                  </div>
                )}
                {updatedList.length <= 0 ||
                  (updatedList?.length < total && (
                    <div className="text-center">
                      {/* <button
                      onClick={() => fetchMoreData()}
                      type="button"
                      className="btn btn-primary"
                    > 
                      Load more
                    </button> */}
                      <InfiniteScroll
                        dataLength={updatedList?.length}
                        next={fetchMoreData}
                        hasMore={true}
                        loader={
                          initialValue || searchValue || optionValue ? (
                            ""
                          ) : (
                            <h4>Loadings...</h4>
                          )
                        }
                      >
                        {updatedList?.map((i, index) => (
                          <div key={index}></div>
                        ))}
                      </InfiniteScroll>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {/* {loading && (
          <div className="d-flex justify-content-center">
            <h5>please wait....</h5>
          </div>
        )} */}
      </div>
      {show.open && (
        <RejectLeave
          open={show.open}
          close={handleClose}
          rejectLeave={rejectLeave}
        />
      )}
    </>
  );
}

export default LeaveHistory;
