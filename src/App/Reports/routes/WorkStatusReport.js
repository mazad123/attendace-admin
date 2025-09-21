import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { httpClient } from "../../../constants/Api";
import { REPORTS } from "../../../constants/AppConstants";
import "../../../assets/css/reports.css";
import WorkStatus from "../components/WorkStatus";
import ReportsFilters from "../components/ReportsFilters";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

function WorkStatusReport() {
  const [dates, setDates] = useState({
    from: moment().startOf("month").format("L"),
    to: moment().endOf("month").format("L"),
    active: "monthly",
  });

  const [isLoading, setLoading] = useState(false);
  const [totalDates, setTotalDates] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [initalValue, setInitialValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("currentMonth");
  useEffect(() => {
    getReportData();
    const total_dates = getDatesBetweenTwoDates(dates.from, dates.to);
    setTotalDates(total_dates);
  }, [dates]);

  const getReportData = async () => {
    try {
      setLoading(true);
      const result = await httpClient.post(REPORTS.GET_REPORTS_DATA, {
        from: dates.from,
        to: dates.to,
      });
      if (result.status === 200) {
        resetFilters();
        handleData(result.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // attendance calculations
  const handleData = (data) => {
    const {entries} = data;
    const attendance_entries = [];
    entries.map((e) => {
      const previousEntry = attendance_entries.filter(
        (entry) => entry.emp_id === e.user_id.emp_id
      );
      if (previousEntry.length === 0) {
        const obj = {};
        obj["name"] = e?.user_id?.name;
        obj["emp_id"] = e?.user_id?.emp_id;
        obj["entry"] = [
          {
            date: e.entry_date,
            work_from:
              e.work_from === "office"
                ? "WFO"
                : e.work_from === "home"
                  ? "WFH"
                  : e.work_from === "-"
                    ? "-"
                    : "-",
          },
        ];
        attendance_entries.push(obj);
      } else {
        const value = {
          date: e.entry_date,
          work_from:
            e.work_from === "office"
              ? "WFO"
              : e.work_from === "home"
                ? "WFH"
                : e.work_from === "-"
                  ? "-"
                  : "-",
        };
        if (previousEntry.length > 0) {
          const checkSameDate = previousEntry[0].entry.filter((dates) => {
            return moment(e.entry_date).isSame(moment(dates.date), "Date");
          });
          if (checkSameDate.length > 0) {
            const index = previousEntry[0].entry.indexOf(checkSameDate[0]);
            if (index > -1) {
              previousEntry[0].entry.splice(index, 1);
            }
          }
          previousEntry[0].entry.push(value);
        }
      }
      return previousEntry;
    });

    const newResult = attendance_entries.map((e) => {
      const sortAttendence = e.entry.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      e.entry = sortAttendence;
      return e;
    });
    const new_result = newResult.sort((a, b) => a.name.localeCompare(b.name))
    setData(new_result);
    setFilteredData(new_result);
  };

  const getDatesBetweenTwoDates = (startDate, endDate) => {
    let date = [];
    while (moment(startDate).isSameOrBefore(endDate, "day")) {
      const manageDate = moment(startDate).format("YYYY-MM-DD");
      // if (moment(startDate).isSame(endDate, "month")) {

      date.push({ date: manageDate });
      // }
      startDate = moment(startDate).add(1, "day").format("YYYY-MM-DD");
    }
    return date;
  };

  const handleDateRange = async (event, picker) => {
    setSelectedOption("dateRange");
    setDates({
      from: moment(picker.startDate).format("l"),
      to: moment(picker.endDate).format("l"),
      active: "monthly",
    });
  }; 

  const handleInitialValue = (letter) => {
    setInitialValue(letter);
    const result = data.filter((records) => {
      return (
        records.name.charAt(0).toLowerCase().search(letter.toLowerCase()) !==
        -1
      );
    });
    setFilteredData(result);
    setSearchValue("")
  };


  const handleSearch = (e) => {
    let result = []
    setSearchValue(e.target.value);

    if (initalValue) {
      result = data.filter((records) => {
        return (records.name.charAt(0).toLowerCase().search(initalValue.toLowerCase()) !==
          -1 && records.name
            .toLowerCase()
            .includes(e.target.value.toLowerCase()))
      });
    } else {
      result = data.filter((records) => {
        return records.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }
    setFilteredData(result);
  };

  const myRef = useRef();
  const ref = myRef.current;
    const changeStartDate = () => {
      ref.setStartDate(moment().startOf("month"));
      ref.setEndDate(moment().endOf("month"));
    };

  const resetFilters = () => {
    setSearchValue("");
    setInitialValue("");
    setFilteredData(data);
  };


  return (
    <>
      <div className="main_content_panel container">
        <div className="header_title d-block d-lg-flex">
          <h1>
            <span>Work Status</span> Reports
          </h1>
        </div>
        <div className="repots_tab">
          <div className="row">
            <div className="col-lg-6">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    id="pills-contact-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-contact"
                    type="button"
                    role="tab"
                    aria-controls="pills-contact"
                    aria-selected="false"
                    className={
                      selectedOption === "currentMonth"
                        ? "btn btn-secondary calender_view me-4 active_btn"
                        : "btn btn-secondary calender_view me-4 "
                    }
                    onClick={() =>{
                      setDates({
                        from: moment().startOf("month").format("YYYY-MM-DD"),
                        to: moment().endOf("month").format("YYYY-MM-DD"),
                        active: "monthly",
                      });
                      changeStartDate();
                    }}
                   
                  >
                    <i className="fa fa-calendar-o me-2" aria-hidden="true"></i>
                    Current Month
                  </button>
                </li>
                <DateRangePicker ref={myRef}
                onApply={handleDateRange}
                initialSettings={{
                  startDate: dates.from,
                  endDate: dates.to,
                }}
                >
                <input type="text"   className={
                  selectedOption === "dateRange"
                    ? "btn btn-secondary calender_view me-4 active_btn"
                    : "btn btn-secondary calender_view me-4"
                } />
                </DateRangePicker>
              </ul>
            </div>
            <div className="col-lg-6"></div>
          </div>

          <div className="filter_letters pt-3 rounded mt-2">
            <ReportsFilters
              searchValue={searchValue}
              handleSearch={handleSearch}
              handleInitialValue={handleInitialValue}
              initalValue={initalValue}
              resetFilters={resetFilters}
            />
          </div>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              {!isLoading && dates.active === "monthly" && (
                <WorkStatus data={filteredData} month={totalDates} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WorkStatusReport;
