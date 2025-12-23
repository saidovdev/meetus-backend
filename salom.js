fetch(
  "https://marketplace-c3ca5-default-rtdb.asia-southeast1.firebasedatabase.app/item.json",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({
     title:'Asliddin',
     subCategory:'Термос',
     stock:5,
     price:51,
     desc:'Salom man asl iplos',
     image:'https://res.cloudinary.com/daancrhjy/image/upload/v1765882562/profile_imgs/vqleziki37hjr0t3fxql.jpg',
     category:'Посуда'
    })
  }
)
  .then((d) => d.json())
  .then((d) => console.log(d));
