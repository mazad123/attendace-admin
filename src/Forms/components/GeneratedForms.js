import React, { useState, useEffect } from 'react';
import { httpClient } from '../../constants/Api';
import { FORMS } from '../../constants/AppConstants';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ApprovalModal from '../Modals/ApprovalModal';
import MoveToExEmployeeModal from '../Modals/MoveToExEmployeeModal';
import ReGenerateFormModal from '../Modals/ReGenerateFormModal';
import DeleteFormModal from '../Modals/DeleteFormModal';

function GeneratedForms() {
  const [loading, setLoading] = useState(false);
  const [generatedForms, setGeneratedForms] = useState('');
  const [filter, setFilter] = useState('');
  const [initialValue, setInitialValue] = useState("");
  const [formTemplate, setFormTemplate] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState({ open: false, formId:"", userId: "" });
  const [showRegenerateFormModal, setShowRegenerateFormModal] = useState({ open: false, formId:"", formName:"" });
  const [showDeletFormModal, setShowDeleteFormModal] = useState({ open: false, formId:"" });
  const [showMoveToExEmployeeModal, setShowMoveToExEmployeeModal] = useState({ open: false, userId:"", formId:"", hrResponse:"" });

  useEffect(() => {
    getAllGeneratedForms();
  }, [filter, initialValue]);

  useEffect(() => {
    getForms()
  }, []);


  const alpha = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const getForms = async () => {
    try {
      setLoading(true);
      const forms = await httpClient.get(FORMS.GET_ALL_FORMS);
      if (forms) {
        setFormTemplate(forms.data.response.allForms);
      }
    } catch (err) {
      console.log(err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error');
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
      else toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialValue = (e) => {
    const initValue = e.target.text;
    setInitialValue(initValue);
  };

  const handleOptionValue = (e) => {
    const optionInitValue = e.target.value;
    setFilter(optionInitValue);
    // getAllGeneratedForms();
  };

  const resetSearch = () => {
    setInitialValue("");
    setFilter("");
    // getAllGeneratedForms();
  };


  const handleHrApproval = async (hrApproval, formId) => {
    try {
      setLoading(true);
      const response = await httpClient.patch(FORMS.UPDATE_USER_RELIEVING_FORM_STATUS_THROUGH_HR_BY_FORM_ID.replace('{formId}', formId), hrApproval);
      if(response.status===200){
        toast.success("Request updated successfully");
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

  const handleCloseApprovalModal = () => {
    setShowApprovalModal({ open: false });
  };

  const handleCloseMoveToExEmployeeModal = () => {
    setShowMoveToExEmployeeModal({ open: false });
  };

  const handleCloseRegenerateFormModal = () => {
    setShowRegenerateFormModal({ open: false });
  };

  const handleCloseDeleteFormModal = () => {
    setShowDeleteFormModal({ open: false });
  };

  return (
    <>
      <div className="table-outer w-100 mt-3 generate-form-list-main">
        <div className="container">
          <div className="report_table_main generated_form_wrapper ms-0 ">
            <div className='d-flex justify-content-between mb-3'>
              <h3 className="generated-form-heading">Generated Form List</h3>
              <div className='ms-auto'>
              
              <button className="btn btn-primary text-nowrap me-3 rounded-pill"
                onClick={resetSearch}
              >
              Reset Filter
            </button>
            <Link to="/dashboard/home" className="back_btn">
                <button className="btn btn-secondary">Back</button>
              </Link>
            </div>
            </div>
           
            <div className="filter_letters">
                <ul>
                  <li className=""></li>
                </ul>
            </div>
            <div className="filter_letters">
                <ul>
                  {alpha.map((data, i) => (
                    <li
                      className={initialValue === data ? "active" : ""}
                      key={i}
                    >
                      <Link
                        to="#"
                        data-target={data}
                        onClick={handleInitialValue}
                      >
                        {data}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
            <div className="table-responsive generated_form_table mt-3">
              <table className="mt-0 report_table table table-striped  mb-auto">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th className='text-start'>
                    <div className="d-flex align-items-center">
                     <span className='pe-2'>Form Name</span>
                      <div className="dropdown_icon" style={{width:'150px'}}>
                        <select
                          className="form-control select_allform"
                          aria-label="Default select example"
                          onChange={handleOptionValue}
                          value={filter}
                        >
                          <option value="">All Form</option>
                          {
                            formTemplate && formTemplate.length > 0 && formTemplate.map((item, index)=>(
                              <option key={index} value={item._id}>{item.formName}</option>
                              ))
                          }
                        </select>
                      </div>
                    </div>
                    </th>
                    <th>Employee Name</th>
                    <th>Employee Id</th>
                    <th>Created At</th>
                    <th>Is Submitted</th>
                    <th>Manager Approval</th>
                    <th>HR Approval</th>
                    <th colspan="3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedForms &&
                    generatedForms.length > 0 &&
                    generatedForms.map((form, index) => (
                      // form.userId && form.userId.length > 0 && (
                      <tr key={index}>
                        <td>
                          <span className="number">{index + 1}</span>
                        </td>
                        <td>{form.formName}</td>
                        <td>{form.userId[0].name}</td>
                        <td>{form.userId[0].emp_id}</td>
                        <td>{moment(form.createdAt).format('DD-MM-YYYY')}</td>
                        {form.is_submitted ? (
                          <td>
                            <i className="fa fa-check" style={{ color: 'green' }}></i>
                          </td>
                        ) : (
                          <td style={{ color: 'red' }}>--</td> 
                        )}
                        {
                          form.is_submitted &&  form.formName==="Relieving Form" ? form.managerApproval==="Pending" && !(form.approveRelievingFormManagerId) ? 
                            <td>
                              <Link style={{ color: 'red', textDecoration:"none" }} title='Send approval request to manager' onClick={()=>setShowApprovalModal({open:true, formId:form._id, userId:form.userId[0]._id, getAllGeneratedForms})}><button className='btn btn-outline-primary btn-sm'>Send Request</button></Link>
                            </td>
                            : form.managerApproval==="Pending" && form.approveRelievingFormManagerId ? 
                               <td>Assigned to <span className='manager_name'>{form.managerId[0].name}</span>
                                <button
                                  title="Change Manager"
                                  className="edit_emp_detail table_btn mx-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={()=>setShowApprovalModal({open:true, formId:form._id, userId:form.userId[0]._id, getAllGeneratedForms})}
                                >
                                  <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                </button>
                               </td> 
                               :form.managerApproval==="Rejected" && form.hrApproval==="Pending" && form.approveRelievingFormManagerId ?
                               <td>
                                <i className="fa fa-times me-2" style={{ color: "red"}}></i>
                                <Link style={{ color: 'red', textDecoration:"none" }} title='Send approval request to manager' onClick={()=>setShowApprovalModal({open:true, formId:form._id, userId:form.userId[0]._id, getAllGeneratedForms})}><button className='btn btn-outline-primary btn-sm'>Send Request</button></Link>
                               </td> : form.managerApproval==="Approved" ?                               
                               <td>
                                  <i className="fa fa-check" style={{ color: 'green' }}></i>
                               </td> :      
                               form.managerApproval==="Rejected" && form.hrApproval==="Rejected" ?                                
                               <td>
                                <i className="fa fa-times" style={{ color: "red"}}></i>
                               </td>  :                       
                               <td>
                                  <i className="fa fa-times" style={{ color: "red"}}></i>
                               </td>
                            :<td style={{ color: 'red' }}>--</td>
                        }
                        {
                          (!form.is_submitted) || (form.managerApproval === "Pending") ? 
                          (
                            <td style={{ color: 'red' }}>--</td> 
                          ) :  form.hrApproval==="Pending" ? 
                          ( 
                          <td>
                            <button title="Approve" className='btn btn-success me-2 releiving-approval-btn' 
                            onClick={()=>setShowMoveToExEmployeeModal({ open: true, userId: form.userId[0]._id, formId: form._id, hrResponse: "Approved" })}><i className="fa fa-check" style={{ color: 'white' }}></i></button>
                            <button title="Reject" className='btn btn-danger releiving-approval-btn' onClick={()=>handleHrApproval({hrResponse:"Rejected"}, form._id)}><i className="fa fa-times" style={{ color: "white"}}></i></button>
                          </td>
                          ) : !(form.hrApproval) ?   <td style={{ color: 'red' }}>--</td> :                     (
                            form.hrApproval==="Approved" ? (
                              <td>
                                <i className="fa fa-check" style={{ color: 'green' }}></i>
                              </td>
                            ) : (
                              <td>
                                <i className="fa fa-times" style={{ color: "red" }}></i>
                              </td>
                            )
                          ) 
                        }
                        {form.is_submitted ? (
                          <>
                            <td>
                              <Link to={{ pathname: `/forms/view-form/${form._id}`}}>
                                <button className="btn btn-outline-primary me-0 btn-sm">View</button>
                              </Link>
                            </td>
                          </>
                        ) : ( <td style={{ color: 'red' }}>--</td> )}
                        {
                          form.formName==="Feedback Form" ? form.is_submitted && !form.userId[0].isExEmployee ? (
                            <>
                              <td>
                                <button className="btn btn-outline-primary me-0 btn-sm" onClick={()=>setShowRegenerateFormModal({open:true, formId:form._id, formName:form.formName})}>Edit</button>
                              </td>
                            </>
                          ) : ( <td style={{ color: 'red' }}>--</td> )
                            : form.formName==="Relieving Form" ? form.is_submitted && 
                              form.managerApproval==="Pending" && form.hrApproval==="Pending" ? (
                                <>
                                  <td>
                                    <button className="btn btn-outline-primary me-0 btn-sm" onClick={()=>setShowRegenerateFormModal({open:true, formId:form._id, formName:form.formName})}>Edit</button>
                                  </td>
                                </>
                              )
                            :  ( <td style={{ color: 'red' }}>--</td> )

                            : ( <td style={{ color: 'red' }}>--</td> )
                        }
                        <td>
                          <button className="btn btn-outline-primary me-0 btn-sm" onClick={()=>setShowDeleteFormModal({open:true, formId:form._id})}>Delete</button>
                        </td>
                      </tr>
                      // )
                    ))}
                </tbody>
              </table>
              {!loading && generatedForms && generatedForms.length <= 0 && (
                  <div className="d-flex justify-content-center">
                    <h5>No Records to Display.</h5>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDeletFormModal.open && <DeleteFormModal show={showDeletFormModal.open} deleteFormModalProps={showDeletFormModal} getAllGeneratedForms = {getAllGeneratedForms} onHide={handleCloseDeleteFormModal} />}
      {showRegenerateFormModal.open && <ReGenerateFormModal show={showRegenerateFormModal.open} showRegenerateFormModalProps={showRegenerateFormModal} getAllGeneratedForms = {getAllGeneratedForms} onHide={handleCloseRegenerateFormModal}/>}
      {showApprovalModal.open && <ApprovalModal show={showApprovalModal.open} showApprovalModalProps={showApprovalModal} onHide={handleCloseApprovalModal} />}
      {showMoveToExEmployeeModal.open && <MoveToExEmployeeModal show={showMoveToExEmployeeModal.open} onHide={handleCloseMoveToExEmployeeModal} 
      userId={showMoveToExEmployeeModal.userId} formId={showMoveToExEmployeeModal.formId} hrResponse={showMoveToExEmployeeModal.hrResponse} getAllGeneratedForms={getAllGeneratedForms} />}
    </>
  );
}

export default GeneratedForms;