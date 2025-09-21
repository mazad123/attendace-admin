import moment from "moment";
import React, { useState, useEffect, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import ReactExport from "react-export-excel";
import { toast } from "react-toastify";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function WorkStatusReport({ data, month }) {
  const [monthlyReports, setMonthlyReports] = useState([]);

  const [arr, setArr] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  useEffect(() => {
    handleMonthlyData();
    setArr([])
    setCheckAll(false)
  }, [data, month]);
  const handleMonthlyData = () => {
    const saturday = getSaturdays();
    const sunday = getSundays();
    const weekEnds = [...saturday, ...sunday];
    const addHolidays = data.map((e) => {
      weekEnds.map((s) => {
        const checkSameDate = e.entry.filter((entry) =>
          moment(entry.date).isSame(s.date, "day")
        );
        if (checkSameDate.length <= 0) {
          e.entry.push(s);
        }
      });
      return e;
    });
    const fitlerMonthDates = addHolidays.map((d) => {
      const alpha = month.map((m) => {
        const previousEntry = d.entry.filter((entry) =>
          moment(m.date).isSame(entry.date, "day")
        );
        if (previousEntry.length === 0) {
          d.entry.push({ date: m.date, work_from: "-" });
        }
        return d.entry;
      });
      return d;
    });

    const newResult = fitlerMonthDates.map((e) => {
      const sortAttendence = e.entry.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      e.entry = sortAttendence;
      return e;
    });

    setMonthlyReports(newResult);
  };


  const handleOnChange =  (arr1) => {
    const arr2 = [...arr];
    if (arr2.indexOf(arr1) === -1) {
      arr2.push(arr1);
    } else {
      const index = arr2.indexOf(arr1);
      if (index > -1) {
        arr2.splice(index, 1);
      }
    }
    const arr3 = arr2.sort((a, b) => a?.name?.localeCompare(b?.name))
     setArr(arr3);
  };
  const handleChecked = (id) => {
    const checkbox = arr.filter((e) => e.emp_id === id);
    if (checkbox.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleCheckALL = (e) => {
    if (e.target.checked) {
      setCheckAll(true)
      const Data = data.sort((a, b) => a.name.localeCompare(b.name));
      setArr(Data);
    } else {
      setCheckAll(false)
      setArr([]);
    }
  };

  const handleSort = () => {
    const entries = [...monthlyReports];
    entries.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    setMonthlyReports(entries);
  };
  const handleDesort = () => {
    const entries = [...monthlyReports];
    entries.sort(function (a, b) {
      return b.name.localeCompare(a.name);
    });
    setMonthlyReports(entries);
  };

  const getSundays = () => {
    const totalSundays = [];
    var start = moment(),
      end = moment(),
      day = 0;

    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
      result.push(current.clone());
    }
    result.map((m) => m.format("LLLL"));

    return totalSundays;
  };

  const getSaturdays = () => {
    const totalSaturdays = [];
    var start = moment(),
      end = moment(),
      day = 0;

    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
      result.push(current.clone());
    }
    result.map((m) => m.format("LLLL"));

    return totalSaturdays;
  };
  return (
    <>
      {!arr.length ? (
        <button
          onClick={() => toast.warn("Please check the checkbox to download the sheet")}
          // disabled={true}
          className="btn btn-primary mt-3 mb-3"
        >
          Download as XLS
        </button>
      ) : (
        <ExcelFile
          element={
            <button className="btn btn-primary mt-3 mb-3">
              Download as XLS
            </button>
          }
          filename="Work Status Report"
        >
          <ExcelSheet data={arr} name="Work Status Report">
            <ExcelColumn label="Name" value="name" />
            {arr[0] &&
              arr[0].entry.map((data, i) => (
                <ExcelColumn
                  label={moment(data.date).format("YYYY/MM/DD")}
                  value={(dat) =>
                    dat.entry[i].work_from === "WFH"
                      ? "WFH"
                      : dat.entry[i].work_from === "WFO"
                        ? "WFO"
                        : dat.entry[i].type === "-"
                          ? "-"
                          : "-"
                  }
                />
              ))}
          </ExcelSheet>
        </ExcelFile>
      )}
      <div className="table-outer">
        <div className="report_table_main table-inner table-responsive">
          <table
            // id="monthly"
            className="report_table table table-striped  mb-auto w-auto"
          >
            <thead>
              <tr>
                <th>
                  {" "}
                  <input
                    type="checkbox"
                    checked={checkAll}
                    // checked={handleChecked(data.emp_id)}
                    onChange={(e) => handleCheckALL(e)}
                  />
                </th>
                <th>#</th>
                <th>
                  Name{" "}
                  <span>
                    <FontAwesomeIcon
                      icon={faChevronCircleUp}
                      style={{ cursor: "pointer" }}
                      onClick={handleSort}
                    />
                    <FontAwesomeIcon
                      icon={faChevronCircleDown}
                      style={{ cursor: "pointer" }}
                      onClick={handleDesort}
                    />
                  </span>
                </th>
                {month.map((m, i) => (
                  <th key={i}>{moment(m.date).format("YYYY/MM/DD")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyReports.map((d, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={handleChecked(d.emp_id)}
                      onChange={(e) => handleOnChange(d)}
                    />
                  </td>

                  <td>
                    {" "}
                    <span className="number">{i + 1}</span>
                  </td>

                  <td>{d.name}</td>

                  {d.entry.map((a, i) => (
                    <td key={i}>{a.work_from}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length <= 0 && (
            <div className="d-flex justify-content-center">
              <h5>No Records to Display.</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(WorkStatusReport);
