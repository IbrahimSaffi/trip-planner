// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgiFtBbZ8aGCq1deOR0b2c0CkVLdHxqf4",
  authDomain: "trip-planner-de209.firebaseapp.com",
  projectId: "trip-planner-de209",
  storageBucket: "trip-planner-de209.appspot.com",
  messagingSenderId: "461503021861",
  appId: "1:461503021861:web:bc2c255778a8a502c690cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const auth = getAuth(app);
export { database, auth }
