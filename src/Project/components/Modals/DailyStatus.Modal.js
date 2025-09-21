import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { httpClient } from '../../../constants/Api';
import { PROJECT, ORGANISATION } from '../../../constants/AppConstants';
import { Modal } from 'react-bootstrap';
import 'react-autocomplete-input/dist/bundle.css';
import Select from 'react-select';
import CkEditor from '../../../App/common/CkEditor';
import { useHistory } from 'react-router-dom';

function DailyStatusModal(props) {
  const { show, onHide, type } = props;

  const [values, setValues] = useState({ subject: '', message: '' });
  const [tempUsername, setTempUsername] = useState();
  const [tempUsername2, setTempUsername2] = useState();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState();
  const [options1, setOptions1] = useState();
  const [inputFields, setInputFields] = useState([]);
  const [userId, setUserId] = useState();
  const [userId1, setUserId1] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUser2, setSelectedUser2] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [previousSelectedUser, setPreviousSelectedUser] = useState('');
  const history = useHistory();

  useEffect(() => {
    getUsers();
    getCountires();
  }, []);

  const validation = () => {
    let valid = true;
    if (!values.subject.trim()) {
      toast.error('Please type Subject');
      valid = false;
    } else if (!values.message.trim()) {
      toast.error('Please type Message');
      valid = false;
    }
    return valid;
  };

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
      setUserId1(LabelswithId);
      setOptions(Labels);
      setOptions1(Labels);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
    }
  };

  const getCountires = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const text = await response.text();

      // Parse the JSON data
      const countriesData = JSON.parse(text);

      // Extract the name of each country
      const countryNames = countriesData.map(country => country.name.common);
      setCountries(countryNames);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const submitData = async (e) => {
    values.type = type;
    if (selectedUser.length) {
      let userIds = selectedUser.map((d) => d);
      userIds = userIds.filter((id) => id != '');

      let userIds2 = [];
      if (selectedUser2.length) {
        userIds2 = selectedUser2.map((d) => d);
        userIds2 = userIds2.filter((id) => id != '');
      }

      // Add createdBy to recipients if createdBy exists
      if (values.createdBy) {
        userIds.push(values.createdBy); // Add createdBy to userIds array
      }

      // Prepare values for submission
      values.recipients = [...userIds];
      values.channel = selectedChannel;
      values.clientLocation = selectedCountry;
    } else {
      // If no selectedUser, set default values
      values.channel = selectedChannel;
      values.clientLocation = selectedCountry;
    }
    try {
      const valid = validation();
      if (valid) {
        await httpClient.post(PROJECT.ADD_DAILY_STATUS, values).then(async (res) => {
          if (res.status === 200) {
            toast.success('Message posted successfully');
            // history.push(`/project/project-list`);
            props.getDailyStatus(1, true);
            setSelectedUser([]);
            setSelectedUser2();
            onHide();
          }
        });
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
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

  const handleChange2 = (event, index) => {
    setPreviousSelectedUser(event);
    const id = userId.find(({ label }) => label === event.label);
    console.log(id);
    const existingIndex = options1.findIndex((x) => x.label === id.label);
    console.log(existingIndex);
    if (existingIndex >= 0) {
      // If the user already exists, remove it
      options1.splice(existingIndex, 1);
    }
    setSelectedUser2([id.value]);
    setValues({...values, createdBy: id.value});
    if (previousSelectedUser) {
      options1.push(previousSelectedUser);
    }
    // Add the new user ID to the selectedUser2 array
    //  setSelectedUser2((selectedUser2) => [...selectedUser2, id.value]);
  };

  const handleChannelChange = (event) => {
    setSelectedChannel(event.target.value);
    // You can perform additional logic here based on the selected value if needed
  };

  const handleRemove = (index, id) => {
    const removedUserData = userId.find((x) => x.value === id);
    const removedUser = { label: removedUserData.label, value: '' };
    options.push(removedUser);
    const values = [...selectedUser];
    values.splice(index, 1);
    setSelectedUser(values);
  };

  const handleRemove2 = (index, id) => {
    const removedUserData = userId.find((x) => x.value === id);
    const removedUser = { label: removedUserData.label, value: '' };
    options.push(removedUser);
    const values = [...selectedUser2];
    values.splice(index, 1);
    setSelectedUser2(values);
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
          <div className="row justify-content-center modal-lg">
            <div className="col-12">
              <div className="header_title pb-2 pt-2">
                <input
                  className="form-control text_box_outline border-0"
                  type="text"
                  placeholder="Type the subject of this message..."
                  value={values.subject}
                  onChange={(e) => setValues({ ...values, subject: e.target.value })}
                  required
                ></input>
              </div>
              <div className="ck-body-wrapper">
                <CkEditor values={values}
                  setValues={setValues}
                  inputFields={[]}
                  inputFields1={[]}
                  userId={[]}
                />
              </div>
              {type === 'sales_status' && (
                <div className="mb-3">
                  <div className="head-title-wrap">
                    <h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2"> Add Recipients</h5>
                  </div>
                  <div className="mt-0">
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selectedUser && userId &&
                        selectedUser.map((item, index) => (
                          <div
                            className="boxed"
                            key={index}
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
              )}

              {type === 'sales_status' && (
                <div className='mb-3'>
                  <div className="head-title-wrap">
                    <h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2"> Created By</h5>
                  </div>

                  <div className="">
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selectedUser2 && userId1 &&
                        selectedUser2.map((item, index) => (
                          <div
                            className="boxed"
                            key={index}
                            style={{
                              borderRadius: '4px',
                              marginBottom: '10px',
                              marginRight: '10px',
                              padding: '4px 8px',
                              backgroundColor: 'lightgray',
                            }}
                          >
                            {userId1.find((opt) => opt.value === item).label}
                            {item ? (
                              <i
                                className="fa fa-close mx-2"
                                aria-hidden="true"
                                style={{
                                  fontSize: '20px',
                                  color: 'grey',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleRemove2(index, item)}
                              ></i>
                            ) : null}
                          </div>
                        ))}
                    </div>
                    {options1 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Select
                            isSearchable={true}
                            closeMenuOnSelect={true}
                            styles={Styles}
                            menuPosition={'fixed'}
                            placeholder="search user"
                            value={tempUsername2}
                            options={options1}
                            onChange={(e) => {
                              handleChange2(e);
                              setTempUsername2(e.target ? e.target.value : '');
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {type === 'sales_status' && (
                <div className="head-title-wrap mb-3">
                  <h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">Channel</h5>
                  <select className="div-form-select mt-2" value={selectedChannel} onChange={handleChannelChange}>
                    <option value="">Select Channel</option>
                    <option value="Upwork">Upwork</option>
                    <option value="Guru">Guru</option>
                    <option value="Directlead">Direct Lead</option>
                  </select>
                </div>
              )}
              {type === 'sales_status' && (
                <div className="head-title-wrap mb-3">
                  <h5 className="head-title-info col-black fw-light m-0 pe-4 mt-2">Client Location</h5>
                  <Select
                    className="div-form-select mt-2"
                    options={countries.map(country => ({ label: country, value: country }))}
                    onChange={(selectedOption) => handleCountryChange(selectedOption.value)}
                    value={selectedCountry ? { label: selectedCountry, value: selectedCountry } : null}
                    placeholder="Select Country"
                    isSearchable
                  />
                </div>
              )}
              <div className="mt-5 text-end">
                <button type="button" className="btn btn-outline-secondary text-center px-4 mx-2" onClick={onHide}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary text-center px-4 mx-2" onClick={submitData}>
                  Post this message
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DailyStatusModal;
