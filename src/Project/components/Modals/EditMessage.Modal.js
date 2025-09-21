import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { httpClient } from '../../../constants/Api';
import { PROJECT, ORGANISATION } from '../../../constants/AppConstants';
import { Modal } from 'react-bootstrap';
import CkEditor from '../../../App/common/CkEditor';
// import Select from 'react-select';

function EditMessageModal(props) {
  const { show, onHide, selectedRecipients, createdBy } = props;

  const [values, setValues] = useState({
    subject: show.data.subject_id.subject,
    message: show.data.message,
    type: show.data.type,
    recipients: show.data.recipients,
    createdBy: show.data.createdBy,
    subject_id:show.data.subject_id._id,
    userId:show.data.user_id.id,
  });
  const [message, setMessage] = useState('');
  const [tempUsername, setTempUsername] = useState();
  const [options, setOptions] = useState();
  const [inputFields, setInputFields] = useState([...selectedRecipients, ...createdBy]);
  const [userId, setUserId] = useState();
  const messageId = show.data._id;

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
      const usersList = users.data.result;
      const Labels = usersList.map((data) => {
        return { label: `${data.name} (${data.emp_id})`, value: '' };
      });
      const LabelswithId = usersList.map((data) => {
        return { label: `${data.name} (${data.emp_id})`, value: data.id };
      });
      setUserId(LabelswithId);
      setOptions(Labels);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
    }
  };

  const validation = () => {
    let valid = true;
    if (!values.subject.trim()) {
      toast.error('Please type Subject');
      valid = false;
    } else if (!values.message.trim()) {
      toast.error('Please type Message');
      valid = false;
    }
    return valid;
  };

  const updateMessage = async () => {
    if (message) {
      values.message = message;
    } else {
      values.message = show.data.message;
    }
    if (inputFields.length) {
      let userIds = inputFields.map((d) => d);
      userIds = userIds.filter((id) => id != '');
      values.recipients = userIds;
    } else {
      values.recipients = inputFields;
    }
    try {
      const valid = validation();
      if (valid) {
        const res = await httpClient.put(PROJECT.UPDATE_MESSAGE.replace('{messageId}', messageId), values);
        if (res.status === 200) {
          toast.success('Message Updated successfully');
          onHide();
          if (Object.keys(res.data).length > 0 && res.data.result.isuserTagged) {
            await httpClient.post(PROJECT.SEND_MAIL_TO_TAGGED_USERS, res.data.result.emailData);
          }
        }
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };


  // const handleChange = (event, index) => {
  //   const id = userId.find(({ label }) => label === event.label);
  //   const values = [...inputFields];
  //   if (index) {
  //     values[index] = id.value;
  //     setInputFields(values);
  //   } else {
  //     values.push(id.value);
  //     setInputFields(values);
  //   }
  //   setTempUsername("");
  // };

  // const handleRemove = (index) => {
  //   const values = [...inputFields];
  //   values.splice(index, 1);
  //   setInputFields(values);
  // };

  // const Styles = {
  //   container: (provided) => ({
  //     ...provided,
  //     minWidth: "45%",
  //     marginTop: "8px",
  //   }),
  // };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Body>
          {/* <div className="customModal" show={show} onHide={onHide} centered size="lg">
        <div className="modal-lg"></div> */}
          <div className="row justify-content-center modal-lg">
            <div className="col-12">
              <div className="header_title pb-2 pt-2">
                <input
                  className="form-control text_box_outline border-0 fw-bolder"
                  type="text"
                  placeholder="Type the subject of this message..."
                  value={values.subject}
                  onChange={(e) => setValues({ ...values, subject: e.target.value })}
                  readOnly
                ></input>
              </div>
              <div className="ck-body-wrapper">
                <CkEditor values={values} setValues={setValues} setMessage = {setMessage} inputFields={inputFields} inputFields1={values.createdBy} userId={userId} type = "edit" />
              </div>
              {/* {values.type === "sales_status" && (
                <div className="mt-2">
                  {inputFields.length > 0 &&
                    inputFields.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {inputFields.length && options && (
                          <Select
                            isSearchable={true}
                            closeMenuOnSelect={true}
                            styles={Styles}
                            value={userId.find((opt) => opt.value === item)}
                            options={options}
                            onChange={(e) => handleChange(e)}
                          />
                        )}
                        {item ? (
                          <i
                            className="fa fa-close mx-2"
                            aria-hidden="true"
                            style={{
                              fontSize: "20px",
                              color: "grey",
                              cursor: "pointer",
                            }}
                            onClick={(e) => handleRemove(index)}
                          ></i>
                        ) : null}
                      </div>
                    ))}
                  {options && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Select
                          isSearchable={true}
                          closeMenuOnSelect={true}
                          styles={Styles}
                          placeholder="search user"
                          value={tempUsername}
                          options={options}
                          onChange={(e) => {
                            handleChange(e);
                            setTempUsername(e.target ? e.target.value : "");
                          }}
                        />
                      </div>
                      </div>
                  )}
                </div>
              )} */}
              <div className="mt-5 text-end">
                <button type="button" className="btn btn-outline-secondary text-center px-4 mx-2" onClick={onHide}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary text-center px-4 mx-2" onClick={updateMessage}>
                  Post this message
                </button>
              </div>
            </div>
          </div>
          {/* </div>
          </div> */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditMessageModal;
