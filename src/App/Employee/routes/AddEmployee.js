import React, { useState } from 'react';
import EmployeeBasicDetail from './Employee/EmployeeBasicDetail';
import EmployeePersonalDetail from './Employee/EmployeePersonalDetail';
import EmployeeSalaryDetail from './Employee/EmployeeSalaryDetail';
import EmployeeVerificationDetail from './Employee/EmployeeVerificationDetail';

function Employee() {
  const [id, setId] = useState('');
  const [userJoiningDate, setUserJoiningDate] = useState('');
  const [isBasicDetailSubmitted, setIsBasicDetailSubmitted] = useState(false);

  const handleUserId = (id, date) => {
    setId(id);
    setUserJoiningDate(date);
    setIsBasicDetailSubmitted(true);
  };

  return (
    <>
      <div className="main_content_panel container hide-scroll">
        <div className="row ">
          <div className="offset-lg-0 col-lg-12 ">
            <div className="header_title employee-heading">
              <h1>
                Add<span> Employee</span>
              </h1>
            </div>
          </div>
          <div className="offset-lg-0 col-lg-12 mb-4">
            <div className="dashboard_card ">
              <div className="d-flex align-items-start row employee_details_data">
                <div className="nav flex-column nav-pills col-lg-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <button
                    className="nav-link active"
                    id="v-pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-home"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-home"
                    aria-selected="true"
                  >
                    Employee Details
                  </button>
                  <button
                     className={`nav-link ${ !id ? 'disabled_sidemenu':''}`}
                    id="v-pills-personal-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-personal"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-personal"
                    aria-selected="false"
                    disabled={!isBasicDetailSubmitted}
                  >
                    Personal Details
                  </button>
                  <button
                    className={`nav-link ${ !id ? 'disabled_sidemenu':''}`}
                    id="v-pills-salary-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-salary"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-salary"
                    aria-selected="false"
                    disabled={!isBasicDetailSubmitted}
                  >
                    Salary Details
                  </button>
                  <button
                   className={`nav-link ${ !id ? 'disabled_sidemenu':''}`}
                    id="v-pills-verification-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-verification"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-verification"
                    aria-selected="false"
                    disabled={!isBasicDetailSubmitted}
                  >
                    Verification Details
                  </button>
                </div>
                <div className="tab-content  col-lg-8 tab_minheight" id="v-pills-tabContent" >
                  <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <EmployeeBasicDetail callback={handleUserId} />
                  </div>
                  <div className="tab-pane fade" id="v-pills-personal" role="tabpanel" aria-labelledby="v-pills-personal-tab">
                    <EmployeePersonalDetail userId = {id}/>
                  </div>
                  <div className="tab-pane fade" id="v-pills-salary" role="tabpanel" aria-labelledby="v-pills-salary-tab">
                    <EmployeeSalaryDetail userId = {id} joiningDate = {userJoiningDate} />
                  </div>
                  <div className="tab-pane fade" id="v-pills-verification" role="tabpanel" aria-labelledby="v-pills-verification-tab">
                    <EmployeeVerificationDetail userId = {id}  joiningDate = {userJoiningDate} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Employee;
