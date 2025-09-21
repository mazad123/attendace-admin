import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { httpClient } from "../../../constants/Api";
import { REPORTS } from "../../../constants/AppConstants";
import "../../../assets/css/reports.css";
import TodayReport from "../components/TodayReport";
import WeeklyReport from "../components/WeeklyReport";
import MonthlyReport from "../components/MonthlyReport";
import ReportsFilters from "../components/ReportsFilters";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

function Reports() {
  const [dates, setDates] = useState({
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
    active: "today",
  });

  const [isLoading, setLoading] = useState(false);
  const [totalDates, setTotalDates] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [initalValue, setInitialValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("currentMonth");
  const [publicHolidaysDate, setPublicHolidaysDate] = useState([]);

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
        setPublicHolidaysDate(result.data.data.getPublicHolidaysDate);
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
    const { entries, leaves, users } = data;
    const attendance_entries = [];
    entries.map((e) => {
      const previousEntry = attendance_entries.filter(
        (entry) => entry.emp_id === e.user_id.emp_id
      );
      if (previousEntry.length === 0) {
        const obj = {};
        obj["name"] = e.user_id.name;
        obj["emp_id"] = e.user_id.emp_id;
        obj["entry"] = [
          {
            date: e.entry_date,
            type: "P",
          },
        ];

        attendance_entries.push(obj);
      } else {
        const value = {
          date: e.entry_date,
          type: "P",
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


    //leave calculations
    const leaves_data = leaves.filter((data) => data.user_id);
    leaves_data.map((r) => {

      // to calculate leaves

      const calculateLeaves = getDatesBetweenTwoDates(r.from, r.to);
      const filtered_leaves = calculateLeaves.filter((d) => {
        return (
          moment(moment(d.date).format("YYYY-MM-DD")).isSameOrAfter(
            moment(dates.from).format("YYYY-MM-DD")
          ) &&
          moment(moment(d.date).format("YYYY-MM-DD")).isSameOrBefore(
            moment(dates.to).format("YYYY-MM-DD")
          )
        );
      });

      const handleLeaveData = filtered_leaves.map((l) => {
        const previousEntry = attendance_entries.filter((entry) => {
          return entry?.emp_id === r.user_id.emp_id;
        });
        if (previousEntry.length > 0) {
          const checkSameDate = previousEntry[0].entry.filter((dates) => {
            return moment(l.date).isSame(moment(dates.date), "Day");
          });
          if (checkSameDate.length > 0) {
            if (r.status === "absent" || r.duration === "Full Day")
              return;

            const index = previousEntry[0].entry.indexOf(checkSameDate[0]);
            if (index > -1) {
              previousEntry[0].entry.splice(index, 1);
            }
          }

          const obj = {};
          obj["date"] = l.date;
          obj["type"] =
            r.type === "Comp Off"
              ? "Comp Off"
              : r.duration === "Short Day"
                ? "SD"
                : r.duration === "Half Day"
                  ? "HD"
                  : r.status === "absent"
                    ? "A"
                    : "L";
          previousEntry[0].entry.push(obj);

          return previousEntry;
        } else {
          const obj = {};
          obj["name"] = r.user_id.name;
          obj["emp_id"] = r.user_id.emp_id;
          obj["entry"] = [
            {
              date: l.date,
              type:
                r.type === "Comp Off"
                  ? "Comp Off"
                  : r.duration === "Short Day"
                    ? "SD"
                    : r.duration === "Half Day"
                      ? "HD"
                      : r.status === "absent"
                        ? "A"
                        : "L",
            },
          ];

          attendance_entries.push(obj);
        }
      });

      return handleLeaveData;
    });

    const newResult = attendance_entries.map((e) => {
      const sortAttendence = e.entry.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      e.entry = sortAttendence;
      return e;
    });

    let updatedArr = [];
    for(let user of users){
      if(newResult.length > 0){
        newResult.find((item)=>{
          if(user.emp_id===item.emp_id){
            user.entry = item.entry;
          }
          else if(!user.entry){
            user['entry'] = [];
          }
        })
          updatedArr.push(user)
      }else{
        user['entry'] = [];
        updatedArr.push(user);
      }

    }
  
    const sortedData = updatedArr.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    
    // setData(newResult);
    setData(sortedData);
    // setFilteredData(newResult);
    setFilteredData(sortedData);
  };
  const getDatesBetweenTwoDates = (startDate, endDate) => {
    let date = [];
    while (moment(startDate).isSameOrBefore(endDate, "day")) {
      const manageDate = moment(startDate).format("YYYY-MM-DD");
      date.push({ date: manageDate });

      startDate = moment(startDate).add(1, "day").format("YYYY-MM-DD");
    }
    return date;
  };

  const handleDateRange = async (event, picker) => {
    setSelectedOption("dateRange");
    setDates({
      from: moment(picker.startDate).format("YYYY-MM-DD"),
      to: moment(picker.endDate).format("YYYY-MM-DD"),
      active: "monthly",
    });
  };

  const handleInitialValue = (letter) => {
    setInitialValue(letter);
    const result = data.filter((records) => {
      return (
        records.name.charAt(0).toLowerCase().search(letter.toLowerCase()) !== -1
      );
    });
    setFilteredData(result);
    setSearchValue("");
  };

  const handleSearch = (e) => {
    let result = [];
    setSearchValue(e.target.value);

    if (initalValue) {
      result = data.filter((records) => {
        return (
          records.name
            .charAt(0)
            .toLowerCase()
            .search(initalValue.toLowerCase()) !== -1 &&
          records.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
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
  const changeMonthlyStartDate = () => {
    ref.setStartDate(moment().startOf("month"));
    ref.setEndDate(moment().endOf("month"));
  };

  const changeWeeklyStartDate = () => {
    ref.setStartDate(moment().startOf("week").add(1, "day"));
    ref.setEndDate(moment().endOf("week").add(1, "day"));
  };

  const changeTodayStartDate = () => {
    ref.setStartDate(moment());
    ref.setEndDate(moment());
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
            <span>Attendance</span> Reports
          </h1>

          <div className="define_leaves_color align-items-center">
            <ul className="mb-0 ps-0">
              <li>
                Full Day Leave/Comp Off Leave<span className="yellow"></span>
              </li>
              <li>
                Half Day/Short Day <span className="blue"></span>
              </li>
              <li>
                {/* Holiday <span className="green"></span> */}
                Holiday <span className="holidayColor"></span>
              </li>
              <li>
                Absent<span className="red"></span>
              </li>
              <li>
                Present<span className="green"></span>
              </li>
            </ul>
          </div>
        </div>
        <div className="repots_tab">
          <div className="row">
            <div className="col-lg-12">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="tab_btn nav-link active"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="false"
                    onClick={() => {
                      setDates({
                        from: moment(),
                        to: moment(),
                        active: "today",
                      });
                      changeTodayStartDate();
                    }}
                  >
                    Today
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="tab_btn nav-link"
                    id="pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="false"
                    onClick={() => {
                      setDates({
                        from: moment().startOf("week").add(1, "day"),
                        to: moment().endOf("week").add(1, "day"),
                        active: "weekly",
                      });
                      changeWeeklyStartDate();
                    }}
                  >
                    Weekly
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="tab_btn nav-link"
                    id="pills-contact-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-contact"
                    type="button"
                    role="tab"
                    aria-controls="pills-contact"
                    aria-selected="true"
                    onClick={() => {
                      setDates({
                        from: moment().startOf("month").format("YYYY-MM-DD"),
                        to: moment().endOf("month").format("YYYY-MM-DD"),
                        active: "monthly",
                      });
                      changeMonthlyStartDate();
                    }}
                  >
                    Monthly
                  </button>
                </li>
                <li>
                  <DateRangePicker
                    ref={myRef}
                    onApply={handleDateRange}
                    initialSettings={{
                      startDate: moment(),
                      endDate: moment(),
                      maxDate: moment()
                      // active: "picker",
                    }}
                  >
                    <input
                      type="text"
                      className={
                        selectedOption === "currentMonth"
                          ? "btn btn-secondary calender_view me-4 active_btn"
                          : "btn btn-secondary calender_view me-4 "
                      }
                      data-bs-toggle="pill"
                      data-bs-target="#pills-contact"
                      role="tab"
                      aria-controls="pills-contact"
                      aria-selected="true"
                    />
                  </DateRangePicker>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="input-group download_file"></div>
            </div>
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
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              {!isLoading && dates.active === "today" && (
                <TodayReport data={filteredData} getPublicHolidaysDate={publicHolidaysDate} />
              )}
            </div>
            <div
              className="tab-pane fade show active"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              {!isLoading && dates.active === "weekly" && (
                <WeeklyReport data={filteredData} week={totalDates} getPublicHolidaysDate={publicHolidaysDate} />
              )}
            </div>
            <div
              className="tab-pane fade show active"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              {!isLoading && dates.active === "monthly" && (
                <MonthlyReport data={filteredData} month={totalDates} getPublicHolidaysDate={publicHolidaysDate} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;
