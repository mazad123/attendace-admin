import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { httpClient } from '../../constants/Api';
import { FORMS, ORGANISATION } from '../../constants/AppConstants';
import { toast } from 'react-toastify';
import Select from "react-select";

const ApprovalModal = ({ show, onHide, showApprovalModalProps }) => {
  const { formId, userId, getAllGeneratedForms } = showApprovalModalProps;
  const [loading, setLoading] = useState(false);
  const [allUsersWithId, setAllUsersWithId] = useState([]);
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const requestForApprove = async (formId, managerId) => {
    try {
      setLoading(true);
      const resp = await httpClient.patch(`${FORMS.UPDATE_FORM_MANAGER_NAME_BY_ID.replace('{id}', formId)}?managerId=${managerId}&userId=${userId}`);
      if (resp.status === 200) {
        toast.success('Notification send to manager successfully');
        onHide();
        getAllGeneratedForms();
      }
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const Styles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
      marginTop: '0px',
    }),
  };

  const getUsers = async () => {
    try {
      const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
      const usersList = users.data.result;
      const Labels = usersList.map((data) => {
        return { label: `${data.name} (${data.emp_id})`, value: '', empId: data.emp_id, name: data };
      });
      const LabelswithId = usersList.map((data) => {
        return { label: `${data.name} (${data.emp_id})`, value: data.id, empId: data.emp_id, name: data.name };
      });
      setAllUsersWithId(LabelswithId);
      // setOptions(Labels);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
    }
  };

  return (
    <>
      <Modal size="md" show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-sm" centered>
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-sm">Send approval request to manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="head-title-wrap">
              <h6 className="head-title-info col-black mb-3">Select Manager</h6>
            </div>
            {allUsersWithId && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Select
                  isSearchable={true}
                  closeMenuOnSelect={true}
                  styles={Styles}
                  menuPosition={'fixed'}
                  placeholder="Select | Search Manager"
                  // value={form.approveRelievingFormManagerId}
                  // defaultInputValue={form.approveRelievingFormManagerId}
                  options={allUsersWithId}
                  onChange={(e) => setManagerId(e.value)}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => requestForApprove(formId, managerId)}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalModal;
