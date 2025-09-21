import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TotalEmployee from "../components/TotalEmployee";
import PresentEmployee from "../components/PresentEmployee";
import AbsentEmployee from "../components/AbsentEmployee";
// import AddEmployee from "../components/AddEmployee";
import ListEmployee from "../components/ListEmployee";
import OnLeaveEmployee from "../components/OnLeaveEmployee";
import UnCheckedEmployees from "../components/UnCheckedEmployees";
import UnCheckedEmployeeList from "../components/UnCheckedEmployeeList";
import WorkFromHomeEmployees from "../components/WorkFromHomeEmployees";
import WfhEmployeeList from "../components/WfhEmployeeList";
import { httpClient } from "../../../constants/Api";
import { COUNT } from "../../../constants/AppConstants";
import SalesProject from "../../../Project/components/ProjectList";

function Dashboard() {
  const userDetail = useSelector((state) => state.user.user.user);
  const [showList, setShowList] = useState({
    presentEmployees: true,
    absentEmployees: false,
    uncheckedEmployees: false,
    wfhEmployees: false,
  });
  const [renderList, setRenderList] = useState(true);

  const [count, setCount] = useState("");

  useEffect(() => {
    const getCount = async () => {
      await httpClient
        .get(COUNT.GET_COUNT)
        .then((res) => {
          if (res.status === 200) {
            setCount(res.data.result);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
    };
    getCount();
  }, [showList]);

  const handlePresentEmployeeList = () => {
    setShowList({
      presentEmployees: true,
      absentEmployees: false,
      uncheckedEmployees: false,
      wfhEmployees: false,
    });
    setRenderList(!renderList);
  };
  const handleAbsentEmployeeList = () => {
    setShowList({
      presentEmployees: false,
      absentEmployees: true,
      uncheckedEmployees: false,
      wfhEmployees: false,
    });
    setRenderList(!renderList);
  };
  const handleUnCheckedEmployeeList = () => {
    setShowList({
      presentEmployees: false,
      absentEmployees: false,
      uncheckedEmployees: true,
      wfhEmployees: false,
    });
    setRenderList(!renderList);
  };

  const handleWfhEmployeeList = () => {
    setShowList({
      presentEmployees: false,
      absentEmployees: false,
      uncheckedEmployees: false,
      wfhEmployees: true,
    });
    setRenderList(!renderList);
  };

  return (
    <>
      <div className="main_content_panel">
        <div className="header_title container">
          <h1>
            <span>Welcome</span> {userDetail.name}
          </h1>
        </div>
        {(userDetail.role.role === "Super Admin" ||
        userDetail.role.role === "HR" ) && ( <div className="row g-2">
          <TotalEmployee totalCount={count} />
          <PresentEmployee
            presentEmployees={handlePresentEmployeeList}
            presentCount={count}
          />
          <AbsentEmployee
            onLeave={handleAbsentEmployeeList}
            leaveCount={count}
          />
          <UnCheckedEmployees
            unChecked={handleUnCheckedEmployeeList}
            unCheckedCount={count}
          />
          {/* <WorkFromHomeEmployees
            wfhEmployees={handleWfhEmployeeList}
            WorkFromHomeCount={count}
          /> */}
          {showList.presentEmployees && (
            <ListEmployee renderList={renderList} />
          )}
          {showList.absentEmployees && (
            <OnLeaveEmployee renderList={renderList} />
          )}
          {showList.uncheckedEmployees && (
            <UnCheckedEmployeeList renderList={renderList} />
          )}
          {/* {showList.wfhEmployees && (
            <WfhEmployeeList renderList={renderList} />
          )} */}
        </div>)}
        {(userDetail.role.role === "Sales" ) && ( <SalesProject/>)}
      </div>
    </>
  );
}

export default Dashboard;
