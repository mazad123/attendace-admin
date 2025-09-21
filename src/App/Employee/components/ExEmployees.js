import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { USER } from "../../../constants/AppConstants";
import { Link } from "react-router-dom";
import moment from "moment";
import { Popover, OverlayTrigger } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import DeleteEmployee from "./Modals/DeleteEmployeeModal";
import ExEmployeeModal from './Modals/ExEmployeeModal';


const ExEmployee = () => {
  const [searchValue, setSearchValue] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [attendenceData, setAttendenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataBind, setDataBind] = useState("");
  const [page, setPage] = useState(0);
  const [updatedList, setUpdatedList] = useState([]);
  const [showDelEmp, setshowDelEmp] = useState({ open: false, id: "" });
  const [showEditEmp, setShowEditEmp] = useState({ open: false, id: "", from: "", user_data: "" });

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

  const handleSearchValue = (e) => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(e.target.value)) {
      toast.error("Special Characters Not Allowed")
    }else{
    const searchInitValue = e.target.value;
    setSearchValue(searchInitValue);
    getAllUsers(initialValue, searchInitValue);
      }
  };


  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue);
    getAllUsers(initValue, searchValue);
  };

  const getAllUsers = async (
    initValue = "",
    searchInitValue = "",
    page_no = 0,
    update_list = []
  ) => {
    try {
      setLoading(true);
      setPage(page_no + 1);
      await httpClient
        .get(
          `${USER.GET_EX_EMPLOYEES}?page=${page_no + 1
          }&alphaTerm=${initValue}&searchText=${searchInitValue}`
        )
        .then((res) => {
          if (res.status === 200) {
            if (!update_list) {
              setDataToBind(res.data.user.data);
              setDataBind(res.data.user.total);
              setLoading(false);
            } else {
              const updatedData = [...update_list, ...res.data.user.data];
              setDataToBind(updatedData);
              setDataBind(res.data.user.total);
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
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  
  const setDataToBind = (response) => {
    setAttendenceData(response);
    setUpdatedList(response);
  };

  const resetSearch = () => {
    setInitialValue("");
    setSearchValue("");
    getAllUsers();
  };

  const fetchMoreData = () => {
    getAllUsers(initialValue, searchValue, page, updatedList);
  };

  const handleCloseDeleteEmployee = () => {
    setshowDelEmp({ open: false, id: "" });
    getAllUsers(initialValue, searchValue);
  };

  const handleCloseEditEmployee = () => {
    setShowEditEmp({ open: false, id: "", from: "", user_data: "" });
    getAllUsers(initialValue, searchValue);
  };

  return (
    <div className="main_content_panel">
      <div className="col-lg-12">
        <div className="dashboard_card employee_lists">
          <div className="card_title calender_heading">
            <h4>Ex-Employee List</h4>
            <div className="d-flex">
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
                <li className={initialValue === data ? "active" : " "} key={i}>
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
                    Email
                  </th>
                  <th scope="col" className="textCenter">
                    Phone Number{" "}
                  </th>
                  <th scope="col" className="textCenter">
                    Designation
                  </th>
                  <th scope="col" className="textCenter">
                    Relieving Date
                  </th>
                  <th scope="col" className="textCenter">
                    Exit Formalities
                  </th>
                  <th scope="col" className="textCenter">
                    Elligible To Re-Hire
                  </th>
                  <th scope="col" className="textCenter ">
                    Action
                  </th>

                </tr>
              </thead>
              <tbody>
                {updatedList.map((data, i) => (
                  <tr key={i}>
                    <td>{data.name}</td>
                    <td className="textCenter">{data.emp_id}</td>
                    <td className="textCenter">{data.email}</td>
                    <td className="textCenter">{data.phone}</td>
                    <td className="textCenter">{data.designation}</td>
                    <td className="textCenter">
                      {moment(data.releving_date).format("DD-MM-YYYY")}
                    </td>
                    <td className="textCenter">
                      {data.exit_formality ? (
                        <i
                          className="fa fa-check"
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="textCenter">
                      {data.isElligibleToRehire ? (
                        <i
                          className="fa fa-check"
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        <i className="fa fa-times" style={{ color: "red" }}></i>
                      )}
                    </td>
                    <td className="textCenter">
                      <div className="d-flex">
                        <button
                          onClick={() => setshowDelEmp({ open: true, id: data.id })}
                          title="Delete Employee"
                          className="edit_emp_detail table_btn mx-1"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="fa fa-trash" data-id={data.id} aria-hidden="true"></i>
                        </button>

                        <button
                          onClick={() => setShowEditEmp({ open: true, id: data.id, from: "ex-Employee", user_data: data })}
                          title="Edit Employee"
                          className="edit_emp_detail table_btn mx-1"
                          style={{ cursor: 'pointer' }}
                        >
                          <i
                            className="fa fa-edit"
                            // data-id={data.id}
                            user_data={data}
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      {data.comments ?
                        <OverlayTrigger
                          placement="bottom"
                          trigger="click"
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Comments</Popover.Title>
                              <Popover.Content>{data.comments}</Popover.Content>
                            </Popover>
                          }
                        >
                          <i
                            className="fa fa-commenting"
                            aria-hidden="true"
                            style={{ fontSize: "20px" }}
                          ></i>
                        </OverlayTrigger>
                        : ""}
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
            (updatedList?.length < dataBind && (
              <div className="text-center">
                <InfiniteScroll
                  dataLength={updatedList?.length}
                  next={fetchMoreData}
                  hasMore={true}
                  loader={
                    initialValue || searchValue ? "" : <h4>Loading...</h4>
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

      {showDelEmp.open && (
        <DeleteEmployee
          show={showDelEmp.open}
          onHide={handleCloseDeleteEmployee}
          userId={showDelEmp.id}
        />
      )}

     {showEditEmp.open && (
        <ExEmployeeModal
          show={showEditEmp.open}
          onHide={handleCloseEditEmployee}
          userId={showEditEmp.id}
          from={showEditEmp.from}
          user_data={showEditEmp.user_data}
        />
      )}

    </div>
  );
};
export default ExEmployee;