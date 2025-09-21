import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { PROJECT } from "../../../constants/AppConstants";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
function ViewMessageModal(props) {
    const {
        show,
        onHide,
    } = props;
   
    return (
        <>
            <Modal show={show} onHide={onHide}  centered>
                <Modal.Header>
                    <Modal.Title>{show?.subject}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p dangerouslySetInnerHTML={{
                        __html: show?.message
                            .replaceAll("&lt;", "<")
                            .replaceAll("&gt;", ">"),
                    }}></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewMessageModal;
