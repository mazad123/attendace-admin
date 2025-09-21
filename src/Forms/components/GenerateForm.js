import React, { useState, useEffect } from 'react';
import { httpClient } from '../../constants/Api';
import { FORMS, ORGANISATION } from '../../constants/AppConstants';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Link, useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

const GenerateForm = () => {
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [tempUsername, setTempUsername] = useState();
  const [userId, setUserId] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [formTemplate, setFormTemplate] = useState();
  const [formName, setFormName] = useState('');
  const [generatedForms, setGeneratedForms] = useState([]);
  const [filter, setFilter] = useState('');
  const [initialValue, setInitialValue] = useState("");
  let history = useHistory();
  const { formId } = useParams();

  useEffect(()=>{
    getAllGeneratedForms();
    if (generatedForms.length > 0) {
      getUsers();
    }
    getForms();
  },[])

  useEffect(() => {
    getForms();
    getAllGeneratedForms();
  }, [formId]);
  
  useEffect(() => {
    if (generatedForms.length > 0) {
      getUsers();
    }
    getForms();
  }, [generatedForms]);
  

  const handleUsers = (event, index) => {
    const id = userId.find(({ label }) => label === event.label);
    const selectedUserIndex = options.findIndex((x) => x.label === id.label);
    if (selectedUserIndex >= 0) {
      options.splice(selectedUserIndex, 1);
    }
    setSelectedUser((selectedUser) => [...selectedUser, { user_id: id.value, name:id.name, empId: id.empId, designation: id.designation, dateOfJoinning: id.dateOfJoinning }]);
  };

  const handleRemove = (index, id) => {
    const removedUserData = userId.find((x) => x.value === id.user_id);
    const removedUser = { label: removedUserData.label, value: '' };
    options.push(removedUser);
    const values = [...selectedUser];
    values.splice(index, 1);
    setSelectedUser(values);
  };
  const getUsers = async () => {
    try {
      const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
      const allUsersList = users.data.result;
      const usersList = allUsersList.filter(data => {
        return !generatedForms.some(form => { 
          if((form.formName === formName && form.userId[0]._id === data.id) ){
            return true;
          }
          else if (
            (form.formName === formName && form.userId[0]._id === data.id && form.managerApproval !== "Rejected" && form.hrApproval !== "Rejected")
          ) {
            return true; // Remove the entry from userList
          } else {
            return false; // Preserve Entry in usersList
          }
        });
      });
      const Labels = usersList.map((data) => {
        return { label: `${data.name} (${data.emp_id})`, value: '', empId: data.emp_id, name:data };
      });
      const LabelswithId = usersList.map((data) => {
        return { label: `${data.name} (${data.emp_id})`, value: data.id,  empId: data.emp_id, name:data.name, designation: data.designation, dateOfJoinning: moment(data.doj).format("MM-DD-YYYY") };
      });
      setUserId(LabelswithId);
      setOptions(Labels);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
    }
  };

  const Styles = {
    container: (provided) => ({
      ...provided,
      width: '77%',
      marginTop: '8px',
    }),
  };

  const getForms = async () => {
    try {
      setLoading(true);
      const forms = await httpClient.get(FORMS.GET_FORM_BY_ID.replace('{formId}', formId));
      if (forms) {
        setFormTemplate(forms.data.response.allForms);
        setFormName(forms.data.response.allForms[0].formName);
      }
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getAllGeneratedForms = async () => {
    try {
      setLoading(true);
      const resp = await httpClient.get(`${FORMS.GET_ALL_GENERATED_FORMS}?filter=${filter}&alphaTerm=${initialValue}`);
      setGeneratedForms(resp.data.response.allGeneratedForms);
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplateByUserId = async () => {
    try {
      setLoading(true);
      let templateData = {};
      // templateData.userId = selectedUser[0].user_id;
      templateData.users = selectedUser
      templateData.template = formTemplate;
      await httpClient.post(FORMS.CREATE_TEMPLATE_BY_USER_ID, templateData);
      toast.success('Form assigned to user successfully');
      history.push('/forms/generated-forms');
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="generate_form">
        <h4>{formName}</h4>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="head-title-wrap">
                <h6 className="head-title-info col-black fw-light m-0 pe-4 mt-2">Users</h6>
              </div>

              <div className="mt-2">
                <div className="row me-0" style={{ paddingLeft: '13px' }}>
                  {selectedUser.length > 0 && (
                    <div
                      id="style-3"
                      className="scroll-css users-box"
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        border: '1px solid rgb(128 134 139)',
                        borderRadius: '0.375rem',
                        paddingTop: '8px',
                        overflowY: 'scroll',
                        maxHeight: '135px',
                      }}
                    >
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
                            {userId.find((opt) => opt.value === item.user_id).label}
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
                  )}
                </div>
                {options && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* {selectedUser.length < 1 && ( */}
                      <Select
                        isSearchable={true}
                        closeMenuOnSelect={true}
                        styles={Styles}
                        menuPosition={'fixed'}
                        placeholder="Search User"
                        value={tempUsername}
                        options={options}
                        onChange={(e) => {
                          handleUsers(e);
                          setTempUsername(e.target ? e.target.value : '');
                        }}
                      />
                    {/* )} */}
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-end mt-4">
                <Link to="/dashboard/home" className="back_btn">
                  <button className="btn btn-secondary me-2">Back</button>
                </Link>
                <button className="btn btn-primary me-0" onClick={saveTemplateByUserId}>
                  Generate Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateForm;
