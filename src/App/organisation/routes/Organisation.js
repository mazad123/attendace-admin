import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { ORGANISATION } from "../../../constants/AppConstants";
import OrganisationChart from "../components/OrganisationChart";

function Organisation() {
  const [values, setValues] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [organisationData, setOrganisationData] = useState("");

  useEffect(() => {
    getUsers();
    getOrganisationData();
  }, []);

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

  const handleSelectedOption = (selectedOption, selector) => {
    // setValues({ ...values, [selector]: selectedOption });
    let children = [];
    if (selector === "parent") {
      const records = organisationData.org_data.find(
        (org) =>  org.parent && selectedOption.value === org.parent.id
      );
      if (records) {
        children = records.children.map((child) => {
          return { label: child.name, value: child.id };
        });
      }
      setValues({ ...values, [selector]: selectedOption, children: children });
    } else {
      setValues({ ...values, [selector]: selectedOption });
    }
  };

  const validation = () => {
    if (!values.parent) return false;
    else return true;
  };

  const manageData = async () => {
    try {
      setLoading(true);
      const valid = validation();
      if (valid) {
        await httpClient.post(ORGANISATION.MANAGE_USERS, values);
        toast.success("Added Successfully");
        setValues({ ...values, children: "" });
        getOrganisationData();
      } else {
        toast.warn("Please select parent and children values.");
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching user detail");
    } finally {
      setLoading(false);
    }
  };

  const getOrganisationData = async () => {
    try {
      setLoading(true);
      const final_result = await httpClient.get(
        ORGANISATION.GET_ORGANISATION_DATA
      );
      setOrganisationData(final_result.data.result);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error in fetching user detail");
    } finally {
      setLoading(false);
    }
  };

  const parentOptions = useMemo(() => {
    const options = users.map((user) => {
      return {
        label: `${user?.user_id?.name} (L${user?.level?.level})`,
        value: user?.user_id?.id,
      };
    });
    return options;
  }, [users]);

  const childOptions = useMemo(() => {
    const parent_level = users.find(
      (user) => user.user_id.id === values?.parent.value
    );

    const options = users
      .filter((user) => user?.level?.level >= parent_level?.level?.level && user?.user_id?.id !== parent_level?.user_id?.id ) //user.level.level >
      .map((user) => {
        return {
          label: `${user?.user_id?.name} (L${user?.level?.level})`,
          value: user?.user_id?.id,
        };
      });
    return options;
  }, [values.parent]);

  return (
    <>
      <div className="main_content_panel">
        <div className="header_title">
          <h1>Organisation</h1>
        </div>
        <div className="row ">
          <div className="col-3 ">
            <div className="dashboard_card">
              <div className="select_role">
                <p>Select Parent</p>
                <Select
                  // defaultValue={values.role}
                  onChange={(e) => handleSelectedOption(e, "parent")}
                  options={parentOptions}
                />
                {/* <small className="text-danger">{error}</small> */}
              </div>
              <div className="select_role">
                <p>Select Child</p>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  value={values?.children}
                  onChange={(e) => handleSelectedOption(e, "children")}
                  options={childOptions}
                />
                {/* <small className="text-danger">{error}</small> */}
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary text-center"
                  onClick={manageData}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="col-9 ">
            <div className="dashboard_card overflow-auto">
              {organisationData && (
                <OrganisationChart data={organisationData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Organisation;
