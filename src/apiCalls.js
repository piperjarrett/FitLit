const mainPage = document.querySelector(".fit-lit-light ");

function fetchData(details) {
  return fetch(`http://localhost:3001/api/v1/${details}`)
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      mainPage.innerHTML = "";
      mainPage.innerHTML += `<h1 class='errorDisplay'>Sorry, server down. Please try again later!`;
    });
}
const promiseAll = () => {
  const result = Promise.all([
    fetchData("users"),
    fetchData("hydration"),
    fetchData("sleep"),
    fetchData("activity"),
  ]).then((response) => {
    return response;
  });
  return result;
};

const postData = (details, data) => {
  return fetch(`http://localhost:3001/api/v1/${details}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => promiseAll())

    .catch((err) => console.log(err))
    .catch(
      (err) =>
        (mainPage.innerHTML = `<h1>Sorry, server down</h1>
    <p>Please try again later!</p>`)
    );
};

export { promiseAll };
export { postData };
