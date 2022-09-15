class UserRepository {
  constructor(data) {
    this.allUserData = data;
  }

  findUserData(id) {
    const userData = this.allUserData.find((data) => data.id === id);
    return userData;
  }

  findAverageStepGoal() {
    const userSteps = this.allUserData.map((user) => user.dailyStepGoal);
    const allUserSteps = userSteps.reduce((total, userStep) => {
      total += userStep;
      return total;
    }, 0);
    const averageSteps = Math.round(allUserSteps / this.allUserData.length);
    return averageSteps
  }

  findAverageSleepDetail(sleepData, detail) {
    const userSleepDetail= sleepData.map(user => user[detail])
    const allUserSleepDetail = userSleepDetail.reduce((total, user) => {
      total += user
      return total
    }, 0)
    const averageSleepDetail = (allUserSleepDetail/ sleepData.length).toFixed(1)
    return parseFloat(averageSleepDetail)
  }

  findAverageActivityDetail(activityData, detail) {
    const userActivityDetail= activityData.map(user => user[detail])
    const allUserActivityDetail = userActivityDetail.reduce((total, user) => {
      total += user
      return total
    }, 0)
    const averageActivityDetail = (allUserActivityDetail/ activityData.length)
    return Math.round(averageActivityDetail)
  }

}
export default UserRepository;
