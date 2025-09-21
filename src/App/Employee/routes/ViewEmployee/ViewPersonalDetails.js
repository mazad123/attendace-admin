import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { httpClient } from '../../../../constants/Api';
import { USER } from '../../../../constants/AppConstants';

function ViewPersonalDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState('');

  useEffect(() => {
    getUserDetail();
  }, [userId]);

  const getUserDetail = async () => {
    try {
      await httpClient
        .get(USER.GET_BY_ID.replace('{id}', userId))
        .then((res) => {
          if (res.status === 200) {
            setUser(res.data.user);
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

  return (
    <div className="mt-1">
      <div className="row">
        <div className="col-md-12">
          <div className="profile_info hide_mob">
            <div className="profile_img ms-0 mb-4">
              <img src={user?.profile_image} className="img-fluid w-100" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Guardian Name</label>
        </div>
        <div className="col-md-8">{user.guardian_name ? user.guardian_name : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Guardian Contact Number</label>
        </div>
        <div className="col-md-8">{user.guardian_phone ? user.guardian_phone :'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Blood Group</label>
        </div>
        <div className="col-md-8">{user.blood_group ? user.blood_group : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Marital Status</label>
        </div>
        <div className="col-md-8">{user.marital_status ? user.marital_status.charAt(0).toUpperCase() + user.marital_status.slice(1) : 'N/A'}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Permanent Address</label>
        </div>
        <div className="col-md-8">{user.permanent_address ? user.permanent_address : 'N/A' }</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Correspondence Address</label>
        </div>
        <div className="col-md-8">{user.correspondence_address ? user.correspondence_address : 'N/A'}</div>
      </div>
      <hr />    
    </div>
  );
}

export default ViewPersonalDetails;
