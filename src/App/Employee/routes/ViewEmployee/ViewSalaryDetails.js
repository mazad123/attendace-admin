import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { httpClient } from '../../../../constants/Api';
import { USER } from '../../../../constants/AppConstants';
import salarySlipDropdownDates from '../../../common/SalaryLogic';

function ViewSalaryDetails({dateOfJoining}) {
  const { userId } = useParams();
  const [isEarningCollapsed, setIsEarningCollapsed] = useState(true);
  const [isDeductionCollapsed, setIsDeductionCollapsed] = useState(true);
  const [salaryValues, setSalaryValues] = useState('');
  const [monthsArray, setMonthsArray] = useState([]);
  const [yearsArray, setYearsArray] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  useEffect(() => {
    if(dateOfJoining !== ''){
      const isAfterJune7th = moment().isAfter(moment().month(5).date(7), 'day');
      const years = isAfterJune7th ? [moment().year()] : [moment().year() - 1, moment().year()]; 
      setYearsArray(years);
      const datesArray = salarySlipDropdownDates(dateOfJoining, years[years.length-1]);
      getSalaryDetail(years[years.length-1], datesArray[datesArray.length-1], datesArray); 
    }
  },[dateOfJoining]);

  const toggleEarningCollapse = () => {
    setIsEarningCollapsed(!isEarningCollapsed);
  };

  const toggleDeductionCollapse = () => {
    setIsDeductionCollapsed(!isDeductionCollapsed);
  };

  const getSalaryDetail = async (selectedYear, selectedMonth, datesArray) => {
    try {
      await httpClient
        .get(USER.GET_SALARY_BY_USER_ID.replace('{id}', userId), {
          params: {                      // sending year and month as query string
            year: selectedYear,
            month: selectedMonth,
          },
        })
        .then((res) => {
          if (res.status === 200){
            if(!res.data.salary) {
              setSalaryValues('');
            }else{  
              setMonthsArray(datesArray);
              setSalaryValues(res.data.salary);
              setMonth(res.data.salary.month);               
              setYear(res.data.salary.year);    
            }             
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
    }
  };

  const handleYearChange = (e) => {
    setMonth('');
    setMonthsArray('');
    const selectedYear = e.target.value;
    setYear(selectedYear);
    if (e.target.value !== '') {
      const datesArray = salarySlipDropdownDates(dateOfJoining, e.target.value);
      setMonthsArray(datesArray);
    }else{
      setSalaryValues('');
    }
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    if (e.target.value !== ''){
      getSalaryDetail(year, selectedMonth, monthsArray);
    }else{
      setSalaryValues('');
    }
  };

  return (
    <div className="mt-1">
      <div className="row px-3">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Year and Month</label>
        </div>
        <div className="col-md-4">
          <select
            name="year"
            value={year}
            className= "form-control"
            aria-label="Default select example"
            onChange={handleYearChange}
          >
            <option value="">Select Year</option>
            {yearsArray.length > 0 &&
              yearsArray.map((year, index) => (
                <option value={year} key={index}>
                  {year}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            name="month"
            value={month}
            className= "form-control"
            aria-label="Default select example"
            onChange={handleMonthChange}
          >
            <option value="">Select Month</option>
            {monthsArray.length > 0 &&
              monthsArray.map((month, index) => (
                <option value={month} key={index}>
                  {month}
                </option>
              ))}
          </select>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className={`mb-2 col-lg-12 ${!month || !year ? 'disable_fields' : ''}`}>
          <h4 className="employee-subheading add_employee-subheading">
            Earning Section <button onClick={toggleEarningCollapse} disabled={!month || !year}>{isEarningCollapsed ? '+' : '-'}</button>
          </h4>
        </div>
      </div>
      {!isEarningCollapsed && (
        <div className="px-3">
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Basic</label>
            </div>
            <div className="col-md-8">{ salaryValues && salaryValues.basic ? `Rs. ${salaryValues.basic}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>HRA</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.hra ? `Rs. ${salaryValues.hra}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>CCA</label>
            </div>
            <div className="col-md-8">{ salaryValues && salaryValues.cca ? `Rs. ${salaryValues.cca}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Medical</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.medical ? `Rs. ${salaryValues.medical}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Transport</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.transport ? `Rs. ${salaryValues.transport}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Employer PF</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.employer_pf ? `Rs. ${salaryValues.employer_pf}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Performance Incentive</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.performance_incentive ? `Rs. ${salaryValues.performance_incentive}` : 'N/A'}</div>
          </div>
          <hr />
        </div>
      )}
      <div className="row">
        <div className={`mb-2 col-lg-12 ${!month || !year ? 'disable_fields' : ''}`}>
          <h4 className="deduction-subheading add_employee-subheading mt-2">
            Deduction Section <button onClick={toggleDeductionCollapse} disabled={!month || !year}>{isDeductionCollapsed ? '+' : '-'}</button>
          </h4>
        </div>
      </div>
      {!isDeductionCollapsed && (
        <div className="px-3">
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>PF Deduction</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.pf_deduction ? `Rs. ${salaryValues.pf_deduction}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>ESI Deduction</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.esi_deduction ? `Rs. ${salaryValues.esi_deduction}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Professional Tax</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.professional_tax ? `Rs. ${salaryValues.professional_tax}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Medical Insurance</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.medical_insurance ? `Rs. ${salaryValues.medical_insurance}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Income Tax</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.income_tax ? `Rs. ${salaryValues.income_tax}` : 'N/A'}</div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Leave Deduction</label>
            </div>
            <div className="col-md-8">{salaryValues && salaryValues.leave_deduction ? `Rs. ${salaryValues.leave_deduction}` : 'N/A'}</div>
          </div>
          <hr />
        </div>
      )}
    </div>
  );
}

export default ViewSalaryDetails;
