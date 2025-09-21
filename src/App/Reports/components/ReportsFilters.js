import React from "react";
import { Link } from "react-router-dom";

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

function ReportsFilters(props) {
  return (
    <>
      <div className="card_title calender_heading justify-content-end">
        <div className="d-flex">
          <div className="form-group has-search">
            <span className="fa fa-search form-control-feedback"></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={props.searchValue}
              onChange={props.handleSearch}
            />
           
          </div>
          <button
            className="btn btn-primary"
            style={{ marginLeft: "1rem", borderRadius: "50px" }}
            onClick={props.resetFilters}
          >
            Reset Filter
          </button>
        </div>
      </div>
      <ul>
        {alpha.map((data, i) => (
          <li key={i} className={props.initalValue === data ? "active" : ""}>
            <Link
              to="#"
              data-target={data}
              onClick ={(e) => props.handleInitialValue(e.target.text)}
            >
              {data}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ReportsFilters;
