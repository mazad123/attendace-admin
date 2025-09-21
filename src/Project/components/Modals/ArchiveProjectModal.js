import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { PROJECT } from '../../../constants/AppConstants';
import { httpClient } from '../../../constants/Api';
import { useHistory } from 'react-router';

function ArchiveProjectModal(props) {
    const { show, onHide, projectId } = props;

    const history = useHistory();

    const handleArchiveProject = async () => {
        try {
            const response = await httpClient.patch(PROJECT.ARCHIVE_PROJECT_BY_ID.replace('{projectId}', projectId), { archiveStatus: 0 });
            if (response.status === 200) {
                onHide();
                history.push("/project/project-list");
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header>
                    <Modal.Title>Archive project confirmation!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to archive this project?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleArchiveProject}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ArchiveProjectModal;
