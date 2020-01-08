import axios from "axios";

let requestBody;

export const signInUser = (email, password) => {
  console.log("hello");
  requestBody = {
    query: `
    mutation { createUser(userInput: {email: "${email}", password: "${password}"}) {
      _id
      email
    }
    }`
  };

  // return axios
  //   .post
    return fetch("http://localhost:8000/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      console.log(response, "data log");
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const createNewUser = () => {}
