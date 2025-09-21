import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { USER, FORMS } from '../../constants/AppConstants';
import { httpClient } from '../../constants/Api';
import moment from 'moment';

function MoveToExEmployeeModal(props) {
  const { show, onHide, userId, formId, hrResponse, getAllGeneratedForms } = props;
  const [values, setValues] = useState({});

  const hanldeHrApproval = async () => {
    const hrApproval = { hrResponse };
    values.userId = userId;
    const data = values;

    const validation = () => {
      let valid = true;
      if (!data.releving_date) {
        toast.error('Please Select Date');
        valid = false;
      }
      return valid;
    };

    try {
      const valid = validation();
      if (valid) {
        await httpClient
          .post(USER.EX_USER, data)
          .then(async (res) => {
            if (res.status === 200) {
              const response = await httpClient.patch(FORMS.UPDATE_USER_RELIEVING_FORM_STATUS_THROUGH_HR_BY_FORM_ID.replace('{formId}', formId), hrApproval);
              if (response.status === 200) {
                toast.success('HR approval done and employee deactivated successfully');
                onHide();
                getAllGeneratedForms();
              }
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response) {
              if(err.response.data && err.response.data.message === "Error: parent not found, please contact to Admin"){
                toast.error("Parent Not Found. Please Contact to Admin");
              }else{
                toast.error(err.response.data.message);
              }
            }else{
              toast.error("Something went wrong");
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Confirm to move in Ex-Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 col-lg-6">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Relieving Date
            </label>
            <input
              type="date"
              value={values.releving_date ? moment(values.releving_date).format('YYYY-MM-DD') : ''}
              onChange={(e) =>
                setValues({
                  ...values,
                  releving_date: moment(e.target.value).format('YYYY-MM-DD'),
                })
              }
              required={true}
              className="form-control"
              placeholder="Enter Relieving Date"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-4 col-lg-8">
            <input
              type="checkbox"
              // value="true"
              checked={values.exit_formality}
              onChange={(e) =>
                setValues({
                  ...values,
                  exit_formality: e.target.checked,
                })
              }
              style={{ marginRight: '10px' }}
              name="exit_formality"
            />
            <label htmlFor="exampleInputEmail1" className="form-label">
              Is Relieving Formalities are done?
            </label>
            <label>Comments:-</label>
            <textarea
              type="text"
              value={values.comments}
              onChange={(e) =>
                setValues({
                  ...values,
                  comments: e.target.value,
                })
              }
              style={{
                marginRight: '10px',
                width: '450px',
                marginTop: '10px',
              }}
              name="comments"
            />
            <input
              type="checkbox"
              checked={values.isElligibleToRehire}
              onChange={(e) =>
                setValues({
                  ...values,
                  isElligibleToRehire: e.target.checked,
                })
              }
              defaultChecked={true}
              style={{ marginRight: '10px' }}
              name="exit_formality"
            />
            <label htmlFor="exampleInputEmail1" className="form-label">
              Is eligible to Re-hire?
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <button type="submit" className="btn btn-primary" onClick={hanldeHrApproval}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MoveToExEmployeeModal;
