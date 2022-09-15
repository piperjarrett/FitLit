class UserActivity {
  constructor(userActivityData) {
    this.data = userActivityData;
  }

  getMilesBasedOnSteps(activityDate, user) {
    let userActivity = this.data.filter((data) => data.date === activityDate);
    let numberOfSteps = userActivity.reduce((acc, activity) => {
      acc += activity.numSteps;
      return acc;
    }, 0);
    if (userActivity.length > 0) {
      const numOfStridesForMile = 5280 / user.strideLength;
      const numberOfMilesWalked = numberOfSteps / numOfStridesForMile;
      return parseFloat(numberOfMilesWalked.toFixed(2));
    } else {
      return 0.0;
    }
  }
  getMinutesActiveByDate(activityDate) {
    let userActivity = this.data.filter((data) => data.date === activityDate);
    let activeTime = userActivity.reduce((activeMinutes, activity) => {
      activeMinutes += activity.minutesActive;
      return activeMinutes;
    }, 0);
    if (userActivity.length > 0) {
      return activeTime;
    } else {
      return 0;
    }
  }

  compareStepGoalByDate(activityDate, user) {
    const userActivity = this.data.find((data) => data.date === activityDate);    
      return userActivity.numSteps >= user.dailyStepGoal;
  }

  getMinutesActiveForWeek(endDate) {
    const endDateObj = new Date(endDate);
    const startDate = new Date(endDate);
    startDate(endDateObj.getDate() - 7);
    const weeklyActivityData = this.data.filter((data) => {
      let entryDate = `${startDate.getFullYear()}/${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}/${String(startDate.getDate()).padStart(2, "0")}`;
      return data.date <= endDateObj && data.date > entryDate;
    });
    const sum = weeklyActivityData.reduce((acc, entry) => {
      acc += entry.minutesActive;
      return acc;
    }, 0);
    const averageMinutesActive = Math.round(sum / weeklyActivityData.length);
    return averageMinutesActive;
  }

  //This needs to be updated. I think it's asking for "all dates" they exceeded the goal
  // allDaysExceedingStepGoal(user) {
  //   const daysExceedingStepGoal = this.data.filter(
  //     (activity) => activity.numSteps >= user.dailyStepGoal
  //   );
  // }

  allTimeStairClimbingRecord() {
    const climbingRecord = this.data.sort((a, b) => {
      return b.flightsOfStairs - a.flightsOfStairs;
    });
    const allTimeRecord = climbingRecord.shift();
    return allTimeRecord.flightsOfStairs;
  }
}

export default UserActivity;
