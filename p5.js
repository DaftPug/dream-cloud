function setup() {
  createCanvas(400, 400)

  var firebaseConfig = {
    apiKey: 'AIzaSyAET8NX9-hMGX0WeYaZNNI147BMHOL5RII',
    authDomain: 'dream-cloud-d4d1d.firebaseapp.com',
    databaseURL: 'https://dream-cloud-d4d1d.firebaseio.com',
    projectId: 'dream-cloud-d4d1d',
    storageBucket: 'dream-cloud-d4d1d.appspot.com',
    messagingSenderId: '470432303775',
    appId: '1:470432303775:web:ca3e84b4d9754e2e9df0aa',
    measurementId: 'G-5ET0GNFW4M'
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  firebase.analytics()
  console.log(firebase)

  var database = firebase.database()
}

function draw() {
  background(210)
}
