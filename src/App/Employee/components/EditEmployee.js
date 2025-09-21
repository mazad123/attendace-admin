import React, { useState } from 'react';
import EditEmployeeBasicDetail from '../components/editEmployeeComponents/EditEmployeeDetails';
import EditEmployeePersonalDetails from './editEmployeeComponents/EditPersonalDetails';
import EditSalaryDetails from './editEmployeeComponents/EditSalaryDetails';
import EditVerificationDetails from './editEmployeeComponents/EditVerificationDetails';

function EditEmployee() {
  const [userJoiningDate, setUserJoiningDate] = useState('');

  const handleJoiningDate = (joiningDate) => {
    setUserJoiningDate(joiningDate)
  };

  return (
    <>
      <div className="main_content_panel container hide-scroll">
        <div className="row ">
          <div className="offset-lg-0 col-lg-12 ">
            <div className="header_title employee-heading">
              <h1>
                Edit<span> Employee</span>
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
                    className="nav-link"
                    id="v-pills-personal-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-personal"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-personal"
                    aria-selected="false"
                  >
                    Personal Details
                  </button>
                  <button
                    className="nav-link"
                    id="v-pills-salary-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-salary"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-salary"
                    aria-selected="false"
                  >
                    Salary Details
                  </button>
                  <button
                    className="nav-link"
                    id="v-pills-verification-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-verification"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-verification"
                    aria-selected="false"
                  >
                    Verification Details
                  </button>
                </div>
                <div className="tab-content  col-lg-8 tab_minheight" id="v-pills-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <EditEmployeeBasicDetail callback={handleJoiningDate} />
                  </div>
                  <div className="tab-pane fade" id="v-pills-personal" role="tabpanel" aria-labelledby="v-pills-personal-tab">
                    <EditEmployeePersonalDetails />
                  </div>
                  <div className="tab-pane fade" id="v-pills-salary" role="tabpanel" aria-labelledby="v-pills-salary-tab">
                    <EditSalaryDetails dateOfJoining = {userJoiningDate} />
                  </div>
                  <div className="tab-pane fade" id="v-pills-verification" role="tabpanel" aria-labelledby="v-pills-verification-tab">
                    <EditVerificationDetails dateOfJoining = {userJoiningDate} />
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

export default EditEmployee;
