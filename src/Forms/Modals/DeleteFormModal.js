import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { httpClient } from '../../constants/Api';
import { FORMS } from '../../constants/AppConstants';
import { toast } from 'react-toastify';

const ReGenerateFormModal = ({ show, onHide, getAllGeneratedForms, deleteFormModalProps }) => {
  const { formId } = deleteFormModalProps;
  const [loading, setLoading] = useState(false);


  const deleteForm = async() => {
    try {
      setLoading(true);
      await httpClient.delete(FORMS.DELETE_FORM_BY_ID.replace("{id}", formId));
      toast.success("Form deleted sucessfully");
      onHide();
      getAllGeneratedForms();
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
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
          <Modal.Title id="example-modal-sizes-title-sm">Delete Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this form ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => deleteForm( )}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReGenerateFormModal;
