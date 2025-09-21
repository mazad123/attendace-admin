import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { httpClient } from '../../../../constants/Api';
import { USER } from '../../../../constants/AppConstants';
import Loader from '../../../../App/Layouts/Loader';
import salarySlipDropdownDates from '../../../common/SalaryLogic';

function EmployeeSalaryDetail({ userId, joiningDate }) {
  const [isEarningCollapsed, setIsEarningCollapsed] = useState(true);
  const [isDeductionCollapsed, setIsDeductionCollapsed] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [monthsArray, setMonthsArray] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editToastMessage, setEditToastMessage] = useState(false);
  const [salarySlipValues, setSalarySlipValues] = useState({
    basic: '',
    hra: '',
    cca: '',
    medical: '',
    transport: '',
    employer_pf: '',
    performance_incentive: '',
    pf_deduction: '',
    esi_deduction: '',
    professional_tax: '',
    medical_insurance: '',
    income_tax: '',
    leave_deduction:''
  });

  const [formErrors, setFormErrors] = useState({
    month: '',
    year: '',
  });
  const toggleEarningCollapse = () => {
    setIsEarningCollapsed(!isEarningCollapsed);
  };

  const toggleDeductionCollapse = () => {
    setIsDeductionCollapsed(!isDeductionCollapsed);
  };

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

  useEffect(() => {
    setMonth('');
    setYear('');
    setMonthsArray([]);
  }, [joiningDate]);

  const isAfterJune7th = moment().isAfter(moment().month(5).date(7), 'day');
  const yearsArray = isAfterJune7th ? [moment().year()] : [moment().year() - 1, moment().year()];

  const validateForm = () => {
    const errors = {
      month: '',
      year: '',
    };
    if (month.trim() === '') errors.month = 'Month is required';
    if (year.trim() === '') errors.year = 'Year is required';

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  const handleSalaryDetails = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        const allValuesEmpty = Object.values(salarySlipValues).every((value) => !value);
        if (allValuesEmpty) {
          toast.error('All empty values cannot be submitted');
          return;
        }
        if (userId) {
          salarySlipValues.userId = userId;
          salarySlipValues.month = month;
          salarySlipValues.year = year;
        }
        setLoading(true);
        await httpClient
          .post(USER.ADD_USER_SALARY, salarySlipValues)
          .then((res) => {
            if (res.status === 201) {
              setEditToastMessage(true);
              if (editToastMessage) {
                toast.success('Salary details updated successfully');
              } else {
                toast.success('Salary details added successfully');
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
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Something went wrong');
        }
      } finally {
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
      {isLoading && <Loader />}
      <div className='employheadreForm'>
        <div className="row">
          <div className="col-md-4">
            <label style={{ fontWeight: 500 }} className='mt-2'>
              Select Year and Month <span className="error"> *</span>
            </label>
          </div>
          <div className="col-md-4">
            <select
              name="year"
              value={year}
              className={`form-control ${formErrors.year ? 'is-invalid' : ''}`}
              aria-label="Default select example"
              onChange={(e) => {
                // setSalarySlipValues({ ...salarySlipValues, year: e.target.value });
                setMonth('');
                setMonthsArray('')
                if (e.target.value !== '') {
                  const datesArray = salarySlipDropdownDates(joiningDate, e.target.value);
                  setMonthsArray(datesArray);
                  setFormErrors({ ...formErrors, year: '' });
                }
                setYear(e.target.value);
              }}
            >
              <option value="">Select Year</option>
              {yearsArray.length > 0 &&
                yearsArray.map((year, index) => (
                  <option value={year} key={index}>
                    {year}
                  </option>
                ))}
            </select>
            <small style={{ color: 'red' }} role="alert">
              {formErrors.year}
            </small>
          </div>
          <div className="col-md-4">
            <select
              name="month"
              value={month}
              className={`form-control ${formErrors.month ? 'is-invalid' : ''}`}
              aria-label="Default select example"
              onChange={(e) => {
                // setSalarySlipValues({ ...salarySlipValues, month: e.target.value });
                if (e.target.value !== '') setFormErrors({ ...formErrors, month: '' });
                setMonth(e.target.value);
              }}
            >
              <option value="">Select Month</option>
              {monthsArray.length > 0 &&
                monthsArray.map((month, index) => (
                  <option value={month} key={index}>
                    {month}
                  </option>
                ))}
            </select>
            <small style={{ color: 'red' }} role="alert">
              {formErrors.month}
            </small>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className={`mb-2 col-lg-12 ${!month || !year ? 'disable_fields' : ''}`}>
          <h4 className="employee-subheading add_employee-subheading">Earning Section
            <button onClick={toggleEarningCollapse} disabled={!month || !year} >
              {isEarningCollapsed ? '+' : '-'}
            </button></h4>
        </div>
      </div>
      {!isEarningCollapsed && (
        <div className="px-3">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Basic
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.basic}
                onChange={(e) => setSalarySlipValues({ ...salarySlipValues, basic: e.target.value })}
                className="form-control"
                placeholder="Enter Basic"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                HRA
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.hra}
                onChange={(e) => setSalarySlipValues({ ...salarySlipValues, hra: e.target.value })}
                className="form-control"
                placeholder="Enter HRA"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                CCA
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.cca}
                onChange={(e) => setSalarySlipValues({ ...salarySlipValues, cca: e.target.value })}
                className="form-control"
                placeholder="Enter CCA"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Medical
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.medical}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    medical: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter Medical"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Transport
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.transport}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    transport: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter Transport"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Employer PF
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.employer_pf}
                onChange={(e) => setSalarySlipValues({ ...salarySlipValues, employer_pf: e.target.value })}
                className="form-control"
                placeholder="Enter Employer PF"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Performance Incentive
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.performance_incentive}
                onChange={(e) => setSalarySlipValues({ ...salarySlipValues, performance_incentive: e.target.value })}
                className="form-control"
                placeholder="Enter Performance Incentive"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className={`mb-2 col-lg-12 ${!month || !year ? 'disable_fields' : ''}`}>
          <h4 className="deduction-subheading add_employee-subheading mt-2">Deduction Section  <button onClick={toggleDeductionCollapse} disabled={!month || !year}>
            {isDeductionCollapsed ? '+' : '-'}
          </button>
          </h4>
        </div>
      </div>
      {!isDeductionCollapsed && (
        <div className="px-3">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                PF Deduction
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.pf_deduction}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    pf_deduction: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter PF deduction"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                ESI Deduction
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.esi_deduction}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    esi_deduction: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter ESI Deduction"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Professional Tax
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.professional_tax}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    professional_tax: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter Professional Tax"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Medical Insurance
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.medical_insurance}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    medical_insurance: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter Medical Insurance"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Income Tax
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.income_tax}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    income_tax: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter Income Tax"
                // onKeyDown={(e) => {
                //   // Allow only numeric values (0-9) and a few control keys (e.g., Backspace, Delete)
                //   if (
                //     !(e.key === 'Backspace' || e.key === 'Delete') &&
                //     isNaN(parseInt(e.key, 10))
                //   ) {
                //     e.preventDefault();
                //   }
                // }}
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label className="form-label" style={{ fontWeight: 500 }}>
                Leave Deduction
              </label>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                value={salarySlipValues.leave_deduction}
                onChange={(e) =>
                  setSalarySlipValues({
                    ...salarySlipValues,
                    leave_deduction: e.target.value,
                  })
                }
                className="form-control"
                placeholder="Enter leave Deduction"
                maxLength="10"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                }}
              />
            </div>
          </div>
          <hr />
          <hr />
        </div>
      )}
      <div className="col-lg-12  text-end pb-3 pe-0">
        <button type="submit" className="btn btn-leave_status e-submit-detail" onClick={handleSalaryDetails}>
          Submit Details
        </button>
      </div>
    </div>
  );
}

export default EmployeeSalaryDetail;
