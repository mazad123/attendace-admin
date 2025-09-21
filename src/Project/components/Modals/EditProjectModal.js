import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { httpClient } from '../../../constants/Api';
import { PROJECT, ORGANISATION } from '../../../constants/AppConstants';
import { Modal } from 'react-bootstrap';

function EditProjectModal(props) {
  const { show, onHide, data, callback } = props;
  const [values, setValues] = useState({ name: data.name, description: data.description, recipients: [] });
  const [options, setOptions] = useState([]);
  const [tempUsername, setTempUsername] = useState();
  const [inputFields, setInputFields] = useState([]);
  const [userId, setUserId] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletedUserIds, setDeletedUserIds] = useState([]); // Track deleted user IDs

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
      const usersList = users.data.result;
      const filteredUsers = usersList.filter((user) => !data.users.includes(user.id)); // Exclude already selected users
      const Labels = filteredUsers.map((data) => {
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

  // const getUsers = async () => {
  //   try {
  //     const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
  //     const usersList = users.data.result;

  //     // Extract the user IDs from props.data.users
  //     const existingUserIds = new Set(data.users);

  //     // Keep all users for matching labels in the UI
  //     const LabelswithId = usersList.map((data) => ({
  //       label: `${data.name} (${data.emp_id})`,
  //       value: data.id,
  //     }));

  //     // Filter out existing users for dropdown options
  //     const Labels = usersList
  //       .filter((user) => !existingUserIds.has(user.id))
  //       .map((data) => ({
  //         label: `${data.name} (${data.emp_id})`,
  //         value: '',
  //       }));

  //     // Set all users to userId (for rendering) and filtered options for the dropdown
  //     setUserId(LabelswithId);
  //     setOptions(Labels);
  //   } catch (err) {
  //     if (err.response) toast.error(err.response.data.message);
  //     else toast.error('Error in fetching user detail');
  //   } finally {
  //   }
  // };

  const validation = () => {
    let valid = true;
    if (!values || !values.name || values.name.trim() === '') {
      toast.error('Please add project name');
      valid = false;
    } else if (!values.description || values.description.trim() === '') {
      toast.error('Please add project description');
      valid = false;
    }
    return valid;
  };

  const updateProjectDetails = async () => {
    if (selectedUser.length) {
      let userIds = selectedUser.map((d) => d);
      userIds = userIds.filter((id) => id != '');
      values.recipients = userIds;
    }

    const formData = {
      name: values.name,
      description: values.description,
      users: [...data.users, ...values.recipients],
    };
    try {
      const valid = validation();
      if (valid) {
        setLoading(true);
        if (deletedUserIds.length > 0) {
          // Call delete API if there are users to delete
          await deleteUsers(deletedUserIds);
        }
        await httpClient.patch(PROJECT.EDIT_PROJECT_DETAILS.replace('{projectId}', data._id), formData);
        callback();
        setLoading(false);
        toast.success('Project Updated Successfully');
        setValues({ ...values });
        onHide();
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
      setLoading(false);
    }
  };

  const handleChange = (event, index) => {
    const id = userId.find(({ label }) => label === event.label);
    const selectedUserIndex = options.findIndex((x) => x.label === id.label);
    if (selectedUserIndex >= 0) {
      options.splice(selectedUserIndex, 1);
    }
    setSelectedUser((selectedUser) => [...selectedUser, id.value]);
  };

  const handleRemove = (index, id) => {
    const removedUserData = userId.find((x) => x.value === id);
    const removedUser = { label: removedUserData.label, value: '' };
    options.push(removedUser);
    const values = [...selectedUser];
    values.splice(index, 1);
    setSelectedUser(values);
  };

  // const handleDeleteUser = async (userId) => {
  //   // Add the deleted user ID to the array
  //   setDeletedUserIds((prevIds) => [...prevIds, userId]);
  //   props.onUserDelete(userId); // Notify parent to update the users list
  // };

  const handleDeleteUser = async (deletedUserId) => {
    // Add the deleted user ID to the array
    setDeletedUserIds((prevIds) => [...prevIds, deletedUserId]);

    // Find the user in userId list to get their label
    const removedUserData = userId.find((x) => x.value === deletedUserId);

    if (removedUserData) {
      // Add the removed user back to the dropdown options
      setOptions((prevOptions) => [...prevOptions, { label: removedUserData.label, value: removedUserData.value }]);
    }

    // Notify parent to update the users list (if needed)
    if (props.onUserDelete) {
      props.onUserDelete(deletedUserId);
    }
  };


  const deleteUsers = async () => {
    try {
      await httpClient.delete(
        PROJECT.DELETE_PROJECT_RECIPIENTS.replace('{projectId}', data._id),
        {
          data: { deleteUser: deletedUserIds },
        }
      );
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const Styles = {
    container: (provided) => ({
      ...provided,
      minWidth: '46%',
      marginTop: '8px',
    }),
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Body>
          <div className="row justify-content-center  modal-lg">
            <div className="col-12">
              <div className="header_title ">
                <h1>{'Edit Project'}</h1>
              </div>
              <div className="select_role px-4">
                <p>Name of the Project</p>
                <input
                  type="text"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                  required
                  className="form-control"
                  placeholder="Enter Project Name"
                />
              </div>
              <div className="select_role px-4">
                <p>Description</p>
                <textarea
                  type="text"
                  value={values.description}
                  onChange={(e) => setValues({ ...values, description: e.target.value })}
                  required
                  className="form-control"
                  placeholder="Enter Project Description"
                />
              </div>
              <div className="select_role px-4">
                <div className="head-title-wrap">
                  <h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">Add Recipients</h5>
                </div>

                <div className="mt-2">
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                    }}
                  >

                    {/* {userId && userId.length > 0 && data.users?.map((item, index) => (
                      <div
                        key={index}
                        className="boxed"
                        style={{
                          borderRadius: '4px',
                          marginBottom: '10px',
                          marginRight: '10px',
                          padding: '4px 8px',
                          backgroundColor: 'lightgray',
                        }}
                      >
                        {userId.find((opt) => opt.value === item)?.label}
                        {item && (
                          <i
                            className="fa fa-close mx-2"
                            aria-hidden="true"
                            style={{
                              fontSize: '20px',
                              color: 'grey',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => handleDeleteUser(item)}
                          ></i>
                        )}
                      </div>
                    ))} */}

                    {userId && userId.length > 0 && data.users?.map((item, index) => {
                      const matchedUser = userId.find((opt) => opt.value === item);
                      // Only render if we found a matching user and item exists
                      return matchedUser && item ? (
                        <div
                          key={index}
                          className="boxed"
                          style={{
                            borderRadius: '4px',
                            marginBottom: '10px',
                            marginRight: '10px',
                            padding: '4px 8px',
                            backgroundColor: 'lightgray',
                          }}
                        >
                          {matchedUser.label}
                          <i
                            className="fa fa-close mx-2"
                            aria-hidden="true"
                            style={{
                              fontSize: '20px',
                              color: 'grey',
                              cursor: 'pointer',
                            }}
                            onClick={(e) => handleDeleteUser(item)}
                          ></i>
                        </div>
                      ) : null;
                    })}

                    {selectedUser &&
                      userId &&
                      selectedUser?.map((item, index) => (
                        <div
                          key={index}
                          className="boxed"
                          style={{
                            borderRadius: '4px',
                            marginBottom: '10px',
                            marginRight: '10px',
                            padding: '4px 8px',
                            backgroundColor: 'lightgray',
                          }}
                        >
                          {userId.find((opt) => opt.value === item).label}
                          {item ? (
                            <i
                              className="fa fa-close mx-2"
                              aria-hidden="true"
                              style={{
                                fontSize: '20px',
                                color: 'grey',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleRemove(index, item)}
                            ></i>
                          ) : null}
                        </div>
                      ))}
                  </div>
                  {options && (
                    <div>
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
                          placeholder="search user"
                          value={tempUsername}
                          options={options}
                          onChange={(e) => {
                            handleChange(e);
                            setTempUsername(e.target ? e.target.value : '');
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 text-end">
                <button type="button" className="btn btn-outline-secondary text-center px-4 mx-2" onClick={onHide}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary text-center px-4 mx-2" onClick={updateProjectDetails}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditProjectModal;