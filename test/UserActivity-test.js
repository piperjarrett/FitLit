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
    const result = userActivity.getMinutesActiveByDate("2019/06/15", user);
    expect(result).to.equal(140);
  });
  it("should return 0 if no activity minutes are available for a given date", () => {
    const result = userActivity.getMinutesActiveByDate("2022/08/11", user);
    expect(result).to.equal(0);
  });
  it("should create a method that returns whether a user step goal was reached for a given day", () => {
    const result = userActivity.compareStepGoalByDate("2019/06/15", user);
    expect(result).to.equal(false);
    user = new User(userData[1]);
    userActivity = new UserActivity(
      userActivityTestData.filter((data) => data.userID === 2)
    );
    const resultTwo = userActivity.compareStepGoalByDate("2019/06/26", user);
    expect(resultTwo).to.equal(true);
  });

  it("should have a method to calculate average minutes active for a given week", () => {
    const result = userActivity.getMinutesActiveForWeek("2019/06/21", user);
    expect(result).to.equal(171);
  });

  it("should create a method that finds a users all-time stair climbing record", () => {
    const resultTwo = userActivity.allTimeStairClimbingRecord();
    expect(resultTwo).to.equal(36);
  });

  it("should create a method that finds all days where the user number of steps exceeded their step goal", () => {
    const days = userActivity.allDaysExceedStepGoal(user);
    expect(days).to.deep.equal([
      {
        userID: 1,
        date: '2019/06/17',
        numSteps: 14329,
        minutesActive: 168,
        flightsOfStairs: 18
      },
      {
        userID: 1,
        date: '2019/06/20',
        numSteps: 14478,
        minutesActive: 140,
        flightsOfStairs: 12
      }
    ])
  });

});
