import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { Link } from "react-router-dom";
import { httpClient } from "../../../constants/Api";
import { ATTENDENCE } from "../../../constants/AppConstants";
import InfiniteScroll from "react-infinite-scroll-component";

function WfhEmployeeList({ renderList }) {
  let [attendenceData, setAttendenceData] = useState([]);
  let [updatedList, setAttendenceUpdateData] = useState([]);
  let [page, setPage] = useState(0);
  let [total, setDataBind] = useState("");
  const [loading, setLoading] = useState(true);
  let [initialValue, setInitialValue] = useState("");
  let [searchValue, setSearchValue] = useState("");
  let [optionValue, setOptionValue] = useState("");
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

  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue);
    updatedList = "";
    attendenceData = "";

    page = 0;

    setPage(page);
    setAttendenceData(attendenceData);
    setAttendenceUpdateData(updatedList);
    getTodayReport(initValue, searchValue, optionValue, page);
  };

  const handleSearchValue = (e) => {
    e.preventDefault();
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(e.target.value)) {
      toast.error("Special Characters Not Allowed")
    } else {
    const searchInitValue = e.target.value;
    setSearchValue(searchInitValue);
    updatedList = [];
    attendenceData = "";
    page = 0;
    setPage(page);
    setAttendenceData(attendenceData);
    setAttendenceUpdateData(updatedList);
    getTodayReport(initialValue, searchInitValue, optionValue, page);
    }
  };

  const fetchMoreData = () => {
    getTodayReport(initialValue, searchValue, optionValue, page);
  };

  const resetSearch = () => {
    setInitialValue("");
    setSearchValue("");
    setOptionValue("");
    updatedList = [];
    page = 0;
    initialValue = "";
    searchValue = "";
    optionValue = "";
    getTodayReport(initialValue, searchValue, optionValue, page);
  };

  useEffect(() => {
    resetSearch();
  }, [renderList]);

  const getTodayReport = async (
    initValue,
    searchInitValue,
    optionInitValue,
    page
  ) => {
    try {
      setLoading(true);
      setPage(page + 1);
      httpClient
        .get(
          `${ATTENDENCE.GET_TODAY_WFH_REPORT}?page=${
            page + 1
          }&alphaTerm=${initValue}&searchText=${searchInitValue}&optionTerm=${optionInitValue}`
        )
        .then((res) => {
          console.log({res});
          if (res.status === 200) {
            if (updatedList.length <= 0) {
              setDataToBind(res.data.wfhUsersCount.data);
              setDataBind(res.data.wfhUsersCount.total);
              setLoading(false);
            } else {
              const updatedData = [
                ...updatedList,
                ...res.data.wfhUsersCount.data,
              ];
              setDataToBind(updatedData);
              setDataBind(res.data.wfhUsersCount.total);
              setLoading(false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
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
  const setDataToBind = (response) => {
    response.map((data) => {
      let breakTime = [];
      data.breaks.map((getTime) => {
        if (getTime.start && getTime.end) {
          const startTime = moment(getTime.start);
          const endTime = moment(getTime.end);
          const mins = endTime.diff(startTime, "s");
          breakTime.push(mins);
        }else if (getTime.start && !data.check_out && 
          moment(data.entry_date).isBefore(moment().format("YYYY-MM-DD"))) {
          const startTime = moment(getTime.start);
          const endTime = moment(getTime.start);
          const mins = endTime.diff(startTime, "s");
          breakTime.push(mins);
        }
      });
      if (data.breaks.length) {
        let breaksStatusValue = data.breaks[data.breaks.length - 1];
        if (breaksStatusValue.start && !breaksStatusValue.end) {
          let status = 1;
          data.breakStatus = status;
        }
      } else {
        let status = 0;
        data.breakStatus = status;
      }
      let totalBreak = breakTime.reduce((a, b) => a + b, 0);
      var hours = totalBreak / 3600;
      var breakHour = Math.floor(hours);
      var minutes = (hours - breakHour) * 60;
      var breakMinutes = Math.round(minutes);
      if (breakHour === 0 && breakMinutes === 0) {
        data.totalTime = "-";
      } else {
        data.totalTime = breakHour + " Hr " + breakMinutes + " Mins";
      }
    });
    setAttendenceData(response);
    setAttendenceUpdateData(response);
  };

  return (
    <>
      <div className="col-lg-12 order-5 order-lg-5 mt-2">
        <div className="dashboard_card employee_lists">
          <div className="card_title calender_heading">
            <h4>Today WFH Report List</h4>
            <div className="d-lg-flex w-90 justify-content-end">
              <form onSubmit={handleSearchValue}>
                <div className="form-group has-search">
                  <span className="fa fa-search form-control-feedback"></span>
                  <input
                    required
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    value={searchValue}
                     onChange={handleSearchValue}
                  />
                </div>
              </form>
              <button
                className="btn btn-primary text-nowrap"
                style={{ marginLeft: "1rem", borderRadius: "50px" }}
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
                <li className={initialValue === data ? "active" : ""} key={i}>
                  <Link to="#" data-target={data} onClick={handleInitialValue}>
                    {data}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="employee_table">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Employee Name</th>
                  <th scope="col" className="textCenter">
                    Employee ID
                  </th>
                  <th scope="col" className="textCenter">
                    Time In
                  </th>
                  <th scope="col" className="textCenter">
                    Break Time
                  </th>
                  <th scope="col" className="textCenter">
                    Time Out
                  </th>
                  <th scope="col" className="textCenter">
                    Total Time
                  </th>
                  <th scope="col" className="textCenter">
                    Work Status
                  </th>
                  <th scope="col" className="textCenter">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {updatedList.length > 0 &&
                  updatedList.map((data, i) => (
                    <tr key={i}>
                      <td scope="row">
                        {data.user_id?.length > 0
                          ? data.user_id[0].name
                          : data.user_id
                          ? data.user_id.name
                          : ""}
                      </td>
                      <td className="textCenter">
                        {data.user_id?.length > 0
                          ? data.user_id[0].emp_id
                          : data.user_id
                          ? data.user_id.emp_id
                          : ""}
                      </td>
                      <td className="textCenter">
                        {data.user_id
                          ? moment(data.check_in).format("hh:mm A")
                          : ""}
                      </td>
                      <td className="textCenter">{data.totalTime}</td>
                      <td className="textCenter">
                        {data.check_out ? (
                          moment(data.check_out).format("hh:mm A")
                        ) : (
                          <div>-</div>
                        )}
                      </td>
                      <td className="textCenter">
                        {data.working_hours ? (
                          data.working_hours ? (
                            <div>{data.working_hours} Hr</div>
                          ) : (
                            <div>-</div>
                          )
                        ) : (
                          <div>-</div>
                        )}{" "}
                      </td>
                      <td className="textCenter">
                        <div className="d-flex align-item-center justify-content-center">
                          <span
                            className={
                              data.check_out
                                ? "request_empty request_rised"
                                : data.breakStatus === 1
                                ? "request_empty break_status"
                                : "request_empty"
                            }
                          >
                            {" "}
                          </span>
                          <span className="ms-2">
                            (
                            {data
                              ? data.work_from === "office"
                                ? "WFO"
                                : "WFH"
                              : "-- : --"}
                            )
                          </span>
                        </div>
                      </td>
                      <td className="textCenter d-flex">
                        <Link
                          to={`/employee/attendence-detail/${
                            data.user_id
                              ? data.user_id.id
                                ? data.user_id.id
                                : data.user_id[0]._id
                                ? data.user_id[0]._id
                                : ""
                              : ""
                          }`}
                        >
                          <button
                            title="Attendence Detail"
                            className="view_emp_detail table_btn mx-1"
                          >
                            <i
                              className="fa fa-hand-paper-o"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </Link>
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
              (updatedList.length < total && (
                <div className="text-center">
                  <InfiniteScroll
                    dataLength={updatedList?.length}
                    next={fetchMoreData}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                  >
                    {updatedList.map((i, index) => (
                      <div key={index}></div>
                    ))}
                  </InfiniteScroll>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default WfhEmployeeList;
