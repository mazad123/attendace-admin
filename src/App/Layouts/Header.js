import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getRequests } from "../../redux/actions/ChangeRequestActions";
import CompanyLogo from "../../assets/images/logo.png";
import ProfileImage from "../../assets/images/profile.png";
import { userSignOut } from "../../redux/actions/AuthActions";
import { httpClient } from '../../constants/Api';
import { FORMS } from '../../constants/AppConstants';
import { toast } from 'react-toastify';
import GenerateOtpModal from "../common/GenerateOtpModal";

function Header() {
  const [loading, setLoading] = useState(false);
  const [formTemplate, setFormTemplate] = useState();
  const [showGenerateOtpModal, setShowGenerateOtpModal] = useState({ show: false, mode: "" });
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user.user.user);
  const requests = useSelector((state) => state.changeRequests.requests);
  const signOut = () => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    if (tokens) {
      dispatch(userSignOut({ refreshToken: tokens.refresh.token }));
      window.location.href = "/login";
    }
    localStorage.clear();
  };

  const openNav = () => {
    document.getElementById("mobile-nav").style.width = "230px";
  };

  const closeNav = () => {
    document.getElementById("mobile-nav").style.width = "0%";
  };

  useEffect(() => {
    dispatch(getRequests());
    getForms()
  }, []);

  const getForms = async () => {
    try {
      setLoading(true);
      const forms = await httpClient.get(FORMS.GET_ALL_FORMS);
      if (forms) {
        setFormTemplate(forms.data.response.allForms);
      }
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGenerateOtpModal = () => {
    setShowGenerateOtpModal({ show: false, mode: "" });
  }

  return (
    <>
      <header className="main-header">
        <div className="container">
          <div className="app-header">
            <div id="mobile-nav" className="nav-overlay">
              <NavLink to="#" className="closebtn" onClick={() => closeNav()}>
                &times;
              </NavLink>
              <div className="nav-overlay-content">
                <ul className="app-menu">
                  <li>
                    <Link
                      className="app-menu__item active"
                      to="/dashboard/home"
                    >
                      <i className="app-menu__icon fa fa-dashboard"></i>
                      <span className="app-menu__label">Dashboard</span>
                    </Link>
                  </li>
                  <li className="treeview">
                    <Link
                      className="app-menu__item"
                      to="#"
                      data-toggle="treeview"
                    >
                      <i className="app-menu__icon fa fa-laptop"></i>
                      <span className="app-menu__label">Page</span>
                      <i className="treeview-indicator fa fa-angle-right"></i>
                    </Link>
                    <ul className="treeview-menu">
                      <li>
                        <NavLink className="treeview-item" to="#">
                          <i className="icon fa fa-circle-o"></i> Page1
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mobile-icon">
              {" "}
              <span onClick={() => openNav()}>&#9776;</span>{" "}
            </div>
            <Link to="/dashboard/home">
              <div className="app-logo">
                <img src={CompanyLogo} alt="" />
              </div>
            </Link>
            <ul className="m-0 p-0 ms-4">
              <li className="app-search">
                <input
                  className="app-search__input"
                  type="search"
                  placeholder="Search"
                />
                <button className="app-search__button">
                  <i className="fa fa-search"></i>
                </button>
              </li>
            </ul>

            <ul className="app-nav app-desktop">
              {/* {(userDetail.role.role === "Super Admin" ||
            userDetail.role.role === "Sales")  && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/docs/main-page">
                   Docs
                  </NavLink>
                </li>
              )} */}
              {(userDetail.role.role === "Super Admin" ||
                userDetail.role.role === "Sales") && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/project/project-list">
                      BaseCamp
                    </NavLink>
                  </li>
                )}
              {(userDetail.role.role === "Super Admin" ||
                userDetail.role.role === "HR") && (
                  <li className="nav-item submenu">
                    <NavLink className="nav-link" to="#">
                      {" "}
                      Recruitment <i className="fa fa-angle-down ms-1"></i>
                    </NavLink>
                    <ul className="dropdown-menu" style={{ right: 0 }}>
                      <Link className="dropdown-item" to="/candidate/add">
                        Add New Candidate
                      </Link>
                      <Link className="dropdown-item" to="/candidate/list">
                        Candidate's List
                      </Link>
                      {/* <Link className="dropdown-item" to="/candidate/add-category">
              Add Category
            </Link>*/}
                    </ul>
                  </li>)}
              {(userDetail.role.role === "Super Admin" ||
                userDetail.role.role === "HR") && (
                  <li className="nav-item submenu">
                    <NavLink className="nav-link" to="#">
                      {" "}
                      Reports <i className="fa fa-angle-down ms-1"></i>
                    </NavLink>
                    <ul className="dropdown-menu" style={{ right: 0 }}>
                      <Link className="dropdown-item" to="/reports">
                        Attendance Report
                      </Link>
                      <Link className="dropdown-item" to="/reports/work">
                        Work Status Report
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="/reports/employee-leaves-report"
                      >
                        Employee Leaves Report
                      </Link>
                    </ul>
                  </li>)}
              {(userDetail.role.role === "Super Admin" ||
                userDetail.role.role === "HR") && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/employee/add">
                      Add Employee
                    </NavLink>
                  </li>
                )}
              {(userDetail.role.role === "Super Admin" ||
                userDetail.role.role === "HR") && (
                  <li className="nav-item submenu">
                    <NavLink className="nav-link" to="/dashboard/home">
                      {" "}
                      Dashboard <i className="fa fa-angle-down ms-1"></i>
                    </NavLink>
                    <ul className="dropdown-menu" style={{ right: 0 }}>
                      <li>
                        <Link className="dropdown-item" to="/employee/list">
                          Total Employees
                        </Link>
                      </li>
                      {(userDetail.role.role === "Super Admin" ||
                        userDetail.role.role === "HR") && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/employee/ex-employees"
                            >
                              Ex-Employees
                            </Link>
                          </li>
                        )}
                      {(userDetail.role.role === "Super Admin" ||
                        userDetail.role.role === "HR") && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/employee/leave-history"
                            >
                              Leave History
                            </Link>
                          </li>
                        )}
                      {(userDetail.role.role === "Super Admin" ||
                        userDetail.role.role === "HR") && (
                          <li>
                            <Link className="dropdown-item" to="/dashboard/thought">
                              Thought
                            </Link>
                          </li>
                        )}
                      {(userDetail.role.role === "Super Admin")
                        && (<li>
                          <Link
                            className="dropdown-item"
                            to="/docs/main-page"
                          >
                            Document Vault
                          </Link>
                        </li>)}
                      {(userDetail.role.role === 'Super Admin' || userDetail.role.role === 'HR') && (
                        <li>
                          <div className="form-dropdown">
                            <Link className="dropdown-item" to="#">
                              Forms <i className="fa-solid  fa fa-chevron-right" style={{ float: 'right', marginTop: '4px' }}></i>
                            </Link>
                            <div className="dropdown-content dropdown-submenu">
                              {formTemplate && formTemplate.map((form, index) => (
                                <Link className="linkForm" key={index} to={{ pathname: `/forms/generate-form/${form._id}` }}>
                                  {form.formName}
                                </Link>))}
                              <Link className="dropdown-item" to="/forms/generated-forms">
                                Generated Forms
                              </Link>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </li>
                )}
              {(userDetail.role.role === "Super Admin" || userDetail.role.role === "HR") && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="#">
                    Messages
                  </NavLink>
                </li>)}
              {(userDetail.role.role === "Super Admin" ||
                userDetail.role.role === "HR") && (
                  <li className="dropdown notifications user-notify-data">
                    <NavLink
                      className="app-nav__item"
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-label="Show notifications"
                      aria-expanded="false"
                    >
                      <i className="fa fa-bell-o fa-lg"></i>
                      {requests.length > 0 ? (
                        <span className="position-absolute translate-middle badge rounded-pill bg-danger">
                          {requests.length}
                        </span>
                      ) : (
                        ""
                      )}
                    </NavLink>

                    <ul
                      className="app-notification dropdown-menu dropdown-menu-end dropdown-menu-right"
                      x-placement="bottom-end"
                      style={{ width: "245px", padding: "0" }}
                    >
                      <li className="app-notification__title">
                        You have {requests.length} new notifications.
                      </li>
                      <div className="app-notification__content">
                        {requests?.map((data, i) => (
                          <li key={i}>
                            <NavLink className="app-notification__item" to="#">
                              <span className="app-notification__icon">
                                <span className="fa-stack fa-lg">
                                  <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                  <i className="fa fa-envelope fa-stack-1x fa-inverse"></i>
                                </span>
                              </span>
                              <div>
                                <NavLink to="/dashboard/notification">
                                  <p className="app-notification__message">
                                    {data.type === 'Status Added' ? (
                                      `${data.request_message.split(' for ')[0]} for ${data.user_id.name}`
                                    ) : (
                                      `${data.user_id.name} sent you a request`
                                    )}
                                  </p>
                                  <p className="app-notification__meta">
                                    {moment(data.createdAt).fromNow()}
                                  </p>
                                </NavLink>

                              </div>
                            </NavLink>
                          </li>
                        ))}
                      </div>
                      <li className="app-notification__footer">
                        <NavLink to="/dashboard/notification">
                          See all notifications.
                        </NavLink>
                      </li>
                    </ul>
                  </li>)}

              <li className="dropdown">
                <NavLink
                  className="app-nav__item"
                  to="#"
                  data-bs-toggle="dropdown"
                  aria-label="Open Profile Menu"
                  aria-expanded="false"
                >
                  <img
                    className="user-img"
                    src={
                      userDetail
                        ? userDetail.image_url
                          ? userDetail.image_url
                          : ProfileImage
                        : ProfileImage
                    }
                    alt=""
                  />
                </NavLink>
                <ul
                  className="dropdown-menu dropdown-menu-end settings-menu dropdown-menu-right"
                  x-placement="bottom-end"
                >
                  {(userDetail.role.role === "Super Admin"
                    && <li>
                      <Link className="dropdown-item" to="/organisation/view">
                        <i className="fa fa-cog fa-lg"></i> Settings
                      </Link>
                    </li>)}
                  {(userDetail.role.role === "Super Admin"
                    && <li>
                      <Link className="dropdown-item" to="/organisation/add-employee-level">
                        <i className="fa fa-level-up fa-lg"></i> User's Level
                      </Link>
                    </li>)}
                  {/* <li>
                    <Link className="dropdown-item" to="#">
                      <i className="fa fa-user fa-lg"></i> Profile
                    </Link>
                  </li> */}
                  <li>
                    <Link className="dropdown-item" onClick={() => setShowGenerateOtpModal({ show: true, mode: "change" })} to="#">
                      <i className="fa fa-lock fa-lg"></i> Change Password
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => signOut()}
                    >
                      <i className="fa fa-sign-out fa-lg"></i> Logout
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <GenerateOtpModal
        show={showGenerateOtpModal.show}
        onHide={handleCloseGenerateOtpModal}
        mode={showGenerateOtpModal.mode}
      />
    </>
  );
}

export default Header;
