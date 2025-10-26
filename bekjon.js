fetch("http://localhost:1747/api/uniqueUser/create/uniqueUser", {
    method: 'POST',
    headers: {
        "Content-Type": 'application/json'
    }
})
.then(d => d.json())
.then(d => console.log(d))
.catch(err => {
    console.log(err);
});
