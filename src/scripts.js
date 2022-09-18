// Import CSS and Images
import "./css/styles.css";
import "./images/lighting.png";
import "./images/sandals.png";
import "./images/water-bottle.png";
import "./images/logo_transparent.png";
import "./images/avatar-male.png";
import "./images/gym.png";
import "./images/moon.png"
import "./images/sun.svg"

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
let userActivity;
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
const activityCard = document.querySelector(".activity-card")
const changeBackground = document.querySelector(".back-color-button")
const categoriesValue = document.querySelector(".categories-value")

// Event Listeners
window.addEventListener("load", promiseAll);
submitButton.addEventListener("click", () => {
  displaySleepForAWeek();
  displayHydrationForWeek();
  displayMilesWalked();
  displayNumberOfSteps();
  displayMinutesActive();
});

function hide(element) {
  element.classList.add('hidden')
}

function show(element) {
  element.classList.remove('hidden')
}

categoriesValue.addEventListener('change', ()=> {
  const sleepInputs = document.querySelector('.sleep-data-inputs')
  const hydrationInputs = document.querySelector('.hydration-data-inputs')
  const activityInputs  = document.querySelector('.activity-data-inputs')
  const dateSelector = document.querySelector('.date-input')
  const selectionLabel = document.querySelector('.selection-label')
 let result = categoriesValue.options[categoriesValue.selectedIndex].text;
 
   if(result === 'Sleep Data'){
    selectionLabel.innerText = 'Please Enter Your Sleep Data'
      show(sleepInputs)
      hide(activityInputs)
      hide(hydrationInputs)
      show(dateSelector)

   } else if(result ==='Hydration Data' ){
    selectionLabel.innerText = 'Please Enter Your Hydration Data'
    hide(sleepInputs)
    hide(activityInputs)
    show(hydrationInputs)
    show(dateSelector)
    hide(categoriesValue)
    
   } else if(result === 'Activity Data' ){
    selectionLabel.innerText = 'Please Enter Your Activity Data'
    hide(sleepInputs)
    show(activityInputs)
    hide(hydrationInputs)
    show(dateSelector)
    hide(categoriesValue)
   } else {
    hide(sleepInputs)
    hide(activityInputs)
    hide(hydrationInputs)
    hide(dateSelector)
    show(categoriesValue)
   }
})

var nextImg = 'light'
changeBackground.addEventListener('click', () => {
  const light = document.querySelector('.fit-lit-light')
  let img = ['./images/sun.svg', './images/moon.png']
  if(nextImg === 'light') {
    light.classList.add('fit-lit-dark')
    changeBackground.src = img[0]
    nextImg = 'dark'
  }else{
    light.classList.remove('fit-lit-dark')
    changeBackground.src = img[1]
    nextImg = 'light';
  }
})

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
  displayMilesWalked();
  displayNumberOfSteps();
  displayMinutesActive();
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
  formatInputDate()
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
  formatInputDate() 
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

function displayMilesWalked() {
  formatInputDate()
  const milesWalked = user.userActivityData.getMilesBasedOnSteps(dateInput, user);
  if (milesWalked === 0.0) {
    activityCard.innerHTML = "<p>Please add data for given date</p>";
  } else {
    activityCard.innerHTML = `<h3>On ${dateInput} you:</h3>
    <p>  walked ${milesWalked} miles, `;
  }
}

function displayNumberOfSteps() {
  formatInputDate() 
  const numberOfSteps = user.userActivityData.getActivityDetailByDate(dateInput, "numSteps")
  if (numberOfSteps === 0) {
    activityCard.innerHTML += "";
  } else {
    activityCard.innerHTML += `</p>${numberOfSteps} steps,</p>`;
  }
}

function displayMinutesActive() {
  formatInputDate()
  const minsActive = user.userActivityData.getActivityDetailByDate(dateInput, "minutesActive");
  if (minsActive === 0) {
    activityCard.innerHTML += "";
  } else {
    activityCard.innerHTML += `</p>and were active for ${minsActive} minutes</p>`;
  }
}

function displayActivityDetailComparison () {
  formatInputDate() 
  const allNumSteps = userRepository.findAverageActivityDetail(activityData, dateInput, "numSteps");
  const allFlightsOfStairs = userRepository.findAverageActivityDetail(activityData, dateInput, "flightsOfStairs");
  const allMinutesActive = userRepository.findAverageActivityDetail(activityData, dateInput, "minutesActive");
  const minutesActive = userActivity.getActivityDetailByDate(dateInput, "minutesActive")
  const numSteps = userActivity.getActivityDetailByDate(dateInput, "numSteps")
  const flightsOfStairs = userActivity.getActivityDetailByDate(dateInput, "flightsOfStairs")
    const hydrationWeek = user.userHydrationData
      .getWeeklyFluids(dateInput)
      .reverse();
    if (hydrationWeek.length >= 6) {
      chart.innerHTML = `
    <table class="activity-data">
    <tr>
      <td class ="activity-data">You</td>
      <td class ="activity-data">All Users</td>
    </tr>
    <tr>
      <td class="activity-data">${hydrationWeek[1].date}</td>
      <td class="activity-data">${hydrationWeek[1].numOunces}</td>
    </tr>
    <tr>
      <td class="activity-data">${hydrationWeek[2].date}</td>
      <td class="activity-data">${hydrationWeek[2].numOunces}</td>
    </tr>
    <tr>
      <td class="activity-data">${hydrationWeek[3].date}</td>
      <td class="activity-data">${hydrationWeek[3].numOunces}</td>
    </tr>
      <tr>
      <td class="activity-data">${hydrationWeek[4].date}</td>
      <td class="activity-data">${hydrationWeek[4].numOunces}</td>
    </tr>
    <tr>
      <td class="activity-data">${hydrationWeek[5].date}</td>
      <td class="activity-data">${hydrationWeek[5].numOunces}</td>
    </tr>
    <tr>
      <td class="activity-data">${hydrationWeek[6].date}</td>
      <td class="activity-data">${hydrationWeek[6].numOunces}</td>
    </tr>
  </table>`;
    } else {
      chart.innerHTML = `<p> There Is Not Enough Data To Display For This Week. Please Select
      A Different Week To See Your Weekly Report <p>`;
    }
  }
