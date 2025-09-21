import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { httpClient } from '../../../constants/Api';
import { PROJECT, ORGANISATION } from '../../../constants/AppConstants';
import { Modal } from 'react-bootstrap';
import CkEditor from '../../../App/common/CkEditor';

function EditProjectMessageModal(props) {
  const { show, onHide } = props;
  const [values, setValues] = useState({
    message: show.data.message,
    messageId: show.data._id,
    recipients: show.data.recipients,
    projectId: show.data.project_id._id,
    subject: show.data.subject_id.subject,
    subject_id:show.data.subject_id._id
  });

  const [message, setMessage] = useState('');
  const [inputFields, setInputFields] = useState([...show.allSelectedRecipients]);
  const [userId, setUserId] = useState();
  const [options, setOptions] = useState();

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
    if (!values.message.trim()) {
      toast.error('Please type Message');
      valid = false;
    }
    return valid;
  };

  const updateProjectMessage = async () => {
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
        const res = await httpClient.put(PROJECT.UPDATE_PROJECT_MESSAGE.replace('{projectMessageId}', values.messageId), values);
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

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Body>
          {/* <div className="customModal" show={show} onHide={onHide} centered size="lg">
        <div className="modal-lg"> */}
          <div className="row justify-content-center  modal-lg">
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
                <CkEditor values={values} setValues={setValues} setMessage = {setMessage} inputFields={inputFields} inputFields1= {[]} userId={userId} type = "edit" />
              </div>
              <div className="mt-5 text-end">
                <button type="button" className="btn btn-outline-secondary text-center px-4 mx-2" onClick={onHide}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary text-center px-4 mx-2" onClick={updateProjectMessage}>
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

export default EditProjectMessageModal;
