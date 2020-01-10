import axios from "axios";

export const userLoginAction = (email, password, loginMode) => {
  console.log("hello");

  let requestBody = {
    query: `
    mutation { createUser(userInput: {email: "${email}", password: "${password}"}) {
      _id
      email
    }
    }`
  };

  if (loginMode) {
    requestBody = {
      query: `
      query { login(email: "${email}", password: "${password}") {
        userId
        token
        tokenExpiration
      }
      }`
    };
  }

  // return axios
  //   .post
  return fetch("http://localhost:8000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      console.log(res, "res log");
      return res.json(); // Need this as using 'fetch' rather than axios.
    })
    .then(parsedRes => {
      console.log(parsedRes, "parsed result log");
      return parsedRes;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// export const siginInUser = (email, password) => {
//   console.log("api Signin");
//   requestBody = {
//     query: `
//     query { login(email: "${email}", password: "${password}") {
//       userId
//       token
//       tokenExpiration
//     }
//     }`
//   };

//   return fetch("http://localhost:8000/graphql", {
//     method: "POST",
//     body: JSON.stringify(requestBody),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }).then(response => {
//     console.log(response, "api sign in response");
//   });
// };
