import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../constants/Api";
import { PROJECT } from "../../constants/AppConstants";
import BlankImage from "../../assets/images/dummy_profile.jpeg";
import moment from "moment";
import DailyStatusModal from "./Modals/DailyStatus.Modal";
import ViewDailyStatusModal from "./Modals/ViewDailyStatus.Modal";
import DateRangePicker from "react-bootstrap-daterangepicker";
import ReactPaginate from 'react-paginate';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function UserStatuses() {
    const { userId } = useParams();
    const [showDailyStatus, setShowDailyStatus] = useState(false);
    const [viewDailyStatus, setViewDailyStatus] = useState({ open: false, subject: "", message: "" });
    const [selectedOption, setSelectedOption] = useState("currentMonth");
    const [data, setData] = useState([]);
    const [pages, setPages] = useState("");
    const [items, setItems] = useState([]);
    const [count, setCount] = useState("");
    const [dates, setDates] = useState({
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
    });
    useEffect(() => {
        getUserStatuses();
        setViewDailyStatus(false);
    }, [dates]);
    const handleClose = () => {
        setShowDailyStatus(false);
        setViewDailyStatus(false);
        getUserStatuses();
    }

    const getUserStatuses = async (
        pages = 1,
    ) => {
        try {
            const res = await httpClient
                .get(`${PROJECT.GET_DEFAULT_PROJECT_STATUSES_BY_ID}?userId=${userId}&from=${dates.from}&to=${dates.to}&page=${pages}`);
            if (res.status === 200) {
                setData(res.data.result.statuses);
                setCount(res.data.result.total);
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
  
    const handleDateRange = async (event, picker) => {
        setSelectedOption("dateRange");
        setDates({
            from: moment(picker.startDate).format("YYYY-MM-DD"),
            to: moment(picker.endDate).format("YYYY-MM-DD"),
            active: "picker"
        });
    };
    const handlePageClick = async (data) => {
        let Page = data.selected + 1;
        await getUserStatuses(Page);
        setPages(Page);
    }
    const myRef = useRef();
    const ref = myRef.current;
    const changeWeeklyStartDate = () => {
        ref?.setStartDate(moment().startOf("week").add(1, "day"));
        ref?.setEndDate(moment().endOf("week").add(1, "day"));
    };

    return (
        <>
            <div className="main_content_panel">
                <div className="header_title d-block d-lg-flex">
                    <h1>
                        <span>Project Updates</span>
                    </h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-10 mb-4">
                        <div className="dashboard_card">
                            <div className="projects-update-wrapper">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="header-title-wrap">
                                            <h4 className="head-title-info">KIS</h4>
                                            <p className="description-info">
                                                DESCRIPTION
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="repots_tab project_updates_info">
                                    <div className="row">
                                        <ul className="nav nav-pills mb-3 d flex justify-content-end align-items-center;" id="pills-tab" role="tablist">
                                            <li>
                                                <DateRangePicker
                                                    ref={myRef}
                                                    onApply={handleDateRange}
                                                    initialSettings={{
                                                        startDate: moment(),
                                                        endDate: moment(),
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        className={dates.active === "picker" ? "btn btn-secondary calender_view me-4 active_btn " : "btn btn-secondary calender_view me-4"}
                                                        data-bs-toggle="pill"
                                                        data-bs-target="#pills-contact"
                                                        role="tab"
                                                        aria-controls="pills-contact"
                                                        aria-selected="true"
                                                    />
                                                </DateRangePicker>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className={dates.active === "weekly" ? "tab_btn nav-link active" : "tab_btn nav-link"}
                                                    id="pills-profile-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-profile"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-profile"
                                                    aria-selected="false"
                                                    onClick={() => {
                                                        setDates({
                                                            from: moment().startOf("week").add(1, "day"),
                                                            to: moment().endOf("week").add(1, "day"),
                                                            active: "weekly",
                                                        });
                                                        changeWeeklyStartDate();
                                                    }}
                                                >
                                                    Weekly
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
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
                                                <Link to={{ pathname: `/project/project-messages/${data.subject_id._id}`}} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}><div className="follow-up-info text-primary text-decoration-underline">{data.subject_id?.subject}</div></Link>
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
                                                    <div className="post-new-message-wrap">
                                                        <button type="button" className="btn btn-default border rounded-3" onClick={() =>
                                                            setShowDailyStatus(true)
                                                        }>Post a new message</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {data?.map((data, i) => (
                                    <div className="discussions-list-wrap" key={i}>
                                    <Link to={{ pathname: `/project/project-messages/${data.subject_id._id}`}} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                                        <div className="discussions-list-content-info pb-2"
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
                                                <div className="follow-up-info me-2 text-primary text-decoration-underline">{data.subject_id?.subject}</div>
                                                <div className="pu-message-wrap">{parser(data.message)}</div>
                                            </div>
                                            <div className="date-wrap">
                                                <h6 className="date-info m-0 d-flex justify-content-evenly">
                                                    <span>{moment(data.createdAt).format('ll')}</span>
                                                    <span className="total-count-info"><div className="btn-group dropend">
                                                    </div></span>
                                                </h6>
                                            </div>
                                        </div>
                                        </Link>
                                    </div>

                                ))}
                                {data.length <= 0 && (
                                    <div className="d-flex justify-content-center">
                                        <h5>No Records to Display.</h5>
                                    </div>
                                )}
                                {count>10?<ReactPaginate
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}
                                    marginPagesDisplayed={3}
                                    pageCount={Math.ceil(count / 10)}
                                    previousLabelClassName={'page-link'}
                                    renderOnZeroPageCount={null}
                                    containerClassName={'pagination justify-content-center'}
                                    pageClassName={'page-item'}
                                    pageLinkClassName={'page-link'}
                                    previousLinkClassName={'page-link'}
                                    nextLinkClassName={'page-link'}
                                />:""}
                            </div>
                        </div>
                    </div>
                </div>
                {showDailyStatus && (
                    <DailyStatusModal
                        show={showDailyStatus}
                        onHide={handleClose}
                    />
                )}
                {viewDailyStatus && (
                    <ViewDailyStatusModal
                        show={viewDailyStatus}
                        onHide={handleClose}
                    />
                )}
            </div>
        </>
    );
}


export default UserStatuses;
