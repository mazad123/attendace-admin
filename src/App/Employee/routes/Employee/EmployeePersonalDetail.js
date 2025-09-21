import React, { useState, useEffect } from 'react';
import { USER } from '../../../../constants/AppConstants';
import { toast } from 'react-toastify';
import { httpClient } from '../../../../constants/Api';
import Loader from '../../../../App/Layouts/Loader';

function EmployeePersonalDetail({ userId }) {
  const [isLoading, setLoading] = useState(false);
  const [addressCheck, setAddressCheck] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editToastMessage, setEditToastMessage] = useState(false);
  const [employeePersonalValues, setEmployeePersonalValues] = useState({
    guardian_name: '',
    guardian_phone: '',
    blood_group: '',
    marital_status: '',
    correspondence_address: '',
    permanent_address: '',
  });

  const [formErrors, setFormErrors] = useState({
    guardian_name: '',
    guardian_phone: '',
  });

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

  const marital_status = [
    { label: 'Single', value: 'single' },
    { label: 'Married', value: 'married' },
  ];

  const handleCheckboxChange = (e) => {
    setAddressCheck(!addressCheck);
    if (e.target.checked) {
      setEmployeePersonalValues({ ...employeePersonalValues, correspondence_address: employeePersonalValues.permanent_address });
    } else {
      setEmployeePersonalValues({ ...employeePersonalValues, correspondence_address: '' });
    }
  };

  const validateForm = () => {
    const errors = {
      guardian_name: '',
      guardian_phone: '',
    };

    if (employeePersonalValues.guardian_name.trim() !== '' && !/^[A-Za-z\s]+$/.test(employeePersonalValues.guardian_name)) {
      errors.guardian_name = 'Name must contain only letters and spaces';
    } else if (employeePersonalValues.guardian_name.length === 1 && !employeePersonalValues.guardian_name.match(/^[a-zA-Z]*$/)) {
      errors.guardian_name = 'On first place Name only allowed letter';
    }
    if (employeePersonalValues.guardian_phone !== '' && !/^\d+$/.test(employeePersonalValues.guardian_phone)) {
      errors.guardian_phone = 'Phone number must contain only numeric digits';
    }else if(employeePersonalValues.guardian_phone.trim() !== '' && employeePersonalValues.guardian_phone.startsWith('0')){
      errors.guardian_phone = 'On first place phone number only allowed non-zero digits';
    }else if (employeePersonalValues.guardian_phone.trim() !== '' && employeePersonalValues.guardian_phone.length !== 10) {
      errors.guardian_phone = 'Phone number must be exactly 10 digits long';
    }

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const handlePersonalDetails = async (e) => {
    e.preventDefault();
    // Checking if all values in employeePersonalValues are empty
    const allValuesEmpty = Object.values(employeePersonalValues).every((value) => !value);
    if (allValuesEmpty) {
      toast.error('All empty values cannot be submitted');
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      try {
        if (userId) {
          employeePersonalValues.userId = userId;
        }
        setLoading(true);
        await httpClient
          .post(USER.ADD_USER_PERSONAL_DETAILS, employeePersonalValues)
          .then((res) => {
            if (res.status === 200) {
              setEditToastMessage(true);
              if(editToastMessage){
                toast.success('Personal details  updated successfully');            
              }else{
                toast.success('Personal details  registered successfully');            
              }
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

  return (
    <div className="mt-1">
      {isLoading&&<Loader/>}
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Guardian Name</label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="guardian_name"
            value={employeePersonalValues.guardian_name}
            // className='form-control'
            className={`form-control ${formErrors.guardian_name ? 'is-invalid' : ''}`}
            placeholder="Enter Guardian Name"
            onChange={(e) => {
              const inputText = e.target.value;
              if (inputText.length === 1 && !inputText.match(/^[a-zA-Z]*$/)) {
                setFormErrors({ ...formErrors, guardian_name: 'On first place Name only allowed letter ' });
                return;
              }
              if (!inputText.match(/^[a-zA-Z\s]*$/)) {
                setFormErrors({ ...formErrors, guardian_name: 'Name must contain only letters and spaces' });
                return;
              }
              setEmployeePersonalValues({
                ...employeePersonalValues,
                guardian_name: inputText,
              });
              setFormErrors({ ...formErrors, guardian_name: '' });
            }}
            onBlur={() => {
              if (employeePersonalValues.guardian_name.trim().length === 0) {
                setFormErrors({ ...formErrors, guardian_name: '' });
              }
            }}
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.guardian_name}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Guardian Contact Number</label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="guardian_phone"
            value={employeePersonalValues.guardian_phone}
            // className='form-control'
            className={`form-control ${formErrors.guardian_phone ? 'is-invalid' : ''}`}
            placeholder="Enter Guardian Contact Number"
            maxLength="10"
            onChange={(e) => {
              const inputValue = e.target.value;
              // Use a regular expression to remove any non-digit characters
              const cleanedInput = inputValue.replace(/[^0-9]/g, '');
              setEmployeePersonalValues({ ...employeePersonalValues, guardian_phone: cleanedInput });
              setFormErrors({ ...formErrors, guardian_phone: '' });
              if (cleanedInput.startsWith('0')) {
                setFormErrors({ ...formErrors, guardian_phone: 'On first place phone number only allowed non-zero digits' });
                return;
              }
            }}
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.guardian_phone}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Blood Group</label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="blood_group"
            value={employeePersonalValues.blood_group}
            className="form-control"
            placeholder="Enter Blood Group"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[A-Za-z][A-Za-z\s()+-]*$/.test(inputValue) || inputValue === '') {
                // Allow empty input or only letters (uppercase and lowercase), spaces, and small brackets, but not as the first character
                setEmployeePersonalValues({ ...employeePersonalValues, blood_group: inputValue });
              }
            }}
          />
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Marital Status</label>
        </div>
        <div className="col-md-8">
          <select
            name="marital_status"
            value={employeePersonalValues.marital_status}
            className="form-control"
            aria-label="Default select example"
            onChange={(e) => {
              setEmployeePersonalValues({ ...employeePersonalValues, marital_status: e.target.value });
            }}
          >
            <option value="">Select Your Marital Status</option>
            {marital_status.length > 0 &&
              marital_status.map((maritalStaus, index) => (
                <option value={maritalStaus.value} key={index}>
                  {maritalStaus.label}
                </option>
              ))}
          </select>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Permanent Address</label>
        </div>
        <div className="col-md-8">
          <textarea
            type="textarea"
            name="permanent_address"
            value={employeePersonalValues.permanent_address}
            className="form-control"
            placeholder="Enter Permanent Address"
            onChange={(e) => {
              if(e.target.value !== employeePersonalValues.correspondence_address){
                setAddressCheck(false);
              }
              setEmployeePersonalValues({ ...employeePersonalValues, permanent_address: e.target.value });
            }}
          />        
        </div>
      </div>
      <hr/>
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Correspondence Address</label>
        </div>
        <div className="col-md-8">
          <textarea
            type="textarea"
            name="correspondence_address"
            value={employeePersonalValues.correspondence_address}
            disabled = {addressCheck ? true : false}
            className="form-control"
            placeholder="Enter Correspondence Address"
            onChange={(e) => {             
              setEmployeePersonalValues({ ...employeePersonalValues, correspondence_address: e.target.value });
            }}
          />
            <div style={{ marginTop: '7px' }}>
            <input type="checkbox" checked={addressCheck} onChange={handleCheckboxChange} />
            <label style={{ marginLeft: '10px', fontSize: '14px' }}>Same As Permanent Address</label>
          </div>
        </div>
      </div>
      <hr />
      <div className="col-lg-12  text-end pb-2 pe-0">
        <button type="submit" className="btn btn-leave_status e-submit-detail" onClick={handlePersonalDetails}>
          Submit Details
        </button>
      </div>
    </div>
  );
}

export default EmployeePersonalDetail;
