import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs,  query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, database } from "./firestore-config"
async function createUser(email, password) {
  let oldUser = await userExist(email)
  if (!oldUser) {
    try {
      let userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      await addDataCustomIdFS(user.uid, "ibrahim", user.email)
      return user
    }
    catch (error) {
      throw new Error(error)
    }
  }
}
async function addDataCustomIdFS(id, username, email) {
  try {
    await setDoc(doc(database, "users", id), {
      profile: {
        userName: username,
        email: email,
      },
      id: id
    }
    )
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}
//adding trips
async function addTrip(uid, tripDetails) {
  console.log(tripDetails.places)
  const tripRef = await addDoc(collection(database, "trips"), {
    title: tripDetails.title,
    date: tripDetails.date,
    days: tripDetails.days,
    persons: tripDetails.persons,
    places:tripDetails.places,
    creater: uid
  });
  const tripsRef = doc(database, 'trips', tripRef.id);
setDoc(tripsRef, { id: tripRef.id }, { merge: true });
  console.log("Trip created with ID: ", tripRef.id);
}
async function getTrips(uid) {
  let trips = []
  //Await here
  const q = query(collection(database
    , "trips"), where("creater", "==", uid));
    const tripSnapshot = await getDocs(q);
    console.log(tripSnapshot)
    tripSnapshot.forEach(doc => {
    trips.push(doc.data())
  })
  return trips
}
async function updateTrip(tripId, tripDetails) {
  console.log("update",tripId,tripDetails)
  try {
    const tripRef = doc(database, "trips", tripId);
    await updateDoc(tripRef, {
      title: tripDetails.title,
      date: tripDetails.date,
      days: tripDetails.days,
      persons: tripDetails.persons
    });
  }
  catch (err) {
    console.log(err)
  }
}

async function userExist(email) {
  try {
    let querySnapshot = await getDocs(collection(database, "users"));
    let userAlreadyThere = false
    querySnapshot.forEach((doc) => {
      let dataElement = doc.data()
      if (dataElement.profile.email === email) {
        userAlreadyThere = true
      }
    })
    return userAlreadyThere
  }
  catch (error) {
    throw new Error(error)
  }
}
async function loginUser(email, password) {
  try {
    let userCredential = await signInWithEmailAndPassword(auth, email, password)
    // Signed in 
    const userId = userCredential.user.uid;
    const userRef = doc(database, "users", userId);
    const user = await getDoc(userRef);
    
    if (user.exists()) {
  console.log(user.data(),userId)
    return user.data()
} else {
  // doc.data() will be undefined in this case
  console.log("No such user!");
}

  }
  catch (error) {
    throw new Error(error)
  }
}
async function delTrip(tripId){
try{
  await deleteDoc(doc(database, "trips", tripId));
}
catch(e){
  console.log(e)
}

}
export { createUser, loginUser, userExist,addTrip,updateTrip,getTrips,delTrip }