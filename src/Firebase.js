import * as firebase from 'firebase';

const settings = { timestampsInSnapshots: true };

const config = {
    apiKey: "AIzaSyBbt7U1lMMM0aKTu80DhqcqcD3smq-ODdM",
    authDomain: "funny-movies-24aa3.firebaseapp.com",
    databaseURL: "https://funny-movies-24aa3.firebaseio.com",
    projectId: "funny-movies-24aa3",
    storageBucket: "funny-movies-24aa3.appspot.com",
    messagingSenderId: "587371713558",
    appId: "1:587371713558:web:8d75845461f1e894ded137"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;