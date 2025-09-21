import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { uploadS3Image } from "../../../Utils/UploadImage";
import UploadImage from "../../../assets/images/thought_bg.jpg";
import { THOUGHT } from "../../../constants/AppConstants";
import { Modal, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

function Thought() {
  const titleRef = useRef();
  const myRef = useRef(null);
  const moveMain = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView();
  const executeMainScroll = () => moveMain.current.scrollIntoView();
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [getThought, setThought] = useState([]);

  const [values, setValues] = useState("");
  const [id, setThoughtId] = useState("");
  const [showDelThought, setshowDelThought] = useState(false);
  const [showIsDisplay, setshowIsDisplay] = useState(false);
  const [flagValue, setFlagValue] = useState("add");
  const [errorThought, setErrorThought] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [errorDisplay, setErrorDisplay] = useState("");
  const [valueDisplay, setValueDisplay] = useState("");
  const [editorErrorValue, setEditorErrorValue] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [editorText, setEditorText] = useState("");
  const [page, setPage] = useState(0);
  const [totalThoughts, setTotalThoughts] = useState(0);
  // const [thoughts, setThoughts] = useState({
  //   totalThoughts: 0,
  //   specificLength: 0,
  // });
  useEffect(() => {
    getThoughts();
  },[]);

  const getThoughts = async () => {
    try {
      setPage(page + 1);
      setLoading(true);
      await httpClient
        .get(`${THOUGHT.GET_THOUGHT}?page=${page + 1}`)
        .then((res) => {
          if (res.status === 200) {
            const updatedData = [...getThought, ...res.data.listThought.data];
            setThought(updatedData);
            setTotalThoughts(res.data.listThought.totalItems);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThought = (id) => {
    setshowDelThought(true);
    setThoughtId(id);
  };

  const handleCloseDeleteThought = () => {
    setshowDelThought(false);
  };

  const handleCloseDisplay = () => {
    setshowIsDisplay(false);
  };

  const confirmDeleteThought = async () => {
    const data = { id };
    try {
      await httpClient
        .delete(THOUGHT.DELETE_THOUGHT, { data })
        .then((res) => {
          if (res.status === 200) {
            toast.success(`${typeValue} Deleted Successfully`); 
            window.location.reload();
            getThoughts();     
            setshowDelThought(false);           
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const updateDisplayThought = (id) => {
    setshowDelThought(true);
    setThoughtId(id);
  };

  const editThought = async (id) => {
    try {
      await httpClient
        .get(THOUGHT.GET_THOUGHT_BY_ID.replace("{id}", id))
        .then((res) => {
          if (res.status === 200) {
            const getEditData = res.data;
            getEditData[0].date = moment(getEditData[0].date).format(
              "YYYY-MM-DD"
            );
            setValueDisplay(getEditData[0].is_display);
            setFlagValue("edit");
            setValues(getEditData[0]);
            setTypeValue(getEditData[0].title);
            setDateValue(getEditData[0].date);
            setDisplayValue(getEditData[0].is_display);
            setIdValue(getEditData[0]._id);
            setUploadedImage(getEditData[0].background_image);
            executeScroll();
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
          setLoading(false);
        });
      // setValues("")
      // getThoughts();
      // const getEditData = getThought.filter(x => x._id === id);
      // console.log("here", getEditData)
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    const fileInput = titleRef;
    const dirName = "thought-images";
    let reader = new FileReader();
    reader.readAsDataURL(titleRef.current.files[0]);
    reader.onloadend = function (e) {
      setUploadedImage([reader.result]);
    };
    const imageURL = await uploadS3Image(fileInput, dirName);
    setImageURL(imageURL.location);
    setLoading(false);
  };

  const addThought = async (e) => {
    e.preventDefault();
    let val = getThought.filter(
      (x) =>
        moment(moment(x.date).format("MM-DD")).isSame(
          moment(values.date).format("MM-DD")
        ) && x.is_display === true
    );
    let valMax = getThought.filter(
      (x) =>
        moment(moment(x.date).format("MM-DD")).isSame(
          moment(values.date).format("MM-DD")
        ) && x.is_display === true
    );

    if (!values.thought) {
      setErrorThought("Editor cannot be left empty!");
      return;
    }
    if (imageURL) {
      values.background_image = imageURL;
    }
    values.title = typeValue;
    values.date = dateValue;
    if (displayValue) {
      values.is_display = displayValue;
    } else {
      values.is_display = false;
    }
    try {
      if (flagValue === "add") {
        if (showIsDisplay === true) {
          values.flag = 1;
          if (values.thought && editorErrorValue === "") {
            await httpClient
              .post(THOUGHT.ADD_THOUGHT, values)
              .then((res) => {
                toast.success(`${typeValue} Added Successfully`);
                window.location.reload();
                getThoughts();
                executeMainScroll();
              })
              .catch((err) => {
                console.log(err.response);
              });
          }
        }
        
        if (val.length >= 1 && values.is_display === true) {
          // setErrorDisplay("Either thought or announcement could be display for the same day.");
          setshowIsDisplay(true);
        } else {
          if (values.thought && editorErrorValue === "") {
            await httpClient
              .post(THOUGHT.ADD_THOUGHT, values)
              .then((res) => {
                toast.success(`${typeValue} Added Successfully`);
                window.location.reload();
                getThoughts();
                executeMainScroll();
              })
              .catch((err) => {
                console.log(err.response);
              });
          }
        }
      } else {
        if (showIsDisplay === true) {
          values.flag = 1;
          if (values.thought && editorErrorValue === "") {
            await httpClient
              .post(THOUGHT.EDIT_THOUGHT.replace("{id}", idValue), values)
              .then((res) => {
                toast.success(`${typeValue} Updated Successfully`);
                window.location.reload();
                getThoughts();
                executeMainScroll();
              })
              .catch((err) => {
                console.log(err.response);
              });
          }
        }
        if (val.length === 1) {
          if (idValue !== val[0]._id && values.is_display === true) {
            setshowIsDisplay(true);
            // setErrorDisplay("Either thought or announcement could be display for the same day.");
            // return true
          } else {
            if (values.thought && editorErrorValue === "") {
              await httpClient
                .post(THOUGHT.EDIT_THOUGHT.replace("{id}", idValue), values)
                .then((res) => {
                  toast.success(`${typeValue} Updated Successfully`);
                  window.location.reload();
                  getThoughts();
                  executeMainScroll();
                })
                .catch((err) => {
                  console.log(err.response);
                });
            }
          }
        } else {
          if (values.thought && editorErrorValue === "") {
            await httpClient
              .post(THOUGHT.EDIT_THOUGHT.replace("{id}", idValue), values)
              .then((res) => {
                toast.success(`${typeValue} Updated Successfully`);
                window.location.reload();
                getThoughts();
                executeMainScroll();
              })
              .catch((err) => {
                console.log(err.response);
              });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteImage = () => {
    setUploadedImage("");
    setImageURL("");
    // values.background_image = "";
  };

  const handleOnChangeType = async (selectedType) => {
    setTypeValue(selectedType);
    if (selectedType === "Thought" && editorText !== "") {
      if (editorText.length > 320) {
        setEditorErrorValue("Length cannot be more 300 word");
        setLoading(true);
      } else {
        setEditorErrorValue("");
        setLoading(false);
      }
    } else if (selectedType === "Announcement" && editorText !== "") {
      if (editorText.length > 640) {
        setEditorErrorValue("Length cannot be more 600 word");
        setLoading(true);
      } else {
        setEditorErrorValue("");
        setLoading(false);
      }
    }
  };

  function stripHtmlTags(html) {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		return doc.body.textContent || "";
	};

  const updateLinkPreview = async (editor) => {
    const data = editor.getData();
    const plainText = stripHtmlTags(data);
    const containsLink = /https?:\/\/\S+/i.test(plainText);
    if (containsLink) {
      try {
        const title = 'Review Link';
        const previewHTML = `
        <a href="${plainText}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; pointer-events: none;">
          <h4 style="margin: 0; text-decoration: none; color: inherit;" pointer-events: none;>${title}</h4>
        </a>`;
        // Insert the content into the editor
        editor.setData(previewHTML);
        setEditorText(previewHTML);
     const newObj = { ...values, thought: previewHTML };
        setValues(newObj);
      } catch (error) {
        console.error('Error fetching link data:', error);
      }
    }
    else{
    setEditorText(data);
    const newObj = { ...values, thought: data };
    setValues(newObj);
    }
  };

  const fetchMoreData = () => {
    // setPage(page + 1);
    getThoughts();
  };

  return (
    <>
      <div className="main_content_panel">
        <div ref={myRef} className="main_content_panel">
          <div className="header_title">
            <h1>
              {" "}
              {flagValue === "edit" ? "Edit" : "Add"}
              <span> Thought/Announcement</span>
            </h1>
          </div>
          <div className="row">
            <div className="col-lg-12 mb-4">
              <div className="dashboard_card">
                <div className="employee_profile">
                  <form className="" onSubmit={addThought}>
                    <div className="row">
                      <div className="mb-4 col-lg-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Type
                        </label>
                        <select
                          className="form-control"
                          aria-label="Default select example"
                          value={typeValue}
                          onChange={(e) => handleOnChangeType(e.target.value)}
                          required
                        >
                          <option value="">Select your Type</option>
                          <option value="Thought">Thought</option>
                          <option value="Announcement">Announcement</option>
                        </select>
                      </div>
                      <div className="mb-4 col-lg-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Date
                        </label>
                        <input
                          type="date"
                          value={dateValue}
                          onChange={(e) => setDateValue(e.target.value)}
                          required
                          className="form-control"
                          placeholder="Enter Date"
                        />
                      </div>
                      <div className="mb-4 col-lg-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          {typeValue === "Announcement"
                            ? "Announcement"
                            : "Thought"}
                        </label>
                        <CKEditor
                          editor={ClassicEditor}
                          config={{
                            toolbar: [
                              "heading",
                              "|",
                              "bold",
                              "italic",
                              "link",
                              "|",
                              "undo",
                              "redo",
                              "bulletedList",
                              "numberedList",
                              "blockQuote",
                              "Indent",
                              "blockIndent",
                              "outdent",
                            ],
                          }}
                          data={values.thought}
                          onReady={(editor) => {}}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            updateLinkPreview(editor);
                            if (typeValue === "Thought" && data.length > 320) {
                              setEditorErrorValue(
                                "Length cannot be more 300 word"
                              );
                              setLoading(true);
                            } else if (
                              typeValue === "Announcement" &&
                              data.length > 640
                            ) {
                              setEditorErrorValue(
                                "Length cannot be more 600 word"
                              );
                              setLoading(true);
                            } else {
                              setEditorErrorValue("");
                              setLoading(false);
                            }
                            setErrorThought("");
                          }}
                          onBlur={(event, editor) => {}}
                          onFocus={(event, editor) => {}}
                        />
                        <small style={{ color: "red" }} role="alert">
                          {errorThought}
                          {editorErrorValue}
                        </small>
                      </div>
                      <div className="mb-4 col-lg-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Upload Background Image
                        </label>
                        <div className="profile-pic imageUploadClass">
                          <label className="-label" htmlFor="file">
                            <span className="glyphicon glyphicon-camera"></span>
                            <span>
                              {!isLoading ? "Change Image" : "Uploading..."}
                            </span>
                          </label>
                          <input
                            id="file"
                            type="file"
                            onChange={handleClick}
                            ref={titleRef}
                            accept="image/*"
                          />
                          <img
                            src={uploadedImage ? uploadedImage : UploadImage}
                            id="output"
                            width="200"
                            alt=""
                          />
                        </div>
                        <div>
                          {uploadedImage ? (
                            <button
                              type="button"
                              style={{ float: "right", marginTop: "10px" }}
                              onClick={deleteImage}
                              className="btn btn-leave_status"
                            >
                              Remove Image
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="mb-4 col-lg-8">
                        <input
                          name="isGoing"
                          type="checkbox"
                          checked={displayValue === true ? true : false}
                          style={{ marginRight: "10px" }}
                          onChange={(e) => {
                            setDisplayValue(e.target.checked);
                          }}
                        />
                        <span>
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Is Display?
                          </label>
                        </span>
                        <p>
                          <small style={{ color: "red" }} role="alert">
                            {errorDisplay}
                          </small>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      {/* {displayValue.is_display}
                      {isDisplayValue.length >= 1 && displayValue.is_display ? <button type="button" disabled={isLoading ? true : false} onClick={updateDisplayThought} className="btn btn-leave_status">
                        Submit Details
                      </button> : } */}
                      <button
                        type="submit"
                        disabled={isLoading ? true : false}
                        className="btn btn-leave_status"
                      >
                        Submit Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref={moveMain} className="main_content_panel">
          <div className="header_title">
            <h1>
              {" "}
              <span> Thoughts/Announcements</span>
            </h1>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard_card employee_lists">
                <div className="employee_table">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Background Image</th>
                        <th scope="col">Thoughts/Announcements Description</th>
                        <th scope="col">View Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getThought.length > 0 &&
                        getThought.map((thought, i) => (
                          <tr key={i}>
                            <td className="text-nowrap">{thought.title}</td>
                            <td className="text-nowrap">
                              <img
                                src={
                                  thought.background_image
                                    ? thought.background_image
                                    : ""
                                }
                                id="output"
                                width="50"
                                alt=""
                              />
                            </td>
                            <td>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: thought.thought
                                    .replaceAll("&lt;", "<")
                                    .replaceAll("&gt;", ">").replaceAll("<a ","<a target='_blank'"),
                                }}
                              ></div>
                            </td>
                            <td className="text-nowrap">
                              {moment(thought.date).format("L")}
                            </td>
                            <td className="text-nowrap">
                              <button
                                onClick={(e) => deleteThought(thought._id)}
                                // onClick={(e) => deleteThought(thought._id)}
                                data-target={thought._id}
                                title="Delete Thought"
                                className="edit_emp_detail table_btn mx-1"
                                style={{ cursor: "pointer" }}
                              >
                                <i
                                  className="fa fa-trash"
                                  data-target={thought._id}
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                onClick={(e) => editThought(thought._id)}
                                data-target={thought._id}
                                title="Edit Thought"
                                className="edit_emp_detail table_btn mx-1"
                                style={{ cursor: "pointer" }}
                              >
                                <i
                                  className="fa fa-edit"
                                  data-target={thought._id}
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {getThought.length < totalThoughts && (
            <div className="text-center">
              <InfiniteScroll
                dataLength={getThought?.length}
                next={fetchMoreData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
              >
                {getThought?.map((i, index) => (
                  <div key={index}></div>
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
      <Modal show={showDelThought} onHide={handleCloseDeleteThought}>
        <Modal.Body>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ paddingBottom: "10px" }}>
            Are you sure you want to delete this thought?
          </div>
          <Button variant="secondary" onClick={handleCloseDeleteThought}>
            No
          </Button>
          <Button variant="primary" onClick={confirmDeleteThought}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showIsDisplay} onHide={handleCloseDisplay}>
        <Modal.Body>
          <Modal.Title>Confirm Display</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ paddingBottom: "10px" }}>
            Either thought or announcement could be display for the same day.
            Are you sure you want to overwrite?
          </div>
          <Button variant="secondary" onClick={handleCloseDisplay}>
            No
          </Button>
          <Button variant="primary" onClick={addThought}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Thought;
