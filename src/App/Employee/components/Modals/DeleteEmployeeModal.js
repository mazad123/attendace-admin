import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { USER } from "../../../../constants/AppConstants";
import { httpClient } from "../../../../constants/Api";

function DeleteEmployeeModal(props) {
  const { show, onHide, userId } = props;

  const deleteEmployee = async (e) => {
    e.preventDefault();
    const user = userId;
    const data = { userId };
    try {
      await httpClient
        .delete(USER.DELETE_USER, { data })
        .then(async (res) => {
          if (res.status === 200) {
            toast.success("Employee Deleted Successfully");
            onHide();
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ paddingBottom: "10px" }}>
            Are you sure you want to delete this employee?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            No
          </Button>
          <Button variant="primary" onClick={deleteEmployee}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteEmployeeModal;
