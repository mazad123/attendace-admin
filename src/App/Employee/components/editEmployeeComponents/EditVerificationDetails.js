import React, { useState, useEffect } from 'react';
import { USER } from '../../../../constants/AppConstants';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { httpClient } from '../../../../constants/Api';
import moment from 'moment';
import { FileUploader } from 'react-drag-drop-files';
import Loader from '../../../../App/Layouts/Loader';

function EditVerificationDetails({dateOfJoining}) {
  const { userId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [eligibleForRehire, setEligibleForRehire] = useState('');
  let [verificationValues, setVerificationValues] = useState({
    prev_company_emp_id: '',
    prev_company_name: '',
    prev_company_doj: '',
    prev_company_dor: '',
    prev_company_designation: '',
    prev_company_employment_status: '',
    elligible_for_rehire: '',
    additional_comments: '',
  });

  const [formErrors, setFormErrors] = useState({
    prev_company_emp_id: '',
    prev_company_name: '',
    prev_company_designation: '',
    additional_comments: '',
    prev_company_doj:'',
    prev_company_dor:''
  });

  useEffect(() => {
      getVerificationDetails();
  }, [dateOfJoining]);

  useEffect(() => {
    if (formSubmitted) {
      const firstErrorField = document.querySelector('.form-control.is-invalid');

      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth' });
        firstErrorField.focus();
        setFormSubmitted(false);
      }
    }
  }, [formSubmitted]);

  const fileTypes = ['JPG', 'PNG', 'JPEG', 'PDF'];

  const previous_employment_status = [
    { label: 'Active', value: 'Active' },
    { label: 'Resigned And Left', value: 'Resigned And Left' },
    { label: 'Absconding', value: 'Absconding' },
    { label: 'Terminated', value: 'Terminated' },
    { label: 'Serving Notice Period', value: 'Serving Notice Period' },
  ];

  const getVerificationDetails = async () => {
    await httpClient
      .get(USER.GET_VERIFICATION_DETAILS_BY_USER_ID.replace('{id}', userId))
      .then((res) => {

        if (res.status === 200 && res.data.verificationDetails !== null) {
          res.data.verificationDetails.prev_company_doj = res.data.verificationDetails.prev_company_doj ? moment(res.data.verificationDetails.prev_company_doj).format('YYYY-MM-DD') : 'MM/DD/YYYY';
          res.data.verificationDetails.prev_company_dor = res.data.verificationDetails.prev_company_dor ? moment(res.data.verificationDetails.prev_company_dor).format('YYYY-MM-DD') : 'MM/DD/YYYY';
          setVerificationValues(res.data.verificationDetails);
        }
      })
      .catch((err) => {

        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      });
  };

  const handleChange = (file) => {
    setVerificationValues({ ...verificationValues, file_name: file.name, document_image: file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'elligible_for_rehire' && value === 'yes') {
      // Clear additional_comments when switching from 'No' to 'Yes'
      setVerificationValues({
        ...verificationValues,
        [name]: value,
        additional_comments: '',
      });
      // Clear any validation errors related to additional_comments
      setFormErrors({
        ...formErrors,
        additional_comments: '',
      });
    } else {
      setVerificationValues({
        ...verificationValues,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const errors = {
      prev_company_emp_id: '',
      prev_company_name: '',
      prev_company_designation: '',
      additional_comments: '',
      prev_company_doj: '',
      prev_company_dor:''
    };

    if (verificationValues.prev_company_emp_id.length === 1 && !verificationValues.prev_company_emp_id.match(/^[a-zA-Z]*$/)){
      errors.prev_company_emp_id = 'On first place Employee ID do not allow spaces';
    }
    if (verificationValues.prev_company_name.trim() !== '' && !/^[A-Za-z\s]+$/.test(verificationValues.prev_company_name)) {
      errors.prev_company_name = 'Name must contain only letters and spaces';
    } else if (verificationValues.prev_company_name.length === 1 && !verificationValues.prev_company_name.match(/^[a-zA-Z]*$/)) {
      errors.prev_company_name = 'On first place Name only allowed letter';
    }
    if (verificationValues.prev_company_designation.trim() !== '' && !/^[A-Za-z\s]+$/.test(verificationValues.prev_company_designation)) {
      errors.prev_company_designation = 'Designation must contain only letters and spaces';
    } else if (verificationValues.prev_company_designation.length === 1 && !verificationValues.prev_company_designation.match(/^[a-zA-Z]*$/)) {
      errors.prev_company_designation = 'On first place designation only allowed letter';
    }
    if (verificationValues.elligible_for_rehire === 'no' && verificationValues.additional_comments.trim() === ''){
      errors.additional_comments = 'Comment is required';
    } else if (verificationValues.elligible_for_rehire === 'no' && verificationValues.additional_comments.length === 1 && !verificationValues.additional_comments.match(/^[a-zA-Z]*$/)){
      errors.additional_comments = 'On first place comment only allowed letter';
    }
    if(moment(verificationValues.prev_company_doj) > moment()){
      errors.prev_company_doj = 'Date of joining cannot be in the future';
    }else if(verificationValues.prev_company_doj !=='' && moment(verificationValues.prev_company_doj).isSameOrAfter(dateOfJoining)){
      errors.prev_company_doj = 'Date of joining cannot be greater than or equal to current DOJ';
    }else if (verificationValues.prev_company_dor !== '' && moment(verificationValues.prev_company_doj).isSameOrAfter(moment(verificationValues.prev_company_dor))) {
      errors.prev_company_doj = 'Date of joining cannot be greater than or equal to DOR';
    }
    if(moment(verificationValues.prev_company_dor) > moment()){
      errors.prev_company_dor = 'Date of relieving cannot be in the future';
    }else if(verificationValues.prev_company_dor !=='' && moment(verificationValues.prev_company_dor).isSameOrAfter(dateOfJoining)){
      errors.prev_company_dor = 'Date of relieving cannot be greater than or equal to current DOJ';
    }else if (verificationValues.prev_company_doj !== '' && moment(verificationValues.prev_company_dor).isSameOrBefore(moment(verificationValues.prev_company_doj))) {
      errors.prev_company_dor= 'Date of relieving cannot be less than or equal to DOJ'
    }

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const handleEditVerification = async (e) => {
    e.preventDefault();
    const allValuesEmpty = Object.values(verificationValues).every((value) => !value);
    if (allValuesEmpty) {
      toast.error('All empty values cannot be submitted');
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      if(verificationValues.elligible_for_rehire === 'yes') verificationValues.additional_comments = '';
      if (userId) {
        verificationValues.userId = userId;
      }
      const formData = new FormData();
      for (let key of Object.keys(verificationValues)) {
        formData.append([key], verificationValues[key]);
      }
      try {
        setLoading(true);
        await httpClient
          .put(USER.UPDATE_USER_VERIFICATION.replace('{id}', userId), formData)
          .then((res) => {
            if (res.status === 200) {
              toast.success('Verification details updated successfully');
              setLoading(false);
            }
          })
          .catch((err) => {
            if (err.response) {
              toast.error(err.response.data.message);
            } else {
              toast.error('Something went wrong');
            }
          });
      } catch (err) {
        console.log(err);
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      }finally{
        setLoading(false);
      }
    } else {
      setFormSubmitted(true);
      setLoading(false);
      return;
    }
  };

  const handlePreviewClick = (docID) => {
		window.open("/preview/doc/" + docID, "_blank"); //open preview in new Tab
	};


  return (
    <div className="mt-1">
      {isLoading&&<Loader/>}
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Employee ID
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="prev_company_emp_id"
            value={verificationValues.prev_company_emp_id}
            onChange={(e) => {
              const inputText = e.target.value;
              if (inputText.length === 1 && !inputText.match(/^[a-zA-Z]*$/)) {
                setFormErrors({ ...formErrors, prev_company_emp_id: 'On first place Employee ID do not allow spaces' });
                return;
              }
              setVerificationValues({
                ...verificationValues,
                prev_company_emp_id: inputText,
              });
              setFormErrors({ ...formErrors, prev_company_emp_id: '' });
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, prev_company_emp_id: '' });
            }}
            className={`form-control ${formErrors.prev_company_emp_id ? 'is-invalid' : ''}`}
            placeholder="Enter Previous Company Employee ID"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.prev_company_emp_id}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Company Name
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="prev_company_name"
            value={verificationValues.prev_company_name}
            onChange={(e) => {
              const inputText = e.target.value;
              if (inputText.length === 1 && !inputText.match(/^[a-zA-Z]*$/)) {
                setFormErrors({ ...formErrors, prev_company_name: 'On first place company name do not allow spaces' });
                return;
              }
              setVerificationValues({
                ...verificationValues,
                prev_company_name: inputText,
              });
              setFormErrors({ ...formErrors, prev_company_name: '' });
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, prev_company_name: '' });
            }}
            className={`form-control ${formErrors.prev_company_name ? 'is-invalid' : ''}`}
            placeholder="Enter Previous Company Name"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.prev_company_name}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Date Of Joinning(DOJ)
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="date"
            name="prev_company_doj"
            value={verificationValues.prev_company_doj}
            max={moment().format('YYYY-MM-DD')}
            placeholder="Enter Previous Company DOJ(dd/mm/yy)"
            onChange={(e) => {
              const selectedDate = moment(e.target.value);
              const currentDate = moment();
              if (selectedDate > currentDate) {
                setFormErrors({
                  ...formErrors,
                  prev_company_doj: 'Date of joining cannot be in the future'
                });
              }else if(e.target.value !=='' && moment(e.target.value).isSameOrAfter(dateOfJoining)){
                setFormErrors({
                  ...formErrors,
                  prev_company_doj: 'Date of joining cannot be greater than or equal to current DOJ',
                });
              }else if (verificationValues.prev_company_dor !== '' && moment(e.target.value).isSameOrAfter(moment(verificationValues.prev_company_dor))) {
                setFormErrors({
                  ...formErrors,
                  prev_company_doj: 'Date of joining cannot be greater than or equal to DOR',
                });
              } else {
                setFormErrors({ ...formErrors, prev_company_doj: '' });
              }
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, prev_company_dor: '' });
              const selectedDate = moment(e.target.value);
              const currentDate = moment();
              if (selectedDate > currentDate) {
                setFormErrors({
                  ...formErrors,
                  prev_company_doj: 'Date of joining cannot be in the future'
                });
              }else if(e.target.value !=='' && moment(e.target.value).isSameOrAfter(dateOfJoining)){
                setFormErrors({
                  ...formErrors,
                  prev_company_doj: 'Date of joining cannot be greater than or equal to current DOJ',
                });
              }else if (verificationValues.prev_company_dor !== '' && moment(e.target.value).isSameOrAfter(moment(verificationValues.prev_company_dor))) {
                setFormErrors({
                  ...formErrors,
                  prev_company_doj: 'Date of joining cannot be greater than or equal to DOR',
                });
              }else if (verificationValues.prev_company_dor !== '' && moment(e.target.value).isBefore(moment(verificationValues.prev_company_dor))) {
                setFormErrors({
                  ...formErrors,
                  // prev_company_dor: '',
                  prev_company_doj: '',
                });
              }
            }}
            className={`form-control ${formErrors.prev_company_doj ? 'is-invalid' : ''}`}
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.prev_company_doj}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Last Working Date(DOR)
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="date"
            name="prev_company_dor"
            className={`form-control ${formErrors.prev_company_dor ? 'is-invalid' : ''}`}
            max={moment().format('YYYY-MM-DD')}
            value={verificationValues.prev_company_dor}
            onChange={(e) => {
              const selectedDate = moment(e.target.value);
              const currentDate = moment();
              if (selectedDate > currentDate) {
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: 'Date of relieving cannot be in the future'
                });
              }else if(e.target.value !=='' && moment(e.target.value).isSameOrAfter(dateOfJoining)){
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: 'Date of relieving cannot be greater than or equal to current DOJ',
                });
              }else if (verificationValues.prev_company_doj !== '' && moment(e.target.value).isSameOrBefore(moment(verificationValues.prev_company_doj))) {
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: 'Date of relieving cannot be less than or equal to DOJ',
                });
              } else {
                setFormErrors({ ...formErrors, prev_company_dor: '' });
              }
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, prev_company_dor: '' });
              const selectedDate = moment(e.target.value);
              const currentDate = moment();
              if (selectedDate > currentDate) {
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: 'Date of relieving cannot be in the future'
                });
              }else if(e.target.value !=='' && moment(e.target.value).isSameOrAfter(dateOfJoining)){
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: 'Date of relieving cannot be greater than or equal to current DOJ',
                });
              }else if (verificationValues.prev_company_doj !== '' && moment(e.target.value).isSameOrBefore(moment(verificationValues.prev_company_doj))) {
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: 'Date of relieving cannot be less than or equal to DOJ',
                });
              }else if (verificationValues.prev_company_doj !== '' && moment(e.target.value).isAfter(moment(verificationValues.prev_company_doj))) {
                setFormErrors({
                  ...formErrors,
                  prev_company_dor: '',
                  // prev_company_doj: '',
                });
              }
            }}
            placeholder="Enter Previous Company DOR(dd/mm/yyyy)"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.prev_company_dor}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Last Designation
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="prev_company_designation"
            value={verificationValues.prev_company_designation}
            onChange={(e) => {
              const inputText = e.target.value;
              if (inputText.length === 1 && !inputText.match(/^[a-zA-Z]*$/)) {
                setFormErrors({ ...formErrors, prev_company_designation: 'On first place designation do not allow spaces' });
                return;
              }
              setVerificationValues({
                ...verificationValues,
                prev_company_designation: inputText,
              });
              setFormErrors({ ...formErrors, prev_company_designation: '' });
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, prev_company_designation: '' });
            }}
            className={`form-control ${formErrors.prev_company_designation ? 'is-invalid' : ''}`}
            placeholder="Enter Previous Company Designation"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.prev_company_designation}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Employment Status
          </label>
        </div>
        <div className="col-md-8">
          <select
            aria-label="Default select example"
            name="prev_company_employment_status"
            value={verificationValues.prev_company_employment_status}
            onChange={(e) => {
              handleInputChange(e);
            }}
            className={`form-control ${formErrors.prev_company_employment_status ? 'is-invalid' : ''}`}
          >
            <option value="">Select Previous Company Employment Status</option>
            {previous_employment_status.length > 0 &&
              previous_employment_status.map((employmentStaus, index) => (
                <option value={employmentStaus.value} key={index}>
                  {employmentStaus.label}
                </option>
              ))}
          </select>
          <small style={{ color: 'red' }} role="alert">
            {formErrors.prev_company_employment_status}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Eligible For Rehire
          </label>
        </div>
        <div className="col-md-8">
          <label className="form-label me-3">
            <input
              className="me-1"
              type="radio"
              value="yes"
              name="elligible_for_rehire"
              checked={verificationValues.elligible_for_rehire === 'yes'}
              onChange={(e) => {
                setEligibleForRehire(e.target.value);
                handleInputChange(e);
              }}
            />
            Yes
          </label>
          <label className="form-label">
            <input
              className="me-1"
              type="radio"
              value="no"
              name="elligible_for_rehire"
              checked={verificationValues.elligible_for_rehire === 'no'}
              onChange={(e) => {
                setEligibleForRehire(e.target.value);
                handleInputChange(e);
              }}
            />
            No
          </label>
          {verificationValues.elligible_for_rehire === 'no' && (
            <div className="col-md-12">
              <textarea
                type="textArea"
                className={`form-control ${formErrors.additional_comments ? 'is-invalid' : ''}`}
                placeholder="Reason for not being eligible for rehire"
                name="additional_comments"
                value={verificationValues.additional_comments}
                onChange={(e) => {
                  const inputText = e.target.value;
                  if (verificationValues.elligible_for_rehire ==='no' && e.target.value.trim() === ''){
                    setFormErrors({ ...formErrors, additional_comments : 'Comment is required'});
                  }
                  if (inputText.length === 1 && !inputText.match(/^[a-zA-Z]*$/)) {
                    setFormErrors({ ...formErrors, additional_comments: 'On first place additional comment do not allow spaces' });
                    return;
                  }
                  setVerificationValues({
                    ...verificationValues,
                    additional_comments: inputText,
                  });
                  setFormErrors({ ...formErrors, additional_comments: '' });
                }}
                onBlur={(e) => {
                  if ((verificationValues.elligible_for_rehire==='no') && (e.target.value.trim() === '' || e.target.value === undefined)) setFormErrors({ ...formErrors, additional_comments: 'Comment is required' });
                }}
              ></textarea>
              <small style={{ color: 'red' }} role="alert">
                {formErrors.additional_comments}
              </small>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Upload Documents
          </label>
        </div>
        <div className="col-md-8">
          <FileUploader
            classes="drop_area employee_document_verification"
            label="Upload File here"
            name="document_image"
            handleChange={handleChange}
            types={fileTypes}
            style={{ width: '100%' }}
          />
          { verificationValues.file_name ? 
          <div className="mt-3 d-flex align-items-start">
            <p style={{wordBreak: 'break-all', fontSize: '15px'}}>File Name: <b>{verificationValues.file_name}</b></p>
          </div>
          : ""
          }
        </div>
      </div>
      <hr />
      <div className="col-lg-12  text-end pb-2 pe-0">
        <button type="submit" className="btn btn-leave_status e-submit-detail" onClick={handleEditVerification}>
          Submit Details
        </button>
      </div>
    </div>
  );
}

export default EditVerificationDetails;
