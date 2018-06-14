import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyBn_rWgnd9RSv_nJ5LCMNyAHcrnGBTYPm4',
  authDomain: 'class-r.firebaseapp.com',
  databaseURL: 'https://class-r.firebaseio.com',
  projectId: 'class-r',
  storageBucket: 'class-r.appspot.com',
  messagingSenderId: '649402175486'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

export { auth, database, storage };
