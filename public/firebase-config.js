// Firebase configuration
const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: "AIzaSyBkGSDnY6IC0haeTxsKp0yk856wm4F_tF4",
  authDomain: "keuangankita-010322.firebaseapp.com",
  databaseURL: "https://keuangankita-010322-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "keuangankita-010322",
  storageBucket: "keuangankita-010322.firebasestorage.app",
  messagingSenderId: "195883412869",
  appId: "1:195883412869:web:2038accbfa8c80f74868ec",
  measurementId: "G-P3SPGLCKF2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();
