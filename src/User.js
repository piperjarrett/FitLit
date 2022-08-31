class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.address = userData.address;
    this.email = userData.email;
    this.strideLength = userData.strideLength;
    this.dailyStepGoal = userData.dailyStepGoal;
    this.friends = userData.friends;
  }

  getFirstName() {
    let firstName = this.name.split(" ");
    return firstName[0];
  }

  getSleepDataPerDay(sleepData, date, detail) {
    const usersData = sleepData.filter((entry) => entry.userID === this.id);
    const entry = usersData.find((entry) => entry.date === date);
    return entry[detail];
  }

  getAvgSleepDataPerDay(sleepData, detail) {
    const usersData = sleepData.filter((entry) => entry.userID === this.id);
    if (usersData.length === 0) {
      return 0;
    }
    const totalSleepData = usersData.reduce((total, entry) => {
      total += entry[detail];
      return total;
    }, 0);
    const average = (totalSleepData / usersData.length).toFixed(1);
    return parseFloat(average);
  }

  getAverageFluid(hydrationData) {
    const userHydrationInfo = hydrationData.filter(
      (drink) => drink.userID === this.id
    );
    const average = userHydrationInfo.reduce((total, drink) => {
      total += drink.numOunces;
      return total;
    }, 0);
    let averageOunces = Math.round(average / userHydrationInfo.length);
    return averageOunces;
  }

  getDayFluid(hydrationData, date) {
    const userHydrationInfo = hydrationData.filter(
      (drink) => drink.userID === this.id
    );
    const drink = userHydrationInfo.find((drink) => drink.date === date);
    return drink.numOunces;
  }

  getWeeklyFluids(hydrationData, startDate) {
    const userHydrationInfo = hydrationData.filter(
      (drink) => drink.userID === this.id
    );
    const index = userHydrationInfo.findIndex(
      (drink) => drink.date === startDate
    );
    const weeklyFluids = userHydrationInfo.slice(index, index + 7);
    const ounces = weeklyFluids.reduce((weekObj, entry) => {
      weekObj.push({ date: entry.date, numOunces: entry.numOunces });
      return weekObj;
    }, []);
    return ounces;
  }
}

module.exports = User;
