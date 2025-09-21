import moment from 'moment';
const salarySlipDropdownDates = (joiningDate, selectedYear) => {
  const getYear = parseInt(selectedYear);
  const currentDate = moment();
  const currentYear = moment().year();
  const currentMonth = moment().month();
  const joiningYear = moment(joiningDate).year();
  const joiningMonth = moment(joiningDate).month();
  const monthsSinceJoining = currentDate.diff(joiningDate, 'months');
  const currentDay = currentDate.date();
  const monthsArray = [];

  let startMonth;
  if (joiningYear === currentYear && getYear === currentYear && monthsSinceJoining < 6 && currentDay <= 7) {
      for (let i = 0; i < monthsSinceJoining; i++) {
        startMonth = moment(joiningDate).add(i, 'months');
        if(monthsSinceJoining > 0 && moment(startMonth).month() === currentMonth -1 ) {
          break;
        } 
        monthsArray.push(startMonth.format('MMMM'));
      }
  }else if(joiningYear === currentYear && monthsSinceJoining < 6 && currentDay > 7){
      if(currentMonth!==joiningMonth){
        for (let i = 0; i <= monthsSinceJoining; i++) {
          startMonth = moment(joiningDate).add(i, 'months');
          if(monthsSinceJoining > 0 && moment(startMonth).month() === currentMonth ) {
            break;
          } 
          monthsArray.push(startMonth.format('MMMM'));
        }
      }
  }else {
      if (currentDay <= 7) {
        startMonth = moment(currentDate).subtract(7, 'months');
      } else {
        startMonth = moment(currentDate).subtract(6, 'months');
      }

      for (let i = 0; i < 6; i++) {
        if ((startMonth.year() === currentYear && getYear === currentYear) || startMonth.year() === getYear) {
          monthsArray.push(startMonth.format('MMMM'));
        }
        startMonth.add(1, 'month');
      }
  }
  return monthsArray;
};

export default salarySlipDropdownDates;

