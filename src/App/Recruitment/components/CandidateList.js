import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { CANDIDATE } from "../../../constants/AppConstants";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DeleteCandidate from "../components/Modals/DeleteCandidateModal"
import { Popover, OverlayTrigger } from "react-bootstrap";
import "../../../assets/css/reports.css";
import "bootstrap/dist/css/bootstrap.css";
import moment from 'moment';
import ReactPaginate from 'react-paginate';

function CandidateList() {
  const [attendenceData, setAttendenceData] = useState([]);
  const [updatedList, setUpdatedList] = useState([]);
  const [show, setShow] = useState({ open: false, id: "" });
  const [initialValue, setInitialValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDelCandidate, setshowDelCandidate] = useState({ open: false, id: "" });
  const [dataBind, setDataBind] = useState("");
  const [dataCategoryCandidateBind, setCategoryCandidateBind] = useState("");
  const userDetail = useSelector((state) => state.user.user.user);
  const [category, setCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [data, setData] = useState(updatedList);
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
    getCategory();
  }, []);

  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue);
    getAllCandidates(initValue, searchValue, selectedCategoryId);
  };

  const handleSearchValue = (e) => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(e.target.value)) {
      toast.error("Special Characters Not Allowed")
    } else {
      const searchInitValue = e.target.value;
      setSearchValue(searchInitValue);
      getAllCandidates(initialValue, searchInitValue, selectedCategoryId);
    }
  };
  const handlecategoryListData = (data, i) => {
    setSelectedCategoryId(data);
    getAllCandidates(initialValue, searchValue, data);
    setCurrentPage(1);
  };
  const resetSearch = (e) => {
    setInitialValue("");
    setSearchValue("");
    getCategory();
    setCurrentPage(1);
  };

  const handleCloseDeleteCandidate = () => {
    setshowDelCandidate({ open: false, id: "" });
    getAllCandidates(initialValue, searchValue, selectedCategoryId);

  };

  const getCategory = async () => {
    try {

      setLoading(true);
      const getCategory = await httpClient
        .get(CANDIDATE.GET_CATEGORY)
        .then((res) => {
          if (res.status === 200) {
            setSelectedCategoryId(res.data.result[0]._id);
            setCategory(res.data.result);
            getAllCandidates("", "", res.data.result[0]._id);
          }
        });

    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching category data");
      setLoading(false);
    }
  };

  const getAllCandidates = async (
    initValue = "",
    searchInitValue = "",
    categoryListData = "",
    page_no = 1,
    update_list = [],
    sortOrder,
    column
  ) => {
    try {
      setLoading(true);
      setPage(page_no);
      await httpClient
        .get(
          `${CANDIDATE.GET_ALL_CANDIDATES}?page=${page_no
          }&alphaTerm=${initValue}&searchText=${searchInitValue}&categoryList=${categoryListData}&sort=${sortOrder}&columnName=${column}`
        )
        .then((res) => {
          if (res.status === 200) {
            if (!update_list) {
              setDataToBind(res.data.result.data);
              setDataBind(res.data.result.totalItems);
              setCategoryCandidateBind(res.data.result.totalCategoryItems);
              setLoading(false);
            } else {
              const updatedData = [...update_list, ...res.data.result.data];
              setDataToBind(updatedData);
              setDataBind(res.data.result.totalItems);
              setCategoryCandidateBind(res.data.result.totalCategoryItems);
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

  // const fetchMoreData = () => {
  //   getAllCandidates(initialValue, searchValue, selectedCategoryId, page, updatedList);
  // };

  const setDataToBind = (response) => {
    setAttendenceData(response);
    setUpdatedList(response);
  };

  const handlePageClick = async (data) => {
    let page = data.selected + 1;
    setCurrentPage(page);
    getAllCandidates(initialValue, searchValue, selectedCategoryId, page, [], sortOrder, sortColumn);
  }


  const sortByColumn = (column) => {
    const newSortOrder = (sortColumn === column && sortOrder === 'desc') ? 'asc' : 'desc';
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedData = [...updatedList].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return new Date(a[column]) - new Date(b[column]);
      } else {
        return new Date(b[column]) - new Date(a[column]);
      }
    });

    setData(sortedData);
    getAllCandidates("", "", selectedCategoryId, currentPage, [], newSortOrder, column);
  };

  function decodeHtml(html) {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(html, "text/html").documentElement.textContent;
    return decodedString;
  }

  return (
    <div className="main_content_panel container">
      <div className="col-lg-12">
        <div className="header_title category-tabs-wrap d-flex">
          <h1><span>Candidate</span> List</h1>
        </div>
        <div className="repots_tab category-repots-tab">
          <div className="row">
            <div className="col-md-12 col-lg-12" >
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                {selectedCategoryId && category.map((data, i) => (
                  <li className="nav-item" role="presentation" key={i}>
                    <button
                      className={selectedCategoryId === data._id ? "tab_btn nav-link active" : "tab_btn nav-link"}
                      id={"pills-home-tab"}
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="false"
                      onClick={(e) => handlecategoryListData(data._id)}
                    >
                      {data.category}
                    </button>
                  </li>))}
              </ul>
            </div>
          </div>
        </div>
        <div className="filter_letters pt-3 rounded mt-2">
          <div className="card_title calender_heading justify-content-end">
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
                onClick={(e) => resetSearch(e)}
              >
                Reset Filter
              </button>
            </div>
          </div>
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
        <div className="employee_table table-responsive">
          <table className="table table-hover employee-list-table candidateTable-hover">
            <thead className="candidateTable">
              <tr>
                <th scope="col" className=" text-center text-nowrap">
                  S.No.
                </th>
                <th scope="col" className=" text-center text-nowrap">
                  Candidate <br /> Name
                </th>
                <th scope="col" className="textCenter text-nowrap">
                  Phone <br /> Number{" "}
                </th>
                <th scope="col" className="textCenter">
                  Email
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Current <br /> Company
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Experience
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Current <br /> CTC
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Expected <br /> CTC
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Notice <br /> Period
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Current <br /> Location
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Source
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Qualification
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Recruiter <br /> Name
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Aptitude <br /> Round
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Technical <br /> Round
                </th>
                <th scope="col" className="text-center text-nowrap">
                  Manager <br /> Round
                </th>
                <th scope="col" className="text-nowrap">
                  Final <br /> Round
                </th>
                <th scope="col" className="textCenter text-nowrap">
                  Additional <br /> Comment{" "}
                </th>
                <th
                  scope="col"
                  className="textCenter text-nowrap"
                  onClick={() => sortByColumn('createdAt')}
                >
                  Created <br /> At
                  {sortColumn === 'createdAt' && (
                    <span className="sort-arrows">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th
                  scope="col"
                  className="textCenter text-nowrap"
                  onClick={() => sortByColumn('updatedAt')}
                >
                  Updated <br /> At
                  {sortColumn === 'updatedAt' && (
                    <span className="sort-arrows">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th scope="col" className="textCenter">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedList &&
                updatedList.map((data, i) => (
                  <tr key={i}>
                    <td> {" "}
                      <span className="number">{i + 1}</span></td>
                    <td className="textCenter text-nowrap">{data.candidate_name}</td>
                    <td className="textCenter text-nowrap">{data.phone}</td>
                    <td className="textCenter text-nowrap">{data.email}</td>
                    <td className="textCenter text-nowrap">{data.current_company}</td>
                    <td className="textCenter text-nowrap">{data.experience}</td>
                    <td className="textCenter text-nowrap">{data.current_ctc}</td>
                    <td className="textCenter text-nowrap">{data.expected_ctc}</td>
                    <td className="textCenter text-nowrap">{data.notice_period} days</td>
                    <td className="textCenter text-nowrap">{data.current_location}</td>
                    <td className="textCenter text-nowrap">{data.source_of_hiring}</td>
                    <td className="textCenter text-nowrap">{data.qualification}</td>
                    <td className="textCenter text-nowrap">{data.recruiter_name ? data.recruiter_name : "-"}</td>
                    <td className="textCenter text-nowrap">
                      {data?.aptitude_round?.result_status === "Pass" ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Aptitude Round Comment</Popover.Title>
                              <Popover.Content>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtml(data?.aptitude_round_comment || '') }} />
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <i className="fa fa-check" aria-hidden="true" style={{ fontSize: "20px", color: "green" }}></i>
                        </OverlayTrigger>
                      ) : data?.aptitude_round?.result_status === "Fail" ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Aptitude Round Comment</Popover.Title>
                              <Popover.Content>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtml(data?.aptitude_round_comment || '') }} />
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <i className="fa fa-close" aria-hidden="true" style={{ fontSize: "20px", color: "red" }}></i>
                        </OverlayTrigger>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="textCenter text-nowrap">
                      {data?.technical_round?.result_status === "Pass" ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Technical Round Comment</Popover.Title>
                              <Popover.Content>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtml(data?.technical_round_comment || '') }} />
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <i className="fa fa-check" aria-hidden="true" style={{ fontSize: "20px", color: "green" }}></i>
                        </OverlayTrigger>
                      ) : data?.technical_round?.result_status === "Fail" ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Technical Round Comment</Popover.Title>
                              <Popover.Content>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtml(data?.technical_round_comment || '') }} />
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <i className="fa fa-close" aria-hidden="true" style={{ fontSize: "20px", color: "red" }}></i>
                        </OverlayTrigger>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="textCenter text-nowrap">{data.manager_round?.result_status === "Pass" ?
                      (<OverlayTrigger
                        placement="top"
                        // trigger="click"
                        trigger={['hover', 'focus']}
                        rootClose
                        overlay={
                          <Popover>
                            <Popover.Title as="h6">Manager Round Comment</Popover.Title>
                            {/* <Popover.Content>{data.manager_round_comment}</Popover.Content> */}
                            <Popover.Content><div dangerouslySetInnerHTML={{ __html: decodeHtml(data.manager_round_comment) }} /></Popover.Content>
                          </Popover>
                        }
                      >
                        <i
                          className="fa fa-check"
                          aria-hidden="true"
                          style={{ fontSize: "20px", color: "green" }}
                        ></i>
                      </OverlayTrigger>) : data.manager_round?.result_status === "Fail" ? (
                        <OverlayTrigger
                          placement="top"
                          // trigger="click"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Manager Round Comment</Popover.Title>
                              {/* <Popover.Content>{data.manager_round_comment}</Popover.Content> */}
                              <Popover.Content><div dangerouslySetInnerHTML={{ __html: decodeHtml(data.manager_round_comment) }} /></Popover.Content>
                            </Popover>
                          }
                        >
                          <i
                            className="fa fa-close"
                            aria-hidden="true"
                            style={{ fontSize: "20px", color: "red" }}
                          ></i>
                        </OverlayTrigger>)
                        : (
                          "-"
                        )}  </td>
                    <td className="textCenter text-nowrap">
                      {data?.final_round?.result_status === "Pass" ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Final Round Comment</Popover.Title>
                              <Popover.Content>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtml(data?.final_round_comment || '') }} />
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <i
                            className="fa fa-check"
                            aria-hidden="true"
                            style={{ fontSize: "20px", color: "green" }}
                          ></i>
                        </OverlayTrigger>
                      ) : data?.final_round?.result_status === "Fail" ? (
                        <OverlayTrigger
                          placement="top"
                          trigger={['hover', 'focus']}
                          rootClose
                          overlay={
                            <Popover>
                              <Popover.Title as="h6">Final Round Comment</Popover.Title>
                              <Popover.Content>
                                <div dangerouslySetInnerHTML={{ __html: decodeHtml(data?.final_round_comment || '') }} />
                              </Popover.Content>
                            </Popover>
                          }
                        >
                          <i
                            className="fa fa-close"
                            aria-hidden="true"
                            style={{ fontSize: "20px", color: "red" }}
                          ></i>
                        </OverlayTrigger>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="textCenter text-nowrap">{data.additional_comment ?
                      <OverlayTrigger
                        placement="top"
                        // trigger="click"
                        trigger={['hover', 'focus']}
                        rootClose
                        overlay={
                          <Popover>
                            <Popover.Title as="h6"> Additional Comment</Popover.Title>
                            {/* <Popover.Content>{data.additional_comment}</Popover.Content> */}
                            <Popover.Content><div dangerouslySetInnerHTML={{ __html: decodeHtml(data.additional_comment) }} /></Popover.Content>
                          </Popover>
                        }
                      >
                        <i
                          className="fa fa-commenting"
                          aria-hidden="true"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </OverlayTrigger>
                      : "-"}</td>
                    <td className="textCenter text-nowrap">{moment(data.createdAt).format('L')}</td>
                    <td className="textCenter text-nowrap">{moment(data.updatedAt).format('L')}</td>
                    <td className="textCenter">
                      <div className="d-flex">
                        {(userDetail.role.role == "Super Admin" ||
                          userDetail.role.role == "HR") && (
                            <>
                              <Link
                                to={{ pathname: `/candidate/edit/${data._id}` }}
                              >
                                <button
                                  title="Edit Candidate"
                                  className="edit_emp_detail table_btn mx-1"

                                  style={{ cursor: "pointer" }}
                                >
                                  <i
                                    className="fa fa-pencil-square-o"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </Link>
                              <button
                                onClick={() =>
                                  setshowDelCandidate({ open: true, id: data._id })
                                }
                                title="Delete Candidate"
                                className="edit_emp_detail table_btn mx-1"
                                style={{ cursor: "pointer" }}
                              >
                                <i
                                  className="fa fa-trash"
                                  data-id={data.id}
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button className={data.candidate_cv_URL ? "edit_emp_detail table_btn mx-1" : "edit_emp_detail table_btn_disable mx-1"}>
                                <a href={data.candidate_cv_URL} target="_blank"
                                  style={{ textdecorations: "none", color: "inherit", cursor: "pointer" }}
                                  title="View/Download CV"
                                >
                                  <i
                                    className="fa fa-download"
                                    data-id={data.id}
                                    aria-hidden="true"
                                  ></i>
                                </a>
                              </button>
                            </>
                          )}
                      </div>
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
          {/* {updatedList.length <= 0 ||
            (updatedList?.length < dataBind && (
              <div className="text-center">
                <InfiniteScroll
                  dataLength={updatedList?.length}
                  next={fetchMoreData}
                  hasMore={true}
                // loader={
                //   !loading ? "" : <h4>Loading...</h4>
                // }
                >
                  {updatedList?.map((i, index) => (
                    <div key={index}></div>
                  ))}
                </InfiniteScroll>
              </div>
            ))} */}
        </div>
      </div>
      {showDelCandidate.open && (
        <DeleteCandidate
          show={showDelCandidate.open}
          onHide={handleCloseDeleteCandidate}
          candidateId={showDelCandidate.id}
        />
      )}

      {dataCategoryCandidateBind > 10 ? <ReactPaginate
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        marginPagesDisplayed={6}
        forcePage={currentPage - 1}
        pageCount={Math.ceil(dataCategoryCandidateBind / 10)}
        previousLabelClassName={'page-link'}
        renderOnZeroPageCount={null}
        containerClassName={'pagination justify-content-center'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousLinkClassName={'page-link'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
      /> : ""}
    </div>
  );
}

export default CandidateList;
