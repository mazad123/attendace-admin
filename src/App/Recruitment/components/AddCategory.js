import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { CANDIDATE } from "../../../constants/AppConstants";

function AddCategory() {
  const [values, setValues] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

  }, []);

  const validation = () => {
    if (!values) return false;
    else return true;
  };

  const manageData = async (e) => {
    try {
      setLoading(true);
      const valid = validation();
      if (valid) {
        await httpClient.post(CANDIDATE.ADD_CATEGORY, { category: values });
        toast.success("Added Successfully");
        setValues("");
        e.preventDefault();
      } else {
        toast.warn("Please select category");
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="main_content_panel">
        <div className="header_title">
          <h1>Add Category</h1>
        </div>
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="dashboard_card">
              <div className="select_role">
                <div className="select_role px-4">
                  <p className="row justify-content-center">Select Category</p>
                  <input
                    className="row justify-content-center m-auto rounded"
                    type="text"
                    value={values}
                    onChange={(e) =>
                      setValues(e.target.value)
                    }
                    required />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary text-center "
                  onClick={manageData}
                >
                  Submit
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
export default AddCategory;
