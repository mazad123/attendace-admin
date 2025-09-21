import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { useHistory } from "react-router";
import { uploadS3Image } from "../../../Utils/UploadImage";
import { CANDIDATE } from "../../../constants/AppConstants";
import moment from "moment";


function AddNewCandidate() {
  const history = useHistory();
  const titleRef = useRef();
  const [values, setValues] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusClass, setFocusClass] = useState("mb-4 col-lg-6");
  const [uploadedImage, setUploadedImage] = useState("");
  const [category, setCategory] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    getCategory();
  },

    []);

  const getCategory = async () => {
    try {
      setLoading(true);
      const getCategory = await httpClient
        .get(CANDIDATE.GET_CATEGORY)
        .then((res) => {
          if (res.status === 200) {
            setCategory(res.data.result);
          }
          setLoading(false);
        });

    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching category data");
      setLoading(false);
    }
  };

  // const addCandidateSubmit = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   try {

  //     if (imageURL) {
  //       values.candidate_cv_URL = imageURL;
  //     }
  //     if (imageName) {
  //       values.candidate_cv_fileName = imageName;
  //     }
  //     console.log({values});
  //     await httpClient
  //       .post(CANDIDATE.ADD_CANDIDATE, values)
  //       .then((res) => {
  //         if (res.status === 200) {
  //           toast.success("New Candidate Added successfully");
  //           setLoading(false);
  //           history.push("/candidate/list");

  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err.response);
  //         if (err.response) {
  //           if (err.response.data.message === "Error: Email already exist!") {
  //             setErrorEmail("Email already exist!");
  //             setFocusClass("mb-4 col-lg-6 error-focus");
  //           } else {
  //             toast.error(err.response.data.message);
  //           }
  //         } else {
  //           toast.error("Something went wrong");
  //         }
  //       });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleClick = async () => {
  //   setLoading(true);
  //   const fileInput = titleRef;
  //   const dirName = "candidate-cv";
  //   const reader = new FileReader();
  //   reader.readAsDataURL(titleRef?.current?.files[0]);
  //   reader.onloadend = function (e) {
  //     setUploadedImage([reader.result]);
  //   };
  //   const image_URL = await uploadS3Image(fileInput, dirName);
  //   setImageURL(image_URL.location);
  //   setImageName(titleRef?.current?.files[0]?.name);
  //   setLoading(false);
  // };

  const addCandidateSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Create a copy of values to avoid direct state mutation
      const formValues = { ...values };

      // Check if there's a file selected in the input
      if (titleRef?.current?.files[0]) {
        const fileInput = titleRef;
        const dirName = "candidate-cv";

        // Upload the file and wait for it to complete
        const image_URL = await uploadS3Image(fileInput, dirName);

        // Update the form values directly
        formValues.candidate_cv_URL = image_URL.location;
        formValues.candidate_cv_fileName = titleRef.current.files[0].name;
      } else if (imageURL) {
        // If no new file but imageURL exists from previous upload
        formValues.candidate_cv_URL = imageURL;
        formValues.candidate_cv_fileName = imageName;
      }
      await httpClient
        .post(CANDIDATE.ADD_CANDIDATE, formValues)
        .then((res) => {
          if (res.status === 200) {
            toast.success("New Candidate Added successfully");
            setLoading(false);
            history.push("/candidate/list");
          }
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response) {
            if (err.response.data.message === "Error: Email already exist!") {
              setErrorEmail("Email already exist!");
              setFocusClass("mb-4 col-lg-6 error-focus");
            } else {
              toast.error(err.response.data.message);
            }
          } else {
            toast.error("Something went wrong");
          }
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // You might not need handleClick anymore if you're handling upload during submit
  // But keep it if you need it for preview purposes
  const handleClick = async () => {
    setLoading(true);
    const fileInput = titleRef;
    const dirName = "candidate-cv";
    const reader = new FileReader();
    reader.readAsDataURL(titleRef?.current?.files[0]);
    reader.onloadend = function (e) {
      setUploadedImage([reader.result]);
    };
    setLoading(false);
  };

  return (
    <>
      <div className="main_content_panel">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="header_title">
              <h1>
                Add<span> New Candidate Details</span>
              </h1>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-9 mb-4">
            <div className="dashboard_card">
              <div className="employee_profile">
                <form
                  className=""
                  auto-complete="off"
                  onSubmit={addCandidateSubmit}
                >
                  <div className="row">

                    <div className="col-lg-12">
                      <div className="heading-title-wrap mt-4 mb-4">
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
                        onChange={(e) =>
                          setValues({
                            ...values,
                            notice_period: e.target.value,
                          })
                        }
                        step="any"
                        maxLength="3"
                        required
                        className="form-control"
                        placeholder="Enter Notice Period"
                      />
                    </div>
                    <div className="mb-4 col-lg-4">
                      <label className="form-label">Current Location</label>
                      <input
                        type="text"
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
                      <label className="form-label">Upload CV</label>
                      <input
                        id="file"
                        type="file"
                        onChange={handleClick}
                        ref={titleRef}
                        // value={candidate_selected_file}
                        className="form-control"
                        placeholder="Choose File"
                        accept=".pdf,.docx,.doc"
                        required
                      />
                    </div>
                    <div className="col-lg-5 mt-4">
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

export default AddNewCandidate;