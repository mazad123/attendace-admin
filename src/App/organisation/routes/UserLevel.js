import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { ORGANISATION } from "../../../constants/AppConstants";
import AddEditLevelModal from "../../Employee/components/Modals/AddEditLevelModal";

function UserLevel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [levels, setLevels] = useState([]);
  const [options, setOptions] = useState([]);
  let [searchValue, setSearchValue] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    getUsers();
    handleClose();
    getLevelsData();
    getEmployee();
  }, []);

  const handleClose = () => {
    setShowDialog(false);
    getUsers();
    getEmployee();
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const users = await httpClient.get(ORGANISATION.GET_ALL_USERS);
      setUsers(users.data.result);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching user detail");
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = async () => {
    try {
      setLoading(true);
      let result = [];
      const users = await httpClient.get(ORGANISATION.GET_ALL_EMPLOYEES);
      users.data.result.map((user) => {
        return (result = [
          ...result,
          { label: `${user.name}(${user.designation})`, value: user.id },
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

  const getLevelsData = async () => {
    try {
      setLoading(true);
      let levels = [];
      const getlevels = await httpClient.get(ORGANISATION.GET_LEVELS);
      getlevels.data.result.map((level) => {
        return (levels = [...levels, { label: level.level, value: level._id }]);
      });
      setLevels(levels);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching level data");
      setLoading(false);
    }
  };

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const resetSearch = () => {
    setSearchValue("");
    setSelectedLevel("");
  };

  return (
    <>
      <div className="main_content_panel container">
        <div className="header_title d-block d-lg-flex">
          <h1>
            <span>User's</span> Level
          </h1>
          <div className="text-end">
            <button
              type="button"
              className="btn btn-outline-primary text-center "
              onClick={() => {
                setShowDialog(true);
                setUserToEdit(null);
              }}
            >
              Add User Level
            </button>
          </div>
        </div>
        <div className="table-outer">
          <div className="report_table_main table-inner table-responsive ">
          <div className="user-lable-dropdown d-flex justify-content-end mt-2 gap-3">
            <form onSubmit={handleSearchValue}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={searchValue}
                  onChange={handleSearchValue}
                />
              </div>
            </form>
            
              <div className="form-group">
                <select
                  className="form-control"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            <button
              className="btn btn-primary text-nowrap btn-reset"
              onClick={resetSearch}
            >
              Reset Filter
            </button>
            </div>
            <table className="report_table table table-striped  mb-auto">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Users</th>
                  <th>Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.filter((user) => {
                  const matchesName = user.user_id?.name
                    ?.toLowerCase()
                    .includes(searchValue.toLowerCase());
                  const matchesLevel =
                    selectedLevel === "" || user.level?.level === selectedLevel;
                  return matchesName && matchesLevel;
                }).length > 0 ? (
                  users
                    .filter((user) => {
                      const matchesName = user.user_id?.name
                        ?.toLowerCase()
                        .includes(searchValue.toLowerCase());
                      const matchesLevel =
                        selectedLevel === "" || user.level?.level === selectedLevel;
                      return matchesName && matchesLevel;
                    })
                    .map((user, i) => (
                      <tr key={i}>
                        <td><span className="number">{i + 1}</span></td>
                        <td>{user.user_id.name}</td>
                        <td>{user.level.level}</td>
                        <td>
                          <button
                            className="edit_emp_detail table_btn mx-1"
                            type="button"
                            title="Edit Level"
                            onClick={() => {
                              setShowDialog(true);
                              setUserToEdit(user);
                            }}
                          >
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No record to display
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
            {showDialog && (
              <AddEditLevelModal
                show={showDialog}
                onHide={handleClose}
                selectedUser={userToEdit}
                userLevel={levels}
                userOptions={options}
              // users={users.data?.result}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserLevel;
