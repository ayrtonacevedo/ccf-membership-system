import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNAX04w3LeahFs6uUD1qgf6IpLF2tX5rg",
  authDomain: "ccf-membership-system.firebaseapp.com",
  projectId: "ccf-membership-system",
  storageBucket: "ccf-membership-system.appspot.com",
  messagingSenderId: "837705685870",
  appId: "1:837705685870:web:3af3d9e04255726bdbbf7f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
