import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDrq7a3BNFTzzXCYx6G5K51iF9EfSxo74U",
  authDomain: "tf-assignment-3d76f.firebaseapp.com",
  projectId: "tf-assignment-3d76f",
  storageBucket: "tf-assignment-3d76f.firebasestorage.app",
  messagingSenderId: "150217891883",
  appId: "1:150217891883:web:4c3a07c6be361e380bca6e",
  measurementId: "G-ZRP3YLR1F5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup };
