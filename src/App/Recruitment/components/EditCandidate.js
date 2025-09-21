import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { httpClient } from "../../../constants/Api";
import { useHistory } from "react-router";
import { uploadS3Image } from "../../../Utils/UploadImage";
import { USER, CANDIDATE } from "../../../constants/AppConstants";
import CkEditor from "../../common/CkEditor";
import moment from "moment";

function EditCandidate() {
  const history = useHistory();
  const titleRef = useRef();
  const [values, setValues] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [focusClass, setFocusClass] = useState("mb-4 col-lg-6");
  const [uploadedImage, setUploadedImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState("");
  const [category, setCategory] = useState([]);
  const [resultStatus, setResultStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategory();
    getCandidateDetail();
    getResultStatus();
  }, []);

  const getCategory = async () => {
    try {
      setLoading(true);
      const getCategory = await httpClient
        .get(CANDIDATE.GET_CATEGORY)
        .then((res) => {
          if (res.status === 200) {
            setCategory(res.data.result);
          }
        });

    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching category data");
      setLoading(false);
    }
  };

  const getResultStatus = async () => {
    try {
      setLoading(true);
      const getResultStatus = await httpClient
        .get(CANDIDATE.GET_RESULT_STATUS)
        .then((res) => {
          if (res.status === 200) {
            setResultStatus(res.data.result);
          }
          setLoading(false);
        });

    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching result status data");
      setLoading(false);
    }
  };

  const getCandidateDetail = async () => {
    try {
      await httpClient
        .get(CANDIDATE.GET_CANDIDATE_DETAIL.replace("{candidateId}", candidateId))
        .then((res) => {
          if (res.status === 200) {
            res.data.result.dob = res.data.result.dob ? moment(res.data.result.dob).format("YYYY-MM-DD") : "MM/DD/YYYY";
            setValues(res.data.result);
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

  const editEmployeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await httpClient
        .put(CANDIDATE.UPDATE_CANDIDATE.replace("{id}", candidateId), values)
        .then(async (res) => {
          if (res.status === 200) {
            toast.success("Candidate Updated successfully");
            history.push("/candidate/list");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            if (err.response.data.message === "Error: Email already exist!") {
              setErrorEmail("Email already exist!");
              setFocusClass("mb-4 col-lg-6 error-focus");
            }
            else {
              toast.error(err.response.data.message);
            }
          } else {
            toast.error("Something went wrong");
          }
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    } finally{
      setLoading(false);
    }
  };

  const handleClick = async () => {
    const fileInput = titleRef;
    const dirName = "candidate-cv";
    let reader = new FileReader();
    reader.readAsDataURL(titleRef.current?.files[0]);
    reader.onloadend = function (e) {
      setUploadedImage([reader.result]);
    };
    const imageURL = await uploadS3Image(fileInput, dirName);
    setImageURL(imageURL.location);
    setValues({ ...values, candidate_cv_URL: imageURL.location, candidate_cv_fileName: titleRef.current?.files[0].name })
  };

  return (
    <>
      <div className="main_content_panel">
        <div className="header_title">
          <h1>
            {" "}
            Edit<span> Candidate Details</span>
          </h1>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-9 mb-4">
            <div className="dashboard_card">
              <div className="employee_profile">
                <form
                  className=""
                  auto-complete="off"
                  onSubmit={editEmployeeSubmit}
                >
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="heading-title-wrap mt-4 mb-4 pt-4">
                        <h4 className="heading-title-info">Personal Details</h4>
                      </div>
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Candidate Name</label>
                      <input
                        type="text"
                        value={values.candidate_name}
                        onChange={(e) =>
                          setValues({ ...values, candidate_name: e.target.value })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Candidate Name"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={values.email}
                        onChange={(e) =>
                          setValues({ ...values, email: e.target.value })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Email"
                      />
                      <small style={{ color: "red" }} role="alert">
                        {errorEmail}
                      </small>
                    </div>

                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        value={values.phone}
                        onChange={(e) =>
                          setValues({ ...values, phone: e.target.value })
                        }
                        required
                        minLength="10"
                        maxLength="10"
                        className="form-control"
                        placeholder="Enter Phone Number"
                      />
                    </div>


                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        value={values.dob}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            dob: e.target.value,
                          })
                        }
                        max={moment().format("YYYY-MM-DD")}
                        className="form-control"
                      />
                    </div>

                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Current Company</label>
                      <input
                        type="text"
                        value={values.current_company}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            current_company: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Current Company"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Experience</label>
                      <input
                        type="text"
                        value={values.experience}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            experience: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Experience"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Current CTC</label>
                      <input
                        type="text"
                        value={values.current_ctc}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            current_ctc: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Current CTC"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Expected CTC</label>
                      <input
                        type="text"
                        value={values.expected_ctc}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            expected_ctc: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Expected CTC"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Notice Period in Days</label>
                      <input
                        type="number"
                        value={values.notice_period}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            notice_period: e.target.value,
                          })
                        }
                        step="any"
                        maxLength="5"
                        required
                        className="form-control"
                        placeholder="Enter Notice Period"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Current Location</label>
                      <input
                        type="text"
                        value={values.current_location}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            current_location: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Current Location"
                      />
                    </div>
                    <div className="mb-6 col-lg-4">
                      <label className="form-label">Source of Hiring</label>
                      <input
                        type="text"
                        value={values.source_of_hiring}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            source_of_hiring: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Source of Hiring"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Qualification</label>
                      <input
                        type="text"
                        value={values.qualification}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            qualification: e.target.value,
                          })
                        }
                        required
                        className="form-control"
                        placeholder="Enter Qualifcation"
                      />
                    </div>
                    <div className="col-lg-4 select_role">
                      <label className="form-label">Category </label>
                      <select
                        className="form-control"
                        aria-label="Default select example"
                        value={values.category}
                        onChange={(e) =>
                          setValues({ ...values, category: e.target.value })
                        }
                        required
                      >
                        <option value="">Select your Category</option>
                        {category.length > 0 &&
                          category.map((r, i) => (
                            <option value={r._id} key={i}>
                              {r.category}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Recruiter Name</label>
                      <input
                        type="text"
                        value={values.recruiter_name}
                        onChange={(e) =>
                          setValues({ ...values, recruiter_name: e.target.value })
                        }
                        className="form-control"
                        placeholder="Enter Recruiter Name"
                        required
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Upload CV</label>
                      <input
                        id="file"
                        type="file"
                        src={values.candidate_cv_URL ? values.candidate_cv_URL : ""}
                        onChange={handleClick}
                        ref={titleRef}
                        accept=".pdf,.docx,.doc"
                        className="form-control"
                        placeholder="Choose File"
                      />
                      <small className="text-muted"><strong>Previous File : </strong>{values.candidate_cv_fileName ? values.candidate_cv_fileName : "NA"}</small>
                    </div>

                    <div className="col-lg-6">
                      <div className="heading-title-wrap mt-4 mb-4">
                        <h4 className="heading-title-info">Aptitude Round Details</h4>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="heading-title-wrap mt-4 mb-4">
                        <h4 className="heading-title-info">Technical Round Details</h4>
                      </div>
                    </div>

                    <div className="col-lg-12 form-second-section-wrap">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="col-lg-12 select_role">
                            <label className="form-label">Aptitude Round</label>
                            <select
                              className="form-control"
                              aria-label="Default select example"
                              value={values.aptitude_round}
                              onChange={(e) =>
                                setValues({ ...values, aptitude_round: e.target.value })
                              }
                            >
                              {resultStatus.length > 0 &&
                                resultStatus.map((r, i) => {
                                  return (
                                    <>
                                      {r.result_status == "Pending" ? <option value={r._id}>Select Marks Status</option> : (
                                        <option value={r._id} key={i}>
                                          {r.result_status}
                                        </option>
                                      )
                                      }
                                    </>
                                  )
                                })}
                            </select>
                          </div>
                          {/* <div className="mb-4 col-lg-12">
                            <label className="form-label">Aptitude Round Remarks</label>
                            <textarea
                              type="text"
                              value={values.aptitude_round_comment}
                              onChange={(e) =>
                                setValues({ ...values, aptitude_round_comment: e.target.value })
                              }
                              className="form-control"
                              placeholder="Enter Aptitude Round Remarks"
                            />
                          </div> */}

                          <div className="ck-body-wrapper mb-4 col-lg-12">
                            <label className="form-label">Aptitude Round Remarks</label>
                            <CkEditor
                              fieldName="aptitude_round_comment"
                              values={values}
                              setValues={setValues}
                              type="edit_candidate"
                            />
                          </div>


                          <div className="col-lg-12">
                            <div className="heading-title-wrap mt-4 mb-4 pt-4">
                              <h4 className="heading-title-info">Manager Round Details</h4>
                            </div>
                          </div>

                          <div className="col-lg-12 select_role">
                            <label className="form-label">Manager Round</label>
                            <select
                              className="form-control"
                              aria-label="Default select example"
                              value={values.manager_round}
                              onChange={(e) =>
                                setValues({ ...values, manager_round: e.target.value })
                              }
                            >
                              {resultStatus.length > 0 &&
                                resultStatus.map((r, i) => {
                                  return (
                                    <>
                                      {r.result_status == "Pending" ? <option value={r._id}>Select Marks Status</option> : (
                                        <option value={r._id} key={i}>
                                          {r.result_status}
                                        </option>

                                      )
                                      }
                                    </>
                                  )
                                })}
                            </select>
                          </div>
                          {/* <div className="mb-4 col-lg-12">
                            <label className="form-label">Manager Round Remarks</label>
                            <textarea
                              type="text"
                              value={values.manager_round_comment}
                              onChange={(e) =>
                                setValues({ ...values, manager_round_comment: e.target.value })
                              }
                              className="form-control"
                              placeholder="Enter Manager Round Remarks"
                            />
                          </div> */}
                          <div className="ck-body-wrapper mb-4 col-lg-12">
                            <label className="form-label">Manager Round Remarks</label>
                            <CkEditor
                              fieldName="manager_round_comment"
                              values={values}
                              setValues={setValues}
                              type="edit_candidate"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="col-lg-12 select_role">
                            <label className="form-label">Technical Round</label>
                            <select
                              className="form-control"
                              aria-label="Default select example"
                              value={values.technical_round}
                              onChange={(e) =>
                                setValues({ ...values, technical_round: e.target.value })
                              }
                            >

                              {resultStatus.length > 0 &&
                                resultStatus.map((r, i) => {
                                  return (
                                    <>
                                      {r.result_status == "Pending" ? <option value={r._id}>Select Marks Status</option> : (
                                        <option value={r._id} key={i}>
                                          {r.result_status}
                                        </option>

                                      )
                                      }
                                    </>
                                  )
                                })}
                            </select>
                          </div>
                          {/* <div className="mb-4 col-lg-12">
                            <label className="form-label">Technical Round Remarks</label>
                            <textarea
                              type="text"
                              value={values.technical_round_comment}
                              onChange={(e) =>
                                setValues({ ...values, technical_round_comment: e.target.value })
                              }
                              className="form-control"
                              placeholder="Enter Technical Round Remarks"
                            />
                          </div> */}

                          <div className="ck-body-wrapper mb-4 col-lg-12">
                            <label className="form-label">Technical Round Remarks</label>
                            <CkEditor
                              fieldName="technical_round_comment"
                              values={values}
                              setValues={setValues}
                              type="edit_candidate"
                            />
                          </div>

                          <div className="col-lg-12">
                            <div className="heading-title-wrap mt-4 mb-4 pt-4">
                              <h4 className="heading-title-info">Final Round Details</h4>
                            </div>
                          </div>

                          <div className="col-lg-12 select_role">
                            <label className="form-label">Final Round</label>
                            <select
                              className="form-control"
                              aria-label="Default select example"
                              value={values.final_round}
                              onChange={(e) =>
                                setValues({ ...values, final_round: e.target.value })
                              }
                            >
                              {resultStatus.length > 0 &&
                                resultStatus.map((r, i) => {
                                  return (
                                    <>
                                      {r.result_status == "Pending" ? <option value={r._id}>Select Marks Status</option> : (
                                        <option value={r._id} key={i}>
                                          {r.result_status}
                                        </option>

                                      )
                                      }
                                    </>
                                  )
                                })}
                            </select>
                          </div>

                          {/* <div className="mb-4 col-lg-12">
                            <label className="form-label">Final Round Remarks</label>
                            <textarea
                              type="text"
                              value={values.final_round_comment}
                              onChange={(e) =>
                                setValues({ ...values, final_round_comment: e.target.value })
                              }
                              className="form-control"
                              placeholder="Enter Final Round Remarks"
                            />
                          </div> */}

                          <div className="ck-body-wrapper mb-4 col-lg-12">
                            <label className="form-label">Final Round Remarks</label>
                            <CkEditor
                              fieldName="final_round_comment"
                              values={values}
                              setValues={setValues}
                              type="edit_candidate"
                            />
                          </div>

                        </div>

                        <div className="col-lg-12">
                          <div className="heading-title-wrap mt-4 mb-4">
                            <h4 className="heading-title-info">Additional Comment</h4>
                          </div>
                        </div>
                        {/* <div className="mb-4 col-lg-12">

                          <textarea
                            type="text"
                            value={values.additional_comment}
                            onChange={(e) =>
                              setValues({ ...values, additional_comment: e.target.value })
                            }
                            className="form-control"
                            placeholder="Enter Additional Comment"
                          />
                        </div> */}
                        <div className="ck-body-wrapper mb-4 col-lg-12">
                          <CkEditor
                            fieldName="additional_comment"
                            values={values}
                            setValues={setValues}
                            type="edit_candidate"
                          />
                        </div>
                        <div className="col-lg-5 mb-4">
                          {
                            loading ? (
                              <button
                                className="btn btn-leave_status"
                                style={{ width: "222px" }}
                                disabled
                              >
                                <div
                                  className="spinner-border text-light"
                                  style={{ width: "1.3em", height: "1.3em" }}
                                  role="status"
                                >
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </button>
                            ) : (
                              <button type="submit" className="btn btn-leave_status">
                                Submit Details
                              </button>)
                          }
                          {/* <button type="submit" className="btn btn-leave_status">
                            Submit Details
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditCandidate;
