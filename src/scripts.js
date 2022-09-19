// Import CSS and Images
import "./css/styles.css";
import "./images/lighting.png";
import "./images/sandals.png";
import "./images/water-bottle.png";
import "./images/logo_transparent.png";
import "./images/avatar-male.png";
import "./images/gym.png";
import "./images/moon.png";
import "./images/sun.svg";

//Import fetch
import { promiseAll } from "./apiCalls.js";

//Import Classes
import User from "./User";
import UserRepository from "./UserRepository";
import HydrationSeries from "./HydrationSeries";
import SleepSeries from "./SleepSeries";
import Chart, { BarController } from "chart.js/auto";
import UserActivity from "./UserActivity";

//Global Variables
let user;
let userRepository;
let allUsers;
let userData;
let hydrationData;
let sleepData;
let activityData;
let dateInput;

// Query Selectors
const userDetails = document.querySelector(".user-card");
const friendsList = document.querySelector(".friends-card");
const stepDetails = document.querySelector(".step-card");
const avgSleepHours = document.querySelector(".average-sleep-hours");
const avgQualitySleep = document.querySelector(".average-quality-sleep");
const sleepForWeek = document.querySelector(".sleep-for-week");
const inputValue = document.querySelector("input");
const submitButton = document.querySelector("button");
const hydraChart = document.querySelector(".hydra-chart");
const stepChart = document.getElementById("stepChart").getContext("2d");
const activityCard = document.querySelector(".activity-card");
const activityChart = document.querySelector(".activity-info");
const changeBackground = document.querySelector(".back-color-button");
const categoriesValue = document.querySelector(".categories-value");

// Event Listeners
window.addEventListener("load", promiseAll);
submitButton.addEventListener("click", () => {
  displaySleepForAWeek();
  displayHydrationForWeek();
  displayActivityForWeek();
  displayUserActivityToday();
  displaySteps();
  displayAllUserActivityToday();
});

