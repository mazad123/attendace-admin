import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { httpClient } from '../../constants/Api';
import { PROJECT } from '../../constants/AppConstants';
import AddProjectModal from './Modals/AddProjectModal';
import EditProjectModal from './Modals/EditProjectModal';
import BlankImage from '../../assets/images/dummy_profile.jpeg';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
function ProjectList() {
  const userDetail = useSelector((state) => state.user.user.user);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [options, setOptions] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  const [showEditProjectDeatils, setShowEditProjectDeatils] = useState({ open: false, data: "" });
  const [activeButton, setActiveButton] = useState("active");
  let history = useHistory();

  useEffect(() => {
    getProjects();
    getEmployees();
    getEmployeesForSalesStatus();
    handleClose();
  }, []);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleCloseOfEditProjectModal = () => {
    setShowEditProjectDeatils({ open: false });
  };

  const getProjects = async () => {
    try {
      setLoading(true);
      const projects = await httpClient.get(PROJECT.GET_ALL_PROJECTS);
      setProjects(projects.data.result);
      setActiveButton("active");
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const getEmployees = async () => {
    try {
      setLoading(true);
      let result = [];
      const users = await httpClient.get(PROJECT.GET_ALL_EMPLOYEES);
      users.data.result.map((user) => {
        return (result = [...result, { label: `${user.name}`, value: user.id, profile_image: user.profile_image }]);
      });
      setOptions(result);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeesForSalesStatus = async () => {
    try {
      setLoading(true);
      let result = [];
      const users = await httpClient.get(PROJECT.GET_TEAM_PROFILE_IMAGES);
      users.data.result.teamProfileImages.map((user) => {
        return (result = [...result, { label: `${user.name}`, value: user.id, profile_image: user.profile_image }]);
      });
      setProfileImage(result);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Error in fetching user detail');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (data) => {
    let type = data;
    if (type === 'daily_status') history.push(`/project/get-project/general-project/${type}`);
    else history.push(`/project/get-project-detail/sales-project/${type}`);
  };

  const handleUserDeletion = (userIdToDelete) => {
    // Copy the current state
    const updatedData = { ...showEditProjectDeatils.data };

    // Filter out the user to be deleted
    updatedData.users = updatedData.users.filter(
      (userId) => userId !== userIdToDelete
    );

    // Update the state with the new data
    setShowEditProjectDeatils((prevState) => ({
      ...prevState,
      data: updatedData,
    }));
  };

  const handleArchivedProjects = async () => {
    try {
      setLoading(true);
      setActiveButton("archived"); // Set archived button as active
      const response = await httpClient.get(PROJECT.GET_ALL_ARCHIVED_PROJECTS);
      if (response.status === 200) {
        setProjects(response.data.result);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }finally {
      setLoading(false);
    }
  }

  const handleUnArchivedProjects = async () => {
    setActiveButton("active"); // Set active button as active
    await getProjects();
  }

  return (
    <>
      <div className="main_content_panel container">
        <div className="header_title d-block d-lg-flex">
          <h1>
            <span>Status</span>
          </h1>
          <div className="text-end">
            <button
              type="button"
              className={`btn btn-outline-primary text-center shadow-none me-2 ${activeButton === "archived" ? "active" : ""}`}
              onClick={handleArchivedProjects}
            >
              <i className="fa fa-archive me-1" aria-hidden="true"></i>
              Archived Projects
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary text-center me-2 shadow-none ${activeButton === "active" ? "active" : ""}`}
              onClick={handleUnArchivedProjects}
            >
              <i className="fa fa-tasks me-1" aria-hidden="true"></i>
              Active Projects
            </button>
            <button
              type="button"
              className="btn btn-outline-primary text-center shadow-none"
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              Add Project
            </button>
          </div>
        </div>
        <div className="row cus-row-wrap justify-content-start">
          {userDetail.role.role === 'Super Admin' && (
            <div className="col-md-2 border p-2 m-2 rounded-3">
              <div
                onClick={() => handleStatusClick('daily_status')}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <h6 className="project-heading-info text-left fw-bold">Daily Status</h6>
                  <p className="project-description-info fw-light"></p>
                </div>
                <div className="project-userimg-info">
                  {options.slice(0, 8).map((data, i) => (
                    <img
                      src={data.profile_image ? data.profile_image : BlankImage}
                      alt="profile_image"
                      style={{
                        verticalAlign: 'middle',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginRight: '5px',
                        marginBottom: '5px',
                      }}
                      key={i}
                    />
                  ))}
                  {options.length > 8 && <span style={{ fontSize: '12px' }}> + {options.length - 8} more</span>}
                </div>
              </div>
            </div>
          )}

          <div className="col-md-2 border p-2 m-2 rounded-3">
            <div
              onClick={() => handleStatusClick('sales_status')}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <div>
                <h6 className="project-heading-info text-left fw-bold">Biz Dev</h6>
                <p className="project-description-info fw-light">
                  The BizDev project is used internally by the KIS BizDev team to organize inter-department communication and proposal creation
                </p>
              </div>
              <div className="project-userimg-info">
                {profileImage.slice(0, 8).map((data, i) => (
                  <img
                    src={data.profile_image ? data.profile_image : BlankImage}
                    alt="profile_image"
                    style={{
                      verticalAlign: 'middle',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      marginRight: '5px',
                      marginBottom: '5px',
                    }}
                    key={i}
                  />
                ))}
                {profileImage.length > 8 && <span style={{ fontSize: '12px' }}> + {profileImage.length - 8} more</span>}
              </div>
            </div>
          </div>
          {projects.map((data, i) => (
            <div className="col-md-2 border p-2 m-2 rounded-3" key={i}>
              <div className="position-relative ms-auto">
                <button title="Edit Message" type="button" className="edit_project_btn shadow-none position-absolute end-0 border-0 btn-success close btn-sm mx-1"
                  onClick={(e) =>
                    setShowEditProjectDeatils({
                      open: true,
                      data: {
                        ...data,
                        users: data.users.map((user) => user.id), // Extract only the id values
                      }
                    })
                  }
                  style={{ borderRadius: "5px" }}
                >
                  <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>
                <Link to={{ pathname: `/project/get-project-detail/${data._id}` }} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                  <h6 className="project-heading-info text-left fw-bold">{data.name}</h6>
                  <p className="project-description-info fw-light">
                    {data.description.length > 75 ? data.description.substring(0, 75) + '...' : data.description}
                  </p>
                  <div className="project-userimg-info">
                    {data.users.slice(0, 8).map((data, i) => (
                      <img
                        src={data.profile_image ? data.profile_image : BlankImage}
                        alt="profile_image"
                        style={{
                          verticalAlign: 'middle',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          marginRight: '5px',
                          marginBottom: '5px',
                        }}
                        key={i}
                      />
                    ))}
                    {data.users.length > 8 && <span style={{ fontSize: '12px' }}> + {data.users.length - 7} more</span>}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        {showDialog && <AddProjectModal show={showDialog} onHide={handleClose} callback={getProjects} />}
        {showEditProjectDeatils.open && <EditProjectModal show={showEditProjectDeatils.open} data={showEditProjectDeatils.data} onHide={handleCloseOfEditProjectModal} onUserDelete={handleUserDeletion} callback={getProjects} />}
      </div>
    </>
  );
}

export default ProjectList;
