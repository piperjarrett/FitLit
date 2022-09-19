import { expect } from "chai";
import User from "../src/User.js";
import UserActivity from "../src/UserActivity";
const userActivityTestData = require("../src/data/userActivityTestData");
const userData = require("../src/data/UserTestData");

describe("UserActivity", () => {
  let userActivity;
  let user;

  beforeEach(() => {
    userActivity = new UserActivity(
      userActivityTestData.filter((data) => data.userID === 1)
    );
    user = new User(userData[0]);
  });

  it("should return the miles a user has walked based on their number of steps specified by a date (using the strideLength)", () => {
    const result = userActivity.getMilesBasedOnSteps("2019/06/15", user);
    expect(result).to.equal(2.91);
  });
  it("should only calculate miles if step data is available for given date", () => {
    const result = userActivity.getMilesBasedOnSteps("2022/08/11", user);
    expect(result).to.equal(0);
  });
  it("should have a method to calculate how many minutes a user was active for a given date", () => {
    const result = userActivity.getActivityDetailByDate(
      "2019/06/15",
      "minutesActive"
    );
    expect(result).to.equal(140);
  });
  it("should have a method to calculate how many flights of stairs a user climbed for a given date", () => {
    const result = userActivity.getActivityDetailByDate(
      "2019/06/15",
      "flightsOfStairs"
    );
    expect(result).to.equal(16);
  });
  it("should have a method to calculate the number of steps a user has for a given date", () => {
    const result = userActivity.getActivityDetailByDate(
      "2019/06/15",
      "numSteps"
    );
    expect(result).to.equal(3577);
  });
  it("should return 0 if no activity details are available for a given date", () => {
    const minutes = userActivity.getActivityDetailByDate(
      "2022/08/11",
      "minutesActive"
    );
    expect(minutes).to.equal(0);
    const steps = userActivity.getActivityDetailByDate(
      "2022/08/11",
      "numSteps"
    );
    expect(steps).to.equal(0);
    const flights = userActivity.getActivityDetailByDate(
      "2022/08/11",
      "flightsOfStairs"
    );
    expect(flights).to.equal(0);
  });
  it("should have a method that returns whether a user step goal was reached for a given day", () => {
    const result = userActivity.compareStepGoalByDate("2019/06/15", user);
    expect(result).to.equal(false);
    user = new User(userData[1]);
    userActivity = new UserActivity(
      userActivityTestData.filter((data) => data.userID === 2)
    );
    const resultTwo = userActivity.compareStepGoalByDate("2019/06/26", user);
    expect(resultTwo).to.equal(true);
  });

  it("should have a method to get a users daily number of steps for any given week", () => {
    const weeklySteps = userActivity.getActivityDetailForWeek("2019/06/21", "numSteps")
    expect(weeklySteps).to.deep.equal([
      { date: "2019/06/15", numSteps: 3577 },
      { date: "2019/06/16", numSteps: 6637 },
      { date: "2019/06/17", numSteps: 14329 },
      { date: "2019/06/18", numSteps: 4419 },
      { date: "2019/06/19", numSteps: 8429 },
      { date: "2019/06/20", numSteps: 14478 },
      { date: "2019/06/21", numSteps: 6760 },
    ])
  });

  it("should have a method to get a users daily activity minutes for any given week", () => {
    const weeklyMinutes = userActivity.getActivityDetailForWeek("2019/06/21", "minutesActive")
    expect(weeklyMinutes).to.deep.equal([
      { date: "2019/06/15", minutesActive: 140 },
      { date: "2019/06/16", minutesActive: 175 },
      { date: "2019/06/17", minutesActive: 168 },
      { date: "2019/06/18", minutesActive: 165 },
      { date: "2019/06/19", minutesActive: 275 },
      { date: "2019/06/20", minutesActive: 140 },
      { date: "2019/06/21", minutesActive: 135 },
    ])
  });

  it("should have a method to get a users daily activity minutes for any given week", () => {
    const weeklyFlights = userActivity.getActivityDetailForWeek("2019/06/21", "flightsOfStairs")
    expect(weeklyFlights).to.deep.equal([
      { date: "2019/06/15", flightsOfStairs: 16 },
      { date: "2019/06/16", flightsOfStairs: 36 },
      { date: "2019/06/17", flightsOfStairs: 18 },
      { date: "2019/06/18", flightsOfStairs: 33 },
      { date: "2019/06/19", flightsOfStairs: 2 },
      { date: "2019/06/20", flightsOfStairs: 12 },
      { date: "2019/06/21", flightsOfStairs: 6 },
    ])
  });

  it("should return remaining number of steps data per day over a week and 0 for dates with missing activity data", () => {
    let stepsInAWeek = userActivity.getActivityDetailForWeek(
      "2019/06/23",
      "numSteps"
    );
    expect(stepsInAWeek).to.deep.equal([
      { date: "2019/06/17", numSteps: 14329 },
      { date: "2019/06/18", numSteps: 4419 },
      { date: "2019/06/19", numSteps: 8429 },
      { date: "2019/06/20", numSteps: 14478 },
      { date: "2019/06/21", numSteps: 6760 },
      { date: "2019/06/22", numSteps: 0 },
      { date: "2019/06/23", numSteps: 0 },
    ])
  });

  it("should have a method to calculate a users average activity minutes for a given week", () => {
    const minutes = userActivity.getActiveAverageForWeek("2019/06/21", "minutesActive");
    expect(minutes).to.equal(171);
  }); 

  it("should have a method to calculate a users average number of steps for a given week", () => {
    const steps = userActivity.getActiveAverageForWeek("2019/06/21", "numSteps");
    expect(steps).to.equal(8376);
  });

  it("should have a method to calculate a users average flights of stairs climbed for a given week", () => {
    const flights = userActivity.getActiveAverageForWeek("2019/06/21", "flightsOfStairs");
    expect(flights).to.equal(18);
  });

  it("should have a method that finds a users all-time stair climbing record", () => {
    const resultTwo = userActivity.allTimeStairClimbingRecord();
    expect(resultTwo).to.equal(36);
  });

  it("should have a method that finds all days where the user number of steps exceeded their step goal", () => {
    const days = userActivity.allDaysExceedStepGoal(user);
    expect(days).to.deep.equal([
      {
        userID: 1,
        date: "2019/06/17",
        numSteps: 14329,
        minutesActive: 168,
        flightsOfStairs: 18,
      },
      {
        userID: 1,
        date: "2019/06/20",
        numSteps: 14478,
        minutesActive: 140,
        flightsOfStairs: 12,
      },
    ]);
  });
});
