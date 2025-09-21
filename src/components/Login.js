import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import loginImage from "../assets/images/logo_full.png";
import { userSignIn } from "../redux/actions/AuthActions";
import { httpClient } from "../constants/Api";
import { ROLES } from "../constants/AppConstants";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import "./login.css";
import GenerateOtpModal from "../App/common/GenerateOtpModal";

function Login() {
  const dispatch = useDispatch();
  const route = useSelector((state) => state.route.route);
  const [values, setValues] = useState({
    username: "",
    password: "",
    role: "",
    type: ""
  });
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [state, setState] = useState(false);
  const [showGenerateOtpModal, setShowGenerateOtpModal] = useState({ show: false, mode:"" });

  const toggleBtn = () => {
    setState(prevState => !prevState);
  }

  useEffect(() => {
    const getRoles = async () => {
      await httpClient
        .get(ROLES.GET)
        .then((res) => {
          if (res.status === 200) {
            const result = res.data;
            const filteredRoles = result.filter((role) => role.role !== "Out Source");

            const roles = filteredRoles.map((role) => {
              return { label: role.role, value: role._id };
            });
            setRoles(roles);
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
    getRoles();
  }, []);

  const valid = () => {
    if (!values.role) {
      setError("Please select your role");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = valid();
    if (isValid) {
      dispatch(userSignIn(values));
    }
  };

  const handleSelectedOption = (selectedOption) => {
    setValues({ ...values, role: selectedOption.value, type: "admin" });
    // setValues({ ...values, role: [selectedOption.label]});
    setError("");
  };

  const handleCloseGenerateOtpModal = () => {
    setShowGenerateOtpModal({ show: false, mode:"" });
  }

  return (
    <>
      {route === "/dashboard" && <Redirect to="/dashboard/home" />}
      <div className="admin_login-page">
        <div className="amdin_login-box">
          <div className="illustration-wrapper">
            <img src={loginImage} width="100%" alt="Login" />
            <h2>Login to manage</h2>
          </div>
          <form
            id="login-form"
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
          >
            <div className="col-lg-12 select_role">
              <p>Select your role</p>
              <Select
                defaultValue={values.role}
                onChange={handleSelectedOption}
                options={roles}
              />
              <small className="text-danger">{error}</small>
            </div>

            <div className="col-md-12">
              <div className="login_layout">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroupPrepend">
                      <i className="fa fa-user-o" aria-hidden="true"></i>
                    </span>
                  </div>
                  <input
                    required
                    type="text"
                    className="form-control border-bottom"
                    id="validationCustomUsername"
                    placeholder="Enter Username"
                    aria-describedby="inputGroupPrepend"
                    value={values.username}
                    onChange={(e) => {
                      setValues({ ...values, username: e.target.value });
                      setError("");
                    }}
                  />
                  <div className="invalid-feedback">
                    Please choose a username.
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroupPrepend">
                      <i className="fa fa-key" aria-hidden="true"></i>
                    </span>
                  </div>
                  <input
                    type={state ? "text" : "password"}
                    className="form-control ms-reveal"
                    id="validationCustomPassword"
                    placeholder="Enter password"
                    aria-describedby="inputGroupPrepend"
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    required
                  />
                  <div
                    style={{ background: '#e8f0fe', height: "49px", padding: "10px" }} onClick={() => toggleBtn()}>{state ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</div>
                  <div className="invalid-feedback" >
                    Please choose password.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="invalidCheck"
                />
                <div className="forgot_pw">
                  <label className="form-check-label" htmlFor="invalidCheck">
                    Remember me
                  </label>
                  <Link to="#" onClick={() => setShowGenerateOtpModal({ show: true, mode:"forgot" })}>Forgot Password?</Link>
                </div>
                <div className="invalid-feedback">
                  You must agree before submitting.
                </div>
              </div>
            </div>
            <div className="col-12">
              <button className="req_btn w-100" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <GenerateOtpModal 
        show={showGenerateOtpModal.show} 
        onHide={handleCloseGenerateOtpModal} 
        mode={showGenerateOtpModal.mode} 
      />
    </>
  );
}
export default Login;
