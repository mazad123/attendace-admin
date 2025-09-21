import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import { httpClient } from '../../../../constants/Api';
import { USER, ORGANISATION, ROLES } from '../../../../constants/AppConstants';

function ViewEmployeeDetails({callback}) {
  const { userId } = useParams();
  const [user, setUser] = useState('');
  const [roles, setRoles] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    getUserDetail();
    getRoles();
    getLevelsData();
  }, [userId]);

  const getUserDetail = async () => {
    try {
      await httpClient
        .get(USER.GET_USER_WITH_LEVEL_BY_ID.replace('{id}', userId))
        .then((res) => {
          if (res.status === 200) {
            res.data.user.level = res.data.userLevel && res.data.userLevel.level && res.data.userLevel.level.level ? res.data.userLevel.level.level : '';
            setUser(res.data.user);
            callback(res.data.user.doj);
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

  const formatTime = (time) => {
    return moment(time, 'h:m').format('hh:mm A');
  };

  const filterRole = (roleId) => {
    const res = roles.filter((role) => role._id === roleId);
    return res[0]?.role;
  };

  return (
    <div className="mt-1">
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Full Name</label>
        </div>
        <div className="col-md-8">{user?.name}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Email</label>
        </div>
        <div className="col-md-8">{user?.email}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Employee ID</label>
        </div>
        <div className="col-md-8">{user?.emp_id}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Phone Number</label>
        </div>
        <div className="col-md-8">{user?.phone}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Date of Birth</label>
        </div>
        <div className="col-md-8">{moment(user?.dob).format('L')}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>In Time</label>
        </div>
        <div className="col-md-8">{formatTime(user?.in_time)}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Out Time</label>
        </div>
        <div className="col-md-8">{formatTime(user?.out_time)}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Designation</label>
        </div>
        <div className="col-md-8">{user?.designation}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Role</label>
        </div>
        <div className="col-md-8">{filterRole(user?.role)}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Date of joining</label>
        </div>
        <div className="col-md-8">{moment(user?.doj).format('L')}</div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <label style={{ fontWeight: 500 }}>Level</label>
        </div>
        <div className="col-md-8">{user?.level}</div>
      </div>
      <hr />
    </div>
  );
}

export default ViewEmployeeDetails;
