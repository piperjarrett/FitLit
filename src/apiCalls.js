function fetchData(details) {
  return fetch(`http://localhost:3001/api/v1/${details}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
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

function postData(details, data) {
  return fetch(`http://localhost:3001/api/v1/${details}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err))
    .then((data) => fetch(`http://localhost:3001/api/v1/${details}`))
    .then((data) => data.json())
    .catch((err) => console.log(err));
}

export { promiseAll };
export { postData };
