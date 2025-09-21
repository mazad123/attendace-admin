import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { httpClient } from '../../../../constants/Api';
import { USER } from '../../../../constants/AppConstants';
import moment from 'moment';

function ViewVerificationDetails() {
  const { userId } = useParams();
  const [verificationValues, setVerificationValues] = useState('');

  useEffect(() => {
    getVerificationDetail();
  }, [userId]);

  const getVerificationDetail = async () => {
    try {
      await httpClient
        .get(USER.GET_VERIFICATION_DETAILS_BY_USER_ID.replace('{id}', userId))
        .then((res) => {
          if (res.status === 200 && res.data.verificationDetails !== null) {
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
    } catch (err) {
      console.log(err);
    }
  };

  const handlePreviewClick = (docID) => {
    window.open('/preview/doc/' + docID, '_blank'); //open preview in new Tab
  };

  return (
    <div className="mt-1">
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Employee ID</label>
        </div>
        <div className="col-md-8">{verificationValues.prev_company_emp_id ? verificationValues.prev_company_emp_id : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Company Name</label>
        </div>
        <div className="col-md-8">{verificationValues.prev_company_name ? verificationValues.prev_company_name : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Date Of Joinning(DOJ)</label>
        </div>
        <div className="col-md-8">{verificationValues.prev_company_doj ? moment(verificationValues.prev_company_doj).format('L') : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Last Working Date(DOR)</label>
        </div>
        <div className="col-md-8">{verificationValues.prev_company_dor ? moment(verificationValues.prev_company_dor).format('L') : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Last Designation</label>
        </div>
        <div className="col-md-8">{verificationValues.prev_company_designation ? verificationValues.prev_company_designation : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Employment Status</label>
        </div>
        <div className="col-md-8">{verificationValues.prev_company_employment_status ? verificationValues.prev_company_employment_status : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Eligible For Rehire</label>
        </div>
        <div className="col-md-8">{verificationValues.elligible_for_rehire ? (verificationValues.elligible_for_rehire === 'no' ? 'No' : 'Yes') : 'N/A'}</div>
      </div>
      <hr />
      {verificationValues.elligible_for_rehire === 'no' ? (
        <>
          <div className="row">
            <div className="col-md-4">
              <label style={{ fontWeight: 500 }}>Additional Comments</label>
            </div>
            <div className="col-md-8">{verificationValues.additional_comments ? verificationValues.additional_comments : 'N/A'}</div>
          </div>
          <hr />
        </>
      ) : (
        ''
      )}
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Uploaded Documents</label>
        </div>
        <div className="col-md-8">
          {verificationValues.file_name ? verificationValues.file_name : 'N/A'}
          {verificationValues.file_name ? (
            <button className="btn btn-primary" style={{ marginLeft: '17px' }} onClick={() => handlePreviewClick(verificationValues.userId)}>
              Preview
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default ViewVerificationDetails;
