import { expect } from "chai";
import User from "../src/User";
const userTestData = require("../src/data/userTestData");
const sleepTestData  = require("../src/data/sleepTestData");

describe("User", () => {
let user;

  beforeEach(() => {
    user = new User(userTestData[0]);
  });

  it("should have a parameter to take in a userData object", () => {
    expect(userTestData[0]).to.be.an("object");
  });

  it("should have an id", () => {
    expect(user.id).to.equal(1)
  });

  it("should have a name", () => {
    expect(user.name).to.equal("Luisa Hane")
  });

  it('should have an address', ()=>{
    expect(user.address).to.equal("15195 Nakia Tunnel, Erdmanport VA 19901-1697")
  })

  it("should have a email", () => {
    expect(user.email).to.equal("Diana.Hayes1@hotmail.com")
  });

  it("should have a stride length", () => {
    expect(user.strideLength).to.equal(4.3)
  });

  it("should have a daily step goal", () => {
    expect(user.dailyStepGoal).to.equal(10000)
  });

  it("should have array of friend user IDs", ()=>{
    expect(user.friends).to.deep.equal([
      16,
      4,
      8
      ])
  });

  it("should have have a method that returns users first name only", () => {
    let firstName = user.getFirstName()
    expect(firstName).to.equal("Luisa")
  });

  it("should have a method to return a users number of hours slept on a specific date", () => {
    expect(user.getSleepDataPerDay(sleepTestData, "2019/06/15", "hoursSlept")).to.equal(6.1)
  });

  it("should have a method to return the users sleep quality on a specific date", () => {
    expect(user.getSleepDataPerDay(sleepTestData, "2019/06/15", "sleepQuality")).to.equal(2.2)
  });

  it("should have a method to return the average number of hours slept per day for a user", () => {
    let average = user.getAvgSleepDataPerDay(sleepTestData, "hoursSlept")
    expect(average).to.equal(7.9)
  });

  it("should have a method to return the average sleep quality per day for a user", () => {
    let average = user.getAvgSleepDataPerDay(sleepTestData, "sleepQuality")
    expect(average).to.equal(2.7)
  });

  it("should return a zero value for avg sleep details if user ID does not have sleep data", () => {
    let fakeUser = new User({
      id: 60,
      name: "Luisa Hane",
      address: "15195 Nakia Tunnel, Erdmanport VA 19901-1697",
      email: "Diana.Hayes1@hotmail.com",
      strideLength: 4.3,
      dailyStepGoal: 10000,
      friends: [16, 4, 8],
    });
    expect(fakeUser.getAvgSleepDataPerDay(sleepTestData, "sleepQuality")).to.equal(0)
    expect(fakeUser.getAvgSleepDataPerDay(sleepTestData, "hoursSlept")).to.equal(0)
  })
});
