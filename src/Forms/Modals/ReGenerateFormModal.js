import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { httpClient } from '../../constants/Api';
import { FORMS } from '../../constants/AppConstants';
import { toast } from 'react-toastify';

const ReGenerateFormModal = ({ show, onHide, getAllGeneratedForms, showRegenerateFormModalProps }) => {
  const { formId, formName } = showRegenerateFormModalProps;
  const [loading, setLoading] = useState(false);


  const regenerateForm = async() => {
    try {
      const data = {
        formId,
        formName
      }
      setLoading(true);
      const resp = await httpClient.patch(FORMS.RE_ASSIGNED_FORM_TO_EMPLOYEE, {data});
      if (resp.status === 200) {
        toast.success('Form reassigned successfully');
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
  }

  const Styles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
      marginTop: '0px',
    }),
  };

  return (
    <>
      <Modal size="md" show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-sm" centered>
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-sm">Re-Assign Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to re-assign this form ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => regenerateForm( )}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReGenerateFormModal;
