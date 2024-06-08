// const ob1 = {name: 1}
// console.log(ob1.name)
// const name2 = 2;
// const name3 = {name3: 3};
// console.log({...ob1,name2, ...name3})



// const msg = [
//     "Planning your dream vacation, just for you!",
//     "Your personalized itinerary is loading...",
//     "We're curating your travel experiences, just a moment!",
//     "Loading your travel plans, stay tuned!",
//     "Your personalized travel guide is on its way!",
//     "Just a sec, we're mapping out your adventures...",
//     "Your travel itinerary is being prepared, hang tight!",
//     "Loading your sightseeing list, just for you!",
//     "We're crafting your perfect getaway, just a minute!",
//     "Your travel plans are being generated, stay tuned!"
//   ]

// console.log(msg[Math.floor(Math.random()*msg.length)])

// const LoadingBar = [`<span className="loading loading-infinity loading-lg"></span>`,`<span className="loading loading-infinity loading-lg"></span>`]

// console.log(LoadingBar)

const ob1 = {admin: {completed: 1, planned : "2"}}
const ob2 = {admin2: {completed: 1, planned : "2"}}

console.log({...ob1,...ob2})