// fetch("http://localhost:1747/api/register", {
//     method: 'POST',
//     headers: {
//         "Content-Type": 'application/json'
//     },
//     body:JSON.stringify({
//         email:"muhammadlisaidov580@gmail.com",
//         username:"production",
//         code:"374392",
//         role:'bussness',
//         password:'52521515'
//     })
// })
// .then(d => d.json())
// .then(d => console.log(d))
// .catch(err => {
//     console.log(err);
// });


fetch("http://localhost:1747/api/verify-request", {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    },
    body:JSON.stringify({
        email:"bohirjontemirov15@icloud.com",
        username:"production1",
       
    })
})
.then(d => d.json())
.then(d => console.log(d))
.catch(err => {
    console.log(err);
});

