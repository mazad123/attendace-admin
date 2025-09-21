import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { USER } from "../../../constants/AppConstants";

function UnCheckedEmployeeList({ renderList }) {
  const [searchAlphaTerm, setSearchAlphaTerm] = useState("");
  const [attendenceData, setAttendenceData] = useState("");
  const [updatedList, setAttendenceUpdateData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    try {
      httpClient
        .get(`${USER.GET_USER}`)
        .then((res) => {
          if (res.status === 200) {
            setAttendenceData(res.data.user);
            setAttendenceUpdateData(res.data.user);
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

  const handleAlphabet = (attendenceData, searchAlphaTerm) => {
    return attendenceData.filter((records) => {
      return (
        records.name
          .charAt(0)
          .toLowerCase()
          .search(searchAlphaTerm.toLowerCase()) !== -1
      );
    });
  };

  const handleSearchBar = (updatedListArray, term) => {
    return updatedListArray.filter((records) => {
      return records.name.toLowerCase().search(term.toLowerCase()) !== -1;
    });
  };

  const handleSearch = (event) => {
    setSearchAlphaTerm(event.target.text);
    const alphabet = event.target.text;
    if (searchTerm) {
      let updatedListArray = [];
      updatedListArray = handleSearchBar(attendenceData, searchTerm);
      updatedListArray = handleAlphabet(updatedListArray, alphabet);
      setAttendenceUpdateData(updatedListArray);
    } else {
      const updatedListArray = handleAlphabet(attendenceData, alphabet);
      setAttendenceUpdateData(updatedListArray);
    }
  };
  const resetSearch = () => {
    setAttendenceUpdateData(attendenceData);
    setSearchAlphaTerm("");
    setSearchTerm("");
  };

  return (
    <div className="col-lg-12 order-5 order-lg-5 mt-2">
      <div className="dashboard_card employee_lists">
        <div className="card_title calender_heading">
          <h4>Un-Checked Employee List</h4>
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
              <li className={searchAlphaTerm === data ? "active" : ""} key={i}>
                <Link to="#" data-target={data} onClick={handleSearch}>
                  {data}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="employee_table table-responsive">
          <table className="table table-hover employee-list-table">
            <thead>
              <tr>
                <th scope="col" className="text-nowrap">
                  Employee Name
                </th>
                <th scope="col" className="textCenter text-nowrap">
                  Employee ID
                </th>
                <th scope="col" className="textCenter">
                  Email
                </th>
                <th scope="col" className="textCenter text-nowrap">
                  Phone Number{" "}
                </th>
                <th scope="col" className="textCenter">
                  Designation
                </th>
                <th scope="col" className="textCenter">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedList.map((data, i) => (
                <tr key={i}>
                  <td className="textCenter text-nowrap">{data.name}</td>
                  <td className="textCenter text-nowrap">{data.emp_id}</td>
                  <td className="textCenter text-nowrap">{data.email}</td>
                  <td className="textCenter text-nowrap">{data.phone}</td>
                  <td className="textCenter text-nowrap">{data.designation}</td>
                  <td className="textCenter text-nowrap">
                    {data.role ? (data.role.role ? data.role.role : "-") : "-"}
                  </td>
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

export default UnCheckedEmployeeList;