function hide(element) {
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

categoriesValue.addEventListener("change", () => {
  const sleepInputs = document.querySelector(".sleep-data-inputs");
  const hydrationInputs = document.querySelector(".hydration-data-inputs");
  const activityInputs = document.querySelector(".activity-data-inputs");
  const dateSelector = document.querySelector(".date-input");
  const selectionLabel = document.querySelector(".selection-label");
  let result = categoriesValue.options[categoriesValue.selectedIndex].text;

  if (result === "Sleep Data") {
    selectionLabel.innerText = "Please Enter Your Sleep Data";
    show(sleepInputs);
    hide(activityInputs);
    hide(hydrationInputs);
    show(dateSelector);
  } else if (result === "Hydration Data") {
    selectionLabel.innerText = "Please Enter Your Hydration Data";
    hide(sleepInputs);
    hide(activityInputs);
    show(hydrationInputs);
    show(dateSelector);
    hide(categoriesValue);
  } else if (result === "Activity Data") {
    selectionLabel.innerText = "Please Enter Your Activity Data";
    hide(sleepInputs);
    show(activityInputs);
    hide(hydrationInputs);
    show(dateSelector);
    hide(categoriesValue);
  } else {
    hide(sleepInputs);
    hide(activityInputs);
    hide(hydrationInputs);
    hide(dateSelector);
    show(categoriesValue);
  }
});

var nextImg = "light";
changeBackground.addEventListener("click", () => {
  const light = document.querySelector(".fit-lit-light");
  let img = ["./images/sun.svg", "./images/moon.png"];
  if (nextImg === "light") {
    light.classList.add("fit-lit-dark");
    changeBackground.src = img[0];
    nextImg = "dark";
  } else {
    light.classList.remove("fit-lit-dark");
    changeBackground.src = img[1];
    nextImg = "light";
  }
});

promiseAll().then((responses) => {
  userData = responses[0];
  hydrationData = responses[1].hydrationData;
  sleepData = responses[2].sleepData;
  activityData = responses[3].activityData;
  user = new User(userData.userData[getRandomIndex(userData.userData)]);
  user.userSleepData = new SleepSeries(
    sleepData.filter((entry) => entry.userID === user.id)
  );
  user.userHydrationData = new HydrationSeries(
    hydrationData.filter((entry) => entry.userID === user.id)
  );
  user.userActivityData = new UserActivity(
    activityData.filter((entry) => entry.userID === user.id)
  );
  allUsers = userData.userData.map((user) => {
    const newUser = new User(user);
    newUser.userSleepData = new SleepSeries(
      sleepData.filter((entry) => {
        entry.userID === newUser.id;
      })
    );
    newUser.userHydrationData = new HydrationSeries(
      hydrationData.filter((entry) => {
        entry.userID === newUser.id;
      })
    );
    newUser.userActivityData = new UserActivity(
      activityData.filter((entry) => {
        entry.userID === newUser.id;
      })
    );
    return newUser;
  });
  userRepository = new UserRepository(allUsers);
  displayDashboard();
});

function getRandomIndex(userData) {
  return Math.floor(Math.random() * userData.length);
}

function displayDashboard() {
  displayUserDetails();
  displayFriends();
  displayAverageSleep();
  displaySleepForAWeek();
  displayHydrationForWeek();
  displaySteps();
  displayUserActivityToday();
  displayAllUserActivityToday();
  displayActivityForWeek();
}

function formatInputDate() {
  dateInput = inputValue.value.split("-").join("/");
}

function displayUserDetails() {
  userDetails.innerHTML = "";
  userDetails.innerHTML += `
    <h3 class="user-name">Hi, ${user.getFirstName()}!</h3>
    <p class="email">Email: ${user.email} </p>
    <p class="address">Address: ${user.address} </p>
    <p class ="stride-length">Stride Length (ft): ${user.strideLength} </p>
    <p class ="step-goal">Daily Step Goal: ${user.dailyStepGoal}</p>`;
}

function displayFriends() {
  friendsList.innerHTML = "";
  const foundFriends = user.friends.map((friend) =>
    userRepository.findUserData(friend)
  );
  const firstNames = foundFriends.map((friend) => friend.getFirstName());
  firstNames.forEach(
    (friend) =>
      (friendsList.innerHTML += `<section class="friend">
    <img class="log-img"
    src="./images/avatar-male.png"
    alt="male avatar"
    height="50px"
    width="50px"
  />
  <section>${friend}</section>
  </section>`)
  );
}

function displayAverageSleep() {
  avgSleepHours.innerHTML += `<p>${user.userSleepData.getAvgSleepDataPerDay(
    "hoursSlept"
  )} hours </p>`;
  avgQualitySleep.innerHTML += `<p>${user.userSleepData.getAvgSleepDataPerDay(
    "sleepQuality"
  )}</p>`;
}

function displaySleepForAWeek() {
  formatInputDate();
  const sleepInAWeek = user.userSleepData
    .getSleepPerDayForWeek(dateInput, "hoursSlept")
    .reverse();
  const sleepQualityInAWeek = user.userSleepData
    .getSleepPerDayForWeek(dateInput, "sleepQuality")
    .reverse();
  sleepForWeek.innerHTML = `<table class="sleep-data">
  <tr>
    <td class="sleep-data">Date</td>
    <td class="sleep-data">Sleep Hours</td>
    <td class="sleep-data">Quality of Sleep</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[0].date}</td>
    <td class="sleep-data">${sleepInAWeek[0].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[0].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[1].date}</td>
    <td class="sleep-data">${sleepInAWeek[1].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[1].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[2].date}</td>
    <td class="sleep-data">${sleepInAWeek[2].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[2].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[3].date}</td>
    <td class="sleep-data">${sleepInAWeek[3].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[3].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[4].date}</td>
    <td class="sleep-data">${sleepInAWeek[4].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[4].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[5].date}</td>
    <td class="sleep-data">${sleepInAWeek[5].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[5].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[6].date}</td>
    <td class="sleep-data">${sleepInAWeek[6].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[6].sleepQuality}</td>
  </tr>
</table>
  `;
}

function displayHydrationForWeek() {
  formatInputDate();
  const hydrationWeek = user.userHydrationData
    .getWeeklyFluids(dateInput)
    .reverse();
  if (hydrationWeek.length >= 6) {
    hydraChart.innerHTML = `
  <table class="hydra-data">
  <tr>
    <td class ="hydra-data">Date</td>
    <td class ="hydra-data">Fluids (oz)</td>
  </tr>
  <tr>
    <td class="hydra-data">${hydrationWeek[0].date}</td>
    <td class="hydra-data">${hydrationWeek[0].numOunces}</td>
  </tr>
  <tr>
    <td class="hydra-data">${hydrationWeek[1].date}</td>
    <td class="hydra-data">${hydrationWeek[1].numOunces}</td>
  </tr>
  <tr>
    <td class="hydra-data">${hydrationWeek[2].date}</td>
    <td class="hydra-data">${hydrationWeek[2].numOunces}</td>
  </tr>
  <tr>
    <td class="hydra-data">${hydrationWeek[3].date}</td>
    <td class="hydra-data">${hydrationWeek[3].numOunces}</td>
  </tr>
    <tr>
    <td class="hydra-data">${hydrationWeek[4].date}</td>
    <td class="hydra-data">${hydrationWeek[4].numOunces}</td>
  </tr>
  <tr>
    <td class="hydra-data">${hydrationWeek[5].date}</td>
    <td class="hydra-data">${hydrationWeek[5].numOunces}</td>
  </tr>
  <tr>
    <td class="hydra-data">${hydrationWeek[6].date}</td>
    <td class="hydra-data">${hydrationWeek[6].numOunces}</td>
  </tr>
</table>`;
  } else {
    hydraChart.innerHTML = `<p> There Is Not Enough Data To Display For This Week. Please Select
    A Different Week To See Your Weekly Report <p>`;
  }
}

function displaySteps() {
  stepDetails.innerHTML = "";
  const averageSteps = userRepository.findAverageStepGoal();
  const comparison = Math.round((user.dailyStepGoal / averageSteps) * 100);
  Chart.defaults.color = "white";
  let myChart = new Chart(stepChart, {
    type: "bar",
    data: {
      labels: ["Your Goal", "Average User Goal"],
      datasets: [
        {
          data: [user.dailyStepGoal, averageSteps],
          backgroundColor: ["#2CB7FF", "#6947FF"],
          borderWidth: 1,
          borderColor: "white",
          hoverBorderWidth: 3,
          hoverBorderColor: "black",
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Your Step Goal vs. Average User Step Goal",
          fontSize: 20,
        },
        legend: {
          display: false,
        },
      },
    },
  });
  stepDetails.innerHTML += `<p class=chart-text>Your daily step goal is ${comparison}% compared to all average users.</p>`;
}

function displayUserActivityToday() {
  formatInputDate();
  activityCard.innerHTML = "";
  const milesWalked = user.userActivityData.getMilesBasedOnSteps(
    dateInput,
    user
  );
  const numberOfSteps = user.userActivityData.getActivityDetailByDate(
    dateInput,
    "numSteps"
  );
  const minsActive = user.userActivityData.getActivityDetailByDate(
    dateInput,
    "minutesActive"
  );
  const stepGoalCompare = user.userActivityData.compareStepGoalByDate(dateInput, user)
  let stepGoalMessage = null
  if(stepGoalCompare) {
    stepGoalMessage = 'met'
  } else {
    stepGoalMessage = 'not met'
  }
  if (numberOfSteps) {
    activityCard.innerHTML += `<h3>Today on ${dateInput}:</h3>
    <p>You walked ${milesWalked} miles, took ${numberOfSteps} steps, and were active for ${minsActive} minutes. Your step goal was ${stepGoalMessage}.`;
  } else {
    activityCard.innerHTML += `<h3>There is no user data for ${dateInput}</h3>
    <p>Please choose a different date</p>`;
  }
}

function displayAllUserActivityToday() {
  formatInputDate();
  const allNumSteps = userRepository.findAverageActivityDetail(
    activityData,
    dateInput,
    "numSteps"
  );
  const allFlightsOfStairs = userRepository.findAverageActivityDetail(
    activityData,
    dateInput,
    "flightsOfStairs"
  );
  const allMinutesActive = userRepository.findAverageActivityDetail(
    activityData,
    dateInput,
    "minutesActive"
  );
  if (allNumSteps) {
    activityCard.innerHTML += `<p>Average for all users today: ${allNumSteps} steps, 
  ${allMinutesActive} activity minutes, and ${allFlightsOfStairs} flights climbed.</p>`;
  } else {
    activityCard.innerHTML += `<h3>There is no community data for ${dateInput}</h3>
  <p>Please choose a different date</p>`;
  }
}

function displayActivityForWeek() {
  formatInputDate();
  const minutesActiveWeek = user.userActivityData
    .getActivityDetailForWeek(dateInput, "minutesActive")
    .reverse();
  const numStepsWeek = user.userActivityData
    .getActivityDetailForWeek(dateInput, "numSteps")
    .reverse();
  const flightsOfStairsWeek = user.userActivityData
    .getActivityDetailForWeek(dateInput, "flightsOfStairs")
    .reverse();
  const averageMinutes = user.userActivityData.getActiveAverageForWeek(dateInput, "minutesActive" )
  const averageFlights = user.userActivityData.getActiveAverageForWeek(dateInput, "flightsOfStairs")
  const averageSteps = user.userActivityData.getActiveAverageForWeek(dateInput, "numSteps" )
  activityChart.innerHTML = `
    <table class="activity-data">
    <tr>
      <td class ="activity-data">Date</td>
      <td class ="activity-data">#Steps</td>
      <td class ="activity-data">Minutes Active</td>
      <td class ="activity-data">Flights Climbed</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[0].date}</td>
      <td class="activity-data">${numStepsWeek[0].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[0].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[0].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[1].date}</td>
      <td class="activity-data">${numStepsWeek[1].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[1].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[1].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[2].date}</td>
      <td class="activity-data">${numStepsWeek[2].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[2].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[2].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[3].date}</td>
      <td class="activity-data">${numStepsWeek[3].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[3].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[3].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[4].date}</td>
      <td class="activity-data">${numStepsWeek[4].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[4].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[4].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[5].date}</td>
      <td class="activity-data">${numStepsWeek[5].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[5].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[5].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">${minutesActiveWeek[6].date}</td>
      <td class="activity-data">${numStepsWeek[6].numSteps}</td>
      <td class="activity-data">${minutesActiveWeek[6].minutesActive}</td>
      <td class="activity-data">${flightsOfStairsWeek[6].flightsOfStairs}</td>
    </tr>
    <tr>
      <td class="activity-data">Weekly Average</td>
      <td class="activity-data">${averageSteps}</td>
      <td class="activity-data">${averageMinutes}</td>
      <td class="activity-data">${averageFlights}</td>
    </tr>
  </table>`;
}
