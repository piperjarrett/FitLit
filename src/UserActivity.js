class UserActivity {
  constructor(userActivityData) {
    this.data = userActivityData;
  }

  getMilesBasedOnSteps(activityDate, user) {
    const userActivity = this.data.find((data) => data.date === activityDate);
    if (userActivity) {
      const numOfStridesForMile = 5280 / user.strideLength;
      const numberOfMilesWalked = userActivity.numSteps / numOfStridesForMile;
      return parseFloat(numberOfMilesWalked.toFixed(2));
    } else {
      return 0.0;
    }
  }
  getActivityDetailByDate(activityDate, detail) {
    const userActivity = this.data.find((data) => data.date === activityDate);
    if (userActivity) {
      return userActivity[detail]
    } else {
      return 0
    }
  }

  compareStepGoalByDate(activityDate, user) {
    const userActivity = this.data.find((data) => data.date === activityDate);
    if (userActivity) {
    return userActivity.numSteps >= user.dailyStepGoal;
  } else {
    return false
  }
}

  getActiveAverageForWeek(endDate, detail) {
    const endDateObj = new Date(endDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDateObj.getDate() - 7);
    const weeklyActivityData = this.data.filter((data) => {
      const entryDate = new Date(data.date);
      return entryDate <= endDateObj && entryDate > startDate;
    });
    const sum = weeklyActivityData.reduce((acc, entry) => {
      acc += entry[detail];
      return acc;
    }, 0);
    const averageMinutesActive = Math.round(sum / 7);
    return averageMinutesActive;
  }

  getActivityDetailForWeek(endDate, detail) {
    const endDateObj = new Date(endDate);
    const dayDate = new Date(endDate);
    dayDate.setDate(endDateObj.getDate() - 7);
    let weekActivity = [{}, {}, {}, {}, {}, {}, {}];
    let index = 0;
    weekActivity.forEach(() => {
      dayDate.setDate(dayDate.getDate() + 1);
      let entryDate = `${dayDate.getFullYear()}/${String(
        dayDate.getMonth() + 1
      ).padStart(2, "0")}/${String(dayDate.getDate()).padStart(2, "0")}`;
      let activityEntry = this.data.find((entry) => entry.date === entryDate);
      if (activityEntry) {
        weekActivity[index] = { date: entryDate, [detail]: activityEntry[detail] };
      } else {
        weekActivity[index] = { date: entryDate, [detail]: 0 };
      }
      index++;
    });
    return weekActivity;
  }

  allDaysExceedStepGoal(user) {
    return this.data.filter((data) => data.numSteps > user.dailyStepGoal)
  }

  allTimeStairClimbingRecord() {
    const climbingRecord = this.data.sort((a, b) => {
      return b.flightsOfStairs - a.flightsOfStairs;
    });
    const allTimeRecord = climbingRecord.shift();
    return allTimeRecord.flightsOfStairs;
  }
}

export default UserActivity;
