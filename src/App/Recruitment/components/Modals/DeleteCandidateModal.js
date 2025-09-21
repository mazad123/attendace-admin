import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { CANDIDATE } from "../../../../constants/AppConstants";
import { httpClient } from "../../../../constants/Api";


function DeleteCandidateModal(props) {
  const { show, onHide, candidateId } = props;
  const deleteCandidate = async (e) => {
    e.preventDefault();
    // const candidate = candidateId;
    //  const body = { candidateId };
    try {
      await httpClient
        .delete(CANDIDATE.DELETE_CANDIDATE.replace("{id}", candidateId))
        .then((res) => {
          if (res.status === 200) {
            toast.success("Candidate Deleted Successfully");
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
            Are you sure you want to delete this candidate?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            No
          </Button>
          <Button variant="primary" onClick={deleteCandidate}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteCandidateModal;
