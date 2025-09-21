import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { USER } from '../../../../constants/AppConstants';
import { httpClient } from '../../../../constants/Api';
import moment from 'moment';

function ExEmployeeModal(props) {
  const { show, onHide, userId, from, user_data } = props;
  const [values, setValues] = useState( user_data ? user_data : "" );
  
  const exEmployee = async (e) => {
    e.preventDefault();
    const user = userId;
    const data = { userId };
    data.exit_formality = values.exit_formality;
    data.comments = values.comments;
    data.isElligibleToRehire = values.isElligibleToRehire;
    // data.releving_date = moment(values.releving_date);
    data.releving_date = values.releving_date;
    try {
      await httpClient
        .post(USER.EX_USER, data)
        .then(async (res) => {
          if (res.status === 200) {
            from==="ex-Employee" ? toast.success('Ex-Employee Details Updated Successfully')
            :toast.success('Employee Deactivated Successfully');   
            onHide();
            values.releving_date = '';
            values.comment = '';
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            if(err.response.data.message === "Error: parent not found, please contact to Admin"){
              toast.error("Parent Not Found. Please Contact to Admin");
            }else{
              toast.error("Something went wrong"); 
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
console.log({ date:values.releving_date})
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <form onSubmit={exEmployee}>
          <Modal.Header>
            {/* <Modal.Title>Confirm Remove</Modal.Title> */}
            {
              from==="ex-Employee" ? 
              <Modal.Title>Edit Ex-Employee Details</Modal.Title>
              : <Modal.Title>Confirm Remove</Modal.Title> 
            }
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
                required
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
                defaultChecked = {true}
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default ExEmployeeModal;
