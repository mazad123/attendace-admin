import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { httpClient } from "../../constants/Api";
import { PROJECT } from "../../constants/AppConstants";
import AddProjectModal from "./Modals/AddProjectModal";
import BlankImage from "../../assets/images/dummy_profile.jpeg"
import { useParams } from "react-router-dom";

function ProjectList() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    getProjects();
    getEmployees();
    handleClose();
  }, []);

  const handleClose = () => {
    setShowDialog(false);
    getProjects();
  };

  const getProjects = async () => {
    try {
        const res = await httpClient
            .get(PROJECT.GET_USER_PROJECTS.replace("{userId}", userId));
        if (res.status === 200) {
          setProjects(res.data.result);
        }
    } catch (err) {
        if (err.response) {
            toast.error(err.response.data.message);
        } else {
            toast.error("Something went wrong");
        }
    }
};

  const getEmployees = async () => {
    try {
        setLoading(true);
        let result = [];
        const users = await httpClient.get(PROJECT.GET_ALL_EMPLOYEES);
        users.data.result.map((user) => {
            return (result = [
                ...result,
                { label: `${user.name}`, value: user.id , profile_image : user.profile_image},
            ]);
        });
        setOptions(result);
    } catch (err) {
        if (err.response) toast.error(err.response.data.message);
        else toast.error("Error in fetching user detail");
    } finally {
        setLoading(false);
    }
};
  return (
    <>
      {" "}
      <div className="main_content_panel container">
        <div className="header_title d-block d-lg-flex">
          <h1>
            <span>User Projects</span>
          </h1>
          <div className="mt-5 text-end">
          </div>
        </div>
        <div className="row cus-row-wrap">
          <div className="col-md-2 border p-2 m-2 rounded-3" >
          <Link to={{ pathname: `/project/user-updates/${userId}`}} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            <h6 className="project-heading-info text-left fw-bold">KIS</h6>
            <p className="project-description-info fw-light">DESCRIPTION</p>
            <div className="project-userimg-info">
            {options.slice(0, 8).map((data, i) => (<img src={data.profile_image ? data.profile_image : BlankImage} alt="profile_image" style={{
              verticalAlign: "middle",
              width: "30px",
              height: "30px",
              borderRadius: "50%", marginRight: "5px", marginBottom: "5px"
            }} key={i}/>))}
            {options.length > 8 && <span style={{ fontSize: '12px' }}> + {options.length - 7} more</span>}
            </div>
            </Link>
          </div>
          {projects.map((data, i) => (
            <div className="col-md-2 border p-2 m-2 rounded-3" key={i}>
            <Link to={{ pathname: `/project/user-projects-updates/${userId}` }} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
              <h6 className="project-heading-info text-left fw-bold">{data.name}</h6>
              <p className="project-description-info fw-light">{data.description.length >75?(data.description).substring(0, 75) + "...":(data.description)}</p>
              <div className="project-userimg-info">
                {data.users.slice(0, 8).map((data, i) => (<img src={data.profile_image ? data.profile_image : BlankImage} alt="profile_image" style={{
                  verticalAlign: "middle",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%", marginRight: "5px", marginBottom: "5px"
                }} key={i}/>))}
                {data.users.length > 8 && <span style={{ fontSize: '12px' }}> + {data.users.length - 7} more</span>}
              </div>
              </Link>
            </div>))}

        </div>
        {showDialog && (
          <AddProjectModal
            show={showDialog}
            onHide={handleClose}
          />
        )}
      </div>
    </>
  );
}

export default ProjectList;
