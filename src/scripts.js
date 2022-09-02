// Import CSS and Images
import "./css/styles.css";
import "./images/lighting.png";
import "./images/sandals.png";
import "./images/water-bottle.png";
import "./images/logo_transparent.png";
import "./images/avatar-male.png";
//Import fetch
import { promiseAll } from "./apiCalls.js";
//Import Classes
import User from "./User";
import UserRepository from "./UserRepository";
import Chart from "chart.js/auto";

//Global Variables
let user;
let userRepository;
let allUsers;
let userData;
let hydrationData;
let sleepData;
// Query Selectors
const userDetails = document.querySelector(".user-card");
const friendsList = document.querySelector(".friends-card");
const stepDetails = document.querySelector(".step-card");
const avgSleepHours = document.querySelector(".average-sleep-hours");
const avgQualitySleep = document.querySelector(".average-quality-sleep");
const sleepForDay = document.querySelector(".date-sleep-data");
const sleepForWeek = document.querySelector(".sleep-for-week");
const inputValue = document.querySelector("input");
const submitButton = document.querySelector("button");
const dataForDay = document.querySelector(".table-data");
const hydraData = document.querySelector(".hydration-card");
const chart = document.querySelector(".hydra-chart");
// EVent Listeners
window.addEventListener("load", promiseAll);
//submitButton.addEventListener("click", displaySleepForSpecificDay);
submitButton.addEventListener("click", () => {
  displaySleepForAWeek();
  displaySleepForSpecificDay();
  displayHydrationForWeek();
});

promiseAll().then((responses) => {
  userData = responses[0];
  user = new User(userData.userData[getRandomIndex(userData.userData)]);
  allUsers = userData.userData.map((user) => new User(user));
  userRepository = new UserRepository(allUsers);
  hydrationData = responses[1].hydrationData;
  sleepData = responses[2].sleepData;
  displayDashboard();
});

function getRandomIndex(userData) {
  return Math.floor(Math.random() * userData.length);
}

function displayDashboard() {
  displayUserDetails();
  displayFriends();
  displaySteps();
  displayAverageSleep();
  displaySleepForSpecificDay();
  displaySleepForAWeek();
  displayHydaForToday();

  displayHydrationForWeek();
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

function displaySteps() {
  stepDetails.innerHTML = "";
  const averageSteps = userRepository.findAverageStepGoal();
  const comparison = Math.round((user.dailyStepGoal / averageSteps) * 100);
  stepDetails.innerHTML += `<section class='step-comparison-message'><p>Average Step Goal for All Users: ${averageSteps}.</p>
  <p>Your step goal is: ${user.dailyStepGoal}.</p>
  <p>Your daily step goal is ${comparison}% compared to all average users.</p></section>`;
}

function displayAverageSleep() {
  avgSleepHours.innerHTML += `<p>${user.getAvgSleepDataPerDay(
    sleepData,
    "hoursSlept"
  )} hours </p>`;
  avgQualitySleep.innerHTML += `<p>${user.getAvgSleepDataPerDay(
    sleepData,
    "sleepQuality"
  )}/5</p>`;
}
function displaySleepForSpecificDay() {
  const dateInput = inputValue.value.split("-").join("/");
  const avgSleepPerDay = user.getSleepDataPerDay(
    sleepData,
    dateInput,
    "hoursSlept"
  );
  const avgQualityPerDay = user.getSleepDataPerDay(
    sleepData,
    dateInput,
    "sleepQuality"
  );
  dataForDay.innerHTML = `<table class="sleep-data" style="width:100%">
  <tr>
    <td class="sleep-data">Day</td>
    <td class="sleep-data">Sleep Hours</td>
    <td class="sleep-data">Quality of Sleep</td>
  </tr>
  <tr>
    <td class="sleep-data">${dateInput}</td>
    <td class="sleep-data">${avgSleepPerDay}</td>
    <td class="sleep-data"${avgQualityPerDay}</td>
  </tr>`;
}

function displaySleepForAWeek() {
  const dateInput = inputValue.value.split("-").join("/");
  const sleepInAWeek = user.getSleepPerDayForWeek(
    sleepData,
    dateInput,
    "hoursSlept"
  );
  const sleepQualityInAWeek = user.getSleepPerDayForWeek(
    sleepData,
    dateInput,
    "sleepQuality"
  );
  //console.log(sleepQualityInAWeek);
  sleepForWeek.innerHTML = `<table class="sleep-data">
  <tr>
    <td>Day</td>
    <td>Sleep Hours</td>
    <td>Quality of Sleep</td>
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
    <td class="sleep-data">${sleepQualityInAWeek[5].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[5].date}</td>
    <td class="sleep-data">${sleepInAWeek[5].hoursSlept}</td>
    <td class="sleep-data">${sleepQualityInAWeek[5].sleepQuality}</td>
  </tr>
  <tr>
    <td class="sleep-data">${sleepInAWeek[6].date}</td>
    <td class="sleep-data">${sleepInAWeek[6].hoursSlept} hours</td>
    <td class="sleep-data">${sleepQualityInAWeek[6].sleepQuality}</td>
  </tr>
</table>
  `;
}

function displayHydaForToday() {
  const dateInput = inputValue.value.split("-").join("/");
  const dayFluids = user.getDayFluid(hydrationData, dateInput);
  hydraData.innerHTML += `
    <table class="hydra-data" style="width:100%">
    <tr>
      <td class="hydra-data">Day</td>
      <td class="hydra-data"> Consumed Today</td>
    </tr>
    <tr>
      <td class="hydra-data">${dateInput}</td>
      <td class="hydra-data">${dayFluids}</td>
    </tr>`;
}

function displayHydrationForWeek() {
  const dateInput = inputValue.value.split("-").join("/");
  const hyrdrationWeek = user.getWeeklyFluids(hydrationData, dateInput);

  // const xValues = [
  //   hyrdrationWeek[0].date,
  //   hyrdrationWeek[1].date,
  //   hyrdrationWeek[2].date,
  //   hyrdrationWeek[3].date,
  //   hyrdrationWeek[4].date,
  //   hyrdrationWeek[5].date,
  //   hyrdrationWeek[6].date,
  // ];
  // const yValues = [
  //   hyrdrationWeek[0].numOunces,
  //   hyrdrationWeek[1].numOunces,
  //   hyrdrationWeek[2].numOunces,
  //   hyrdrationWeek[3].numOunces,
  //   hyrdrationWeek[4].numOunces,
  //   hyrdrationWeek[5].numOunces,
  //   hyrdrationWeek[6].numOunces,
  // ];
  // const barColors = ["red", "green", "blue", "orange", "brown"];

  // new Chart("myChart", {
  //   type: "bar",
  //   data: {
  //     labels: xValues,
  //     datasets: [
  //       {
  //         backgroundColor: barColors,
  //         data: yValues,
  //       },
  //     ],
  //   },
  //   options: {
  //     legend: { display: false },
  //     title: {
  //       display: true,
  //       text: "Hydration For The Last Week",
  //     },
  //   },
  // });
}
