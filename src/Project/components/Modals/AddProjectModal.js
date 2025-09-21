import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { httpClient } from '../../../constants/Api';
import { PROJECT, ORGANISATION } from '../../../constants/AppConstants';
import { Modal } from 'react-bootstrap';

function AddProjectModal(props) {
  const { show, onHide, callback } = props;

  const [values, setValues] = useState('');
  const [options, setOptions] = useState([]);
  const [tempUsername, setTempUsername] = useState();
  const [inputFields, setInputFields] = useState([]);
  const [userId, setUserId] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
      const usersList = users.data.result;
      const Labels = usersList.map((data) => {
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

  // const handleSelectedOption = (selectedOption, selector) => {
  //     setValues({
  //         ...values,
  //         [selector]: selectedOption,
  //     });
  // };

  const validation = () => {
    console.log({ values });
    let valid = true;
    if (!values || !values.name || values.name.trim() === '') {
      toast.error('Please add project name');
      valid = false;
    } else if (!values.description || values.description.trim() === '') {
      toast.error('Please add project description');
      valid = false;
    }
    // else if (!values.type || values.type.value.trim() === "") {
    //     toast.error("Please select type");
    //     valid = false;
    // }
    return valid;
  };

  const addProject = async () => {
    if (selectedUser.length) {
      let userIds = selectedUser.map((d) => d);
      userIds = userIds.filter((id) => id != '');
      values.recipients = userIds;
    }
    const typeValue = values.type?.value;
    const formData = {
      name: values.name,
      description: values.description,
      users: values.recipients,
      // type: typeValue
    };
    try {
      const valid = validation();
      if (valid) {
        setLoading(true);
        await httpClient.post(PROJECT.ADD_PROJECT, formData);
        toast.success('Project Added Successfully');
        // window.location.reload();
        setValues({ ...values });
        onHide();
        callback();
      }
    } catch (err) {
      console.log({ err });
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // const type_options = [
  //     { value: 'Public', label: 'Public' },
  //     { value: 'Private', label: 'Private' },
  // ]

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

  const Styles = {
    container: (provided) => ({
      ...provided,
      minWidth: '45%',
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
                <h1>{'Add Project'}</h1>
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
              {/* <div className="select_role px-4">
                                <p>Select Type</p>
                                <Select
                                    onChange={(e) => handleSelectedOption(e, "type")}
                                    value={values.type}
                                    options={type_options}
                                />
                            </div> */}
              <div className="select_role px-4">
                {/* <p>Select Users</p>
                                <Select
                                    isMulti
                                    onChange={(e) => handleSelectedOption(e, "user")}
                                    value={values.user}
                                    options={options}
                                /> */}
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
                    {inputFields.length > 0 &&
                      userId &&
                      inputFields.map((item, index) => (
                        <div
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
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-2">
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                    }}
                  >
                    {selectedUser &&
                      userId &&
                      selectedUser?.map((item, index) => (
                        <div
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
                <button type="button" className="btn btn-primary text-center px-4 mx-2" onClick={addProject}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddProjectModal;
