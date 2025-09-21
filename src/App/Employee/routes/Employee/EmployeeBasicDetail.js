import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { httpClient } from '../../../../constants/Api';
import { ROLES } from '../../../../constants/AppConstants';
import { uploadS3Image } from '../../../../Utils/UploadImage';
import UploadImage from '../../../../assets/images/dummy_profile.jpeg';
import { USER } from '../../../../constants/AppConstants';
import { ORGANISATION } from '../../../../constants/AppConstants';
import Loader from '../../../../App/Layouts/Loader';
import moment from 'moment';

function EmployeeBasicDetail({ callback }) {
  const titleRef = useRef();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    emp_id: '',
    designation: '',
    in_time: '',
    out_time: '',
    role: '',
    doj: '',
    allotted_leaves: '',
    password: '',
    level: '',
  });
  const [userId, setUserId] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');
  const [roles, setRoles] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [levels, setLevels] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    emp_id: '',
    designation: '',
    in_time: '',
    out_time: '',
    role: '',
    doj: '',
    allotted_leaves: '',
    password: '',
    level: '',
  });

  useEffect(() => {
    const getRoles = async () => {
      await httpClient
        .get(ROLES.GET_USER_ROLE)
        .then((res) => {
          if (res.status === 200) {
            setRoles(res.data);
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
    getRoles();
    getLevelsData();
  }, []);

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

  const getLevelsData = async () => {
    try {
      let levels = [];
      const getlevels = await httpClient.get(ORGANISATION.GET_LEVELS);
      getlevels.data.result.map((level) => {
        return (levels = [...levels, { label: level.level, value: level._id }]);
      });
      setLevels(levels);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching level data');
    }
  };

  const addEmployeeSubmit = async (e) => {
    e.preventDefault();
    values.working_hour = String(parseInt(values.out_time) - parseInt(values.in_time));
    values.status = true;
    if (imageURL) {
      values.profile_image = imageURL;
    }

    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true);
        if(userId){
          values['userId'] = userId;
        }
        await httpClient
          .post(USER.ADD_USER, values)
          .then((res) => {
            if (res.status === 201) {
              if(userId){
                toast.success('User Updated successfully');
              }
              else{
                toast.success('User registered successfully');
              }
              callback(res.data.user.id, res.data.user.doj);
              setUserId(res.data.user.id);
              setLoading(false);
            }
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.data.message === 'Error: Email already exist!') {
                toast.error('Email already exist!');
              } else if (err.response.data.message === 'Error: Employee ID already exist!') {
                toast.error('Employee ID already exist!');
              } else {
                toast.error(err.response.data.message);
              }
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
  const handleClick = async () => {
    setLoading(true);
    const fileInput = titleRef;
    const dirName = 'porfile-images';
    let reader = new FileReader();
    reader.readAsDataURL(titleRef.current.files[0]);
    reader.onloadend = function (e) {
      setUploadedImage([reader.result]);
    };
    const imageURL = await uploadS3Image(fileInput, dirName);
    setImageURL(imageURL.location);
    setLoading(false);
  };

  const handleAllotedLeaves = () => {
    const getMonth = moment(values.doj).month();
    const getDate = moment(values.doj).date();
    if (moment().isSame(moment(values.doj), 'year')) {
      if (getMonth !== 0) {
        if (getDate > 15) {
          setValues({ ...values, allotted_leaves: 12 - getMonth - 1 });
        } else {
          setValues({ ...values, allotted_leaves: 12 - getMonth });
        }
      } else {
        if (getDate > 15) {
          setValues({ ...values, allotted_leaves: 11 });
        } else {
          setValues({ ...values, allotted_leaves: 12 });
        }
      }
    } else {
      setValues({ ...values, allotted_leaves: 12 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
      dob: '',
      emp_id: '',
      designation: '',
      in_time: '',
      out_time: '',
      role: '',
      doj: '',
      allotted_leaves: '',
      password: '',
      level: '',
    };

    if (values.name.trim() === '') {
      errors.name = 'Name is required';
    } else if (values.name.length === 1 && !values.name.match(/^[a-zA-Z]*$/)) {
      errors.name = 'On first place Name only allowed letter ';
    } else if (!/^[A-Za-z\s]+$/.test(values.name)) {
      errors.name = 'Name must contain only letters and spaces';
    }
    if (values.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(values.email)) {
      errors.email = 'Invalid email format';
    }
    if (values.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }else if(values.phone.startsWith('0')){
      errors.phone = 'On first place phone number only allowed non-zero digits';
    } else if (!/^\d+$/.test(values.phone)) {
      errors.phone = 'Phone number must contain only numeric digits';
    } else if (values.phone.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits long';
    }
    if (values.dob.trim() === ''){
       errors.dob = 'Date of birth is required';
    }else if(moment(values.dob).isAfter(moment())){
       errors.dob = 'Date of birth can not be in future';
    }else if(values.doj !=='' && moment(values.dob).isSameOrAfter(moment(values.doj))){
       errors.dob = 'Date of birth can not be greater than or equal to date of joining';
    }   
    if (values.emp_id.trim() === '') {
      errors.emp_id = 'Employee ID is required';
    } else if (!/^KIS\/[A-Z]{3}\/2\d{3}\/\d{1,3}$/.test(values.emp_id)) {
      errors.emp_id = 'Please enter a correct Employee ID like KIS/EMP/2023/199';
    }
    if (values.designation.trim() === '') {
      errors.designation = 'Designation is required';
    } else if (values.designation.length === 1 && !values.designation.match(/^[a-zA-Z]*$/)) {
      errors.designation = 'On first place Designation only allowed letter ';
    }
    if (values.in_time.trim() === '') errors.in_time = 'In Time is required';
    if (values.out_time !== '' && moment(values.in_time, 'HH:mm').isSameOrAfter(moment(values.out_time, 'HH:mm')))
      errors.in_time = 'In Time can not be greater than or equal to Out Time';
    if (values.out_time.trim() === '') errors.out_time = 'Out Time is required';
    if (values.in_time !== '' && moment(values.out_time, 'HH:mm').isSameOrBefore(moment(values.in_time, 'HH:mm')))
      errors.out_time = 'Out Time can not be less than or equal to In Time';
    if (values.role.trim() === '') errors.role = 'Role is required';
    if (values.doj.trim() === ''){
       errors.doj = 'Date of joinning is required';
    }else if(moment(values.doj).isAfter(moment())){
       errors.doj = 'Date of joinning can not be in future';
    }else if(values.dob !=='' && moment(values.doj).isSameOrBefore(moment(values.dob))){
       errors.doj = 'Date of joinning can not be less than or equal to date of birth';
    }   
    if (values.allotted_leaves === '') errors.allotted_leaves = 'Allotted leave is required';
    if (values.password.trim() === '') {
      errors.password = 'Password is required';
    } else if (!/(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(values.password)) {
      errors.password = 'Must contain at least one number and one letter, and at least 8 or more characters';
    }
    if (values.level.trim() === '') errors.level = 'Level is required';

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  return (
    <form className="mt-1" auto-complete="off">
      {isLoading&&<Loader/>}
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Full Name<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, name: '' });
              if (e.target.value.length === 1 && !e.target.value.match(/^[a-zA-Z]*$/)) {
                setFormErrors({ ...formErrors, name: 'On first place Name only allowed letter ' });
                return;
              }
              if (!/^[A-Za-z\s]+$/.test(e.target.value)) {
                setFormErrors({ ...formErrors, name: 'Name must contain only letters and spaces' });
              }
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, name: 'Name is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, name: 'Name is required' });
            }}
            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
            placeholder="Enter Full Name"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.name}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Email<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, email: '' });
              if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(e.target.value)) {
                setFormErrors({ ...formErrors, email: 'Invalid email format' });
              }
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, email: 'Email is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, email: 'Email is required' });
            }}
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            placeholder="Enter Email"
          />
          <small className="error">{formErrors.email}</small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Phone Number<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="phone"
            value={values.phone}
            onChange={(e) => {
              // if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, phone: '' });
              if (e.target.value !== '' || e.target.value !== undefined) {
                if (e.target.value.startsWith('0')) {
                  setFormErrors({ ...formErrors, phone: 'On first place phone number only allowed non-zero digits' });
                } else {
                  setFormErrors({ ...formErrors, phone: '' });
                }
              }
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, phone: 'Phone is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, phone: 'Phone is required' });
            }}
            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
            placeholder="Enter Phone Number"
            maxLength="10"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
            }}
          />
          <small className="error">{formErrors.phone}</small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Date of Birth<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="date"
            name="dob"
            value={values.dob}
            onChange={(e) => {
              const selectedDate = moment(e.target.value);
              const currentDate = moment();

              if (selectedDate > currentDate) {
                setFormErrors({
                  ...formErrors,
                  dob: 'Date of birth cannot be in the future'
                });
              }else if(moment(e.target.value).isAfter(moment())){
              setFormErrors({ ...formErrors, dob:'Date of birth can not be in future'});
              }else if(values.doj !=='' && moment(e.target.value).isSameOrAfter(moment(values.doj))){
                setFormErrors({ ...formErrors, dob : 'Date of birth can not be greater than or equal to date of joining'});
              } else {
                setFormErrors({ ...formErrors, dob: '' });
              }
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined){ setFormErrors({ ...formErrors, dob: 'Date of birth is required' });
              }else if(moment(e.target.value).isAfter(moment())){
                setFormErrors({ ...formErrors, dob:'Date of birth can not be in future'});
              }else if(values.doj !=='' && moment(e.target.value).isSameOrAfter(moment(values.doj))){
                setFormErrors({ ...formErrors, dob : 'Date of birth can not be greater than or equal to date of joining'});
              }
            }}
            max={moment().format('YYYY-MM-DD')}
            className={`form-control ${formErrors.dob ? 'is-invalid' : ''}`}
            placeholder="dd-mmm-yyyy"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.dob}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Employee ID<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="emp_id"
            value={values.emp_id}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, emp_id: '' });
              if (!/^KIS\/[A-Z]{3}\/2\d{3}\/\d{1,3}$/.test(e.target.value))
                setFormErrors({ ...formErrors, emp_id: 'Please enter a correct Employee ID like KIS/EMP/2023/199' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, emp_id: 'Employee ID is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, emp_id: 'Employee ID is required' });
            }}
            className={`form-control ${formErrors.emp_id ? 'is-invalid' : ''}`}
            placeholder="Enter Employee ID"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.emp_id}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Designation<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="text"
            name="designation"
            value={values.designation}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, designation: '' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, designation: 'Designation is required' });
              if (e.target.value.length === 1 && !e.target.value.match(/^[a-zA-Z]*$/)) {
                setFormErrors({ ...formErrors, designation: 'On first place Designation only allowed letter ' });
                return;
              }
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, designation: 'Designation is required' });
            }}
            className={`form-control ${formErrors.designation ? 'is-invalid' : ''}`}
            placeholder="Enter Designation"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.designation}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            In Time<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="time"
            name="in_time"
            value={values.in_time}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, in_time: '' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, in_time: 'In Time is required' });
              if (values.out_time !== '' && moment(e.target.value, 'HH:mm').isSameOrAfter(moment(values.out_time, 'HH:mm')))
                setFormErrors({ ...formErrors, in_time: 'In Time can not be greater than or equal to Out Time' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, in_time: 'In Time is required' });
              if (values.out_time !== '' && moment(e.target.value, 'HH:mm').isSameOrAfter(moment(values.out_time, 'HH:mm')))
                setFormErrors({ ...formErrors, in_time: 'In Time can not be greater than or equal to Out Time' });
              if (moment(e.target.value, 'HH:mm').isBefore(moment(values.out_time, 'HH:mm'))) {
                setFormErrors({
                  ...formErrors,
                  in_time: '',
                  out_time: '',
                });
              }
            }}
            className={`form-control ${formErrors.in_time ? 'is-invalid' : ''}`}
            placeholder="Enter In Time"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.in_time}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Out Time<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="time"
            name="out_time"
            value={values.out_time}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, out_time: '' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, out_time: 'Out Time is required' });
              if (values.in_time !== '' && moment(e.target.value, 'HH:mm').isSameOrBefore(moment(values.in_time, 'HH:mm')))
                setFormErrors({ ...formErrors, out_time: 'Out Time can not be less than or equal to In Time' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, out_time: 'Out Time is required' });
              if (values.in_time !== '' && moment(e.target.value, 'HH:mm').isSameOrBefore(moment(values.in_time, 'HH:mm')))
                setFormErrors({ ...formErrors, out_time: 'Out Time can not be less than or equal to In Time' });
              if (moment(e.target.value, 'HH:mm').isAfter(moment(values.in_time, 'HH:mm'))) {
                setFormErrors({
                  ...formErrors,
                  out_time: '',
                  in_time: '',
                });
              }
            }}
            className={`form-control ${formErrors.out_time ? 'is-invalid' : ''}`}
            placeholder="Enter Out Time"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.out_time}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Select Your Role<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <select
            className={`form-control ${formErrors.role ? 'is-invalid' : ''}`}
            aria-label="Default select example"
            value={values.role}
            name="role"
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, role: '' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, role: 'Role is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, role: 'Role is required' });
            }}
          >
            <option value="">Select Your Role</option>
            {roles.length > 0 &&
              roles.map((r, i) => (
                <option value={r._id} key={i}>
                  {r.role}
                </option>
              ))}
          </select>
          <small style={{ color: 'red' }} role="alert">
            {formErrors.role}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Date Of Joining<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="date"
            name="doj"
            value={values.doj}
            max={moment().format('YYYY-MM-DD')}
            onChange={(e) => {
              const selectedDate = moment(e.target.value);
              const currentDate = moment();
              if (selectedDate > currentDate) {
                setFormErrors({
                  ...formErrors,
                  doj: 'Date of joining cannot be in the future',
                  allotted_leaves: '',
                });
              }else if(moment(e.target.value).isAfter(moment())){
                setFormErrors({ ...formErrors, doj: 'Date of joinning can not be in future', allotted_leaves: '' });
              }else if(values.dob !=='' && moment(e.target.value).isSameOrBefore(moment(values.dob))){
                setFormErrors({ ...formErrors, doj: 'Date of joinning can not be less than or equal to date of birth', allotted_leaves: '' });
              } else {
                setFormErrors({ ...formErrors, doj: '', allotted_leaves: '' });
              }
              handleInputChange(e);
            }}
            onBlur={(e) => {
              handleAllotedLeaves();
              if (e.target.value === '' || e.target.value === undefined){
                setFormErrors({ ...formErrors, doj: 'Date of joinning is required', allotted_leaves: 'Allotted leaves is required' });
              }else if(moment(e.target.value).isAfter(moment())){
                setFormErrors({ ...formErrors, doj: 'Date of joinning can not be in future', allotted_leaves: '' });
              }else if(values.dob !=='' && moment(e.target.value).isSameOrBefore(moment(values.dob))){
                setFormErrors({ ...formErrors, doj: 'Date of joinning can not be less than or equal to date of birth', allotted_leaves: '' });
              }   
            }}
            // onBlur={handleAllotedLeaves}
            className={`form-control ${formErrors.doj ? 'is-invalid' : ''}`}
            placeholder="dd-mmm-yyyy"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.doj}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Allotted Leaves<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="number"
            name="allotted_leaves"
            value={values.allotted_leaves}
            disabled={true}
            step="any"
            maxLength="5"
            className={`form-control ${formErrors.allotted_leaves ? 'is-invalid' : ''}`}
            placeholder="Enter Allotted Leaves"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.allotted_leaves}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Password<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, password: '' });
              if (!/(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(e.target.value))
                setFormErrors({ ...formErrors, password: 'Must contain at least one number and one letter, and at least 8 or more characters' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, password: 'Password is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, password: 'Password is required' });
            }}
            className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
            placeholder="Enter Password"
          />
          <small style={{ color: 'red' }} role="alert">
            {formErrors.password}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Level<span className="error"> *</span>
          </label>
        </div>
        <div className="col-md-8">
          <select
            name="level"
            // className="form-control"
            className={`form-control ${formErrors.level ? 'is-invalid' : ''}`}
            aria-label="Default select example"
            value={values.level}
            onChange={(e) => {
              if (e.target.value !== '' || e.target.value !== undefined) setFormErrors({ ...formErrors, level: '' });
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, level: 'Level is required' });
              handleInputChange(e);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || e.target.value === undefined) setFormErrors({ ...formErrors, level: 'Level is required' });
            }}
          >
            <option value="">Select Your Level</option>
            {levels.length > 0 &&
              levels.map((r, i) => (
                <option value={r.value} key={i}>
                  {r.label}
                </option>
              ))}
          </select>
          <small style={{ color: 'red' }} role="alert">
            {formErrors.level}
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label className="form-label" style={{ fontWeight: 500 }}>
            Upload Profile Image
          </label>
        </div>
        <div className="col-md-8">
          <div className="profile-pic">
            <label className="-label" htmlFor="file">
              <span className="glyphicon glyphicon-camera"></span>
              <span>
                {/* {!isLoading ? "Change Image" : "Uploading..."} */}
                {!isLoading ? 'Change Image' : 'Upload Image'}
              </span>
            </label>
            <input id="file" type="file" onChange={handleClick} ref={titleRef} accept="image/*" />
            <img src={uploadedImage ? uploadedImage : UploadImage} id="output" width="200" alt="" />
          </div>
        </div>
      </div>
      <hr />
      <div className="col-lg-12  text-end pb-2 pe-0">
        <button type="submit" className="btn btn-leave_status e-submit-detail" onClick={addEmployeeSubmit}>
          Submit Details
        </button>
      </div>
    </form>
  );
}

export default EmployeeBasicDetail;
