import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { Link } from "react-router-dom";
import { httpClient } from "../../../constants/Api";
import { LEAVES } from "../../../constants/AppConstants";

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

function OnLeaveEmployee({ renderList }) {
  const [searchAlphaTerm, setSearchAlphaTerm] = useState("");
  const [attendenceData, setAttendenceData] = useState("");
  const [updatedList, setAttendenceUpdateData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      httpClient
        .get(`${LEAVES.GET_LEAVE_COUNT}`)
        .then((res) => {
          if (res.status === 200) {
            setAttendenceData(res.data.usersLeaveCount);
            setAttendenceUpdateData(res.data.usersLeaveCount);
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
  }, [renderList]);

  const handleSearch = (event) => {
    // setSearchTerm(event.target.text);
    const alphabet = event.target.text;
    if (event.target.text) {
      let updatedListArray = [];
      updatedListArray = handleSearchBar(attendenceData, event.target.text);
      updatedListArray = handleAlphabet(updatedListArray, alphabet);
      setAttendenceUpdateData(updatedListArray);
    } else {
      const updatedListArray = handleAlphabet(attendenceData, alphabet);
      setAttendenceUpdateData(updatedListArray);
    }
  };

  const handleAlphabet = (attendenceData, searchAlphaTerm) => {
    return attendenceData.filter((records) => {
      return (
        records.user_id.name
          .charAt(0)
          .toLowerCase()
          .search(searchAlphaTerm.toLowerCase()) !== -1
      );
    });
  };

  const handleSearchBar = (updatedListArray, term) => {
    return updatedListArray.filter((records) => {
      return (
        records.user_id.name.toLowerCase().search(term.toLowerCase()) !== -1
      );
    });
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    const term = event.target.value;
    if (searchAlphaTerm) {
      let updatedListArray = [];
      updatedListArray = handleAlphabet(attendenceData, searchAlphaTerm);
      updatedListArray = handleSearchBar(updatedListArray, term);
      setAttendenceUpdateData(updatedListArray);
    } else {
      const updatedListArray = handleSearchBar(attendenceData, term);
      setAttendenceUpdateData(updatedListArray);
    }
  };

  const resetSearch = () => {
    setAttendenceUpdateData(attendenceData);
    setSearchAlphaTerm("");
    setSearchTerm("");
  };

  const formatTime = (time) => {
    return moment(time, "h:m").format("hh:mm A");
  };

  return (
    <div className="col-lg-12 order-5 order-lg-5 mt-2">
      <div className="dashboard_card employee_lists">
        <div className="card_title calender_heading">
          <h4>Today Leave Report</h4>
          <div className="d-flex">
            <div className="form-group has-search">
              <span className="fa fa-search form-control-feedback"></span>
              <input
              required
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
            <button
              className="btn btn-primary"
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
              <li key={i} className={searchAlphaTerm === data ? "active" : ""}>
                <Link to="#" onClick={handleSearch}>
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
                <th scope="col">Name</th>
                <th scope="col" className="textCenter">
                  Employee ID
                </th>
                <th scope="col" className="textCenter">
                  Time
                </th>
                <th scope="col" className="textCenter">
                  Type
                </th>
                <th scope="col" className="textCenter">
                  Reason of Leave
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedList.length > 0 &&
                updatedList.map((data, i) => (
                  <tr key={i}>
                    <td>{data?.user_id.name}</td>
                    <td className="textCenter">{data?.user_id.emp_id}</td>
                    <td className="textCenter">
                      {data.start_time
                        ? formatTime(data.start_time)
                        : "-- : --"}{" "}
                      - {data.end_time ? formatTime(data.end_time) : "-- : --"}
                    </td>
                    <td className="textCenter">{data.type}</td>
                    <td className="textCenter">{data.leave_reason}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {updatedList.length <= 0 && (
            <div className="d-flex justify-content-center">
              <h5>No Records to Display.</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnLeaveEmployee;
