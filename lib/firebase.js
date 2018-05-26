var firebase = require("firebase");

var app = firebase.initializeApp({
  apiKey: "AIzaSyDfJ4DmrTtnxlYr5pfDHdznE51nLtMz9xM",
  authDomain: "gzu-cli-chat.firebaseapp.com",
  databaseURL: "https://gzu-cli-chat.firebaseio.com",
  projectId: "gzu-cli-chat",
  storageBucket: "",
  messagingSenderId: "701612657181"
});

var totalVisitors = analytics.child('totalVisitors');
totalVisitors.once('value', function (snapshot) {
  totalVisitors.set(snapshot.val() + 1);
});

/*const credentials = await inquirer.askLoginCredentials();
    console.log(credentials);
    await database.setData('FromCLI2', credentials).then(() => {
        writeDone('Zvafaya');
    }).catch(error => {
        writeError(error);
    });*/
console.log('The end');

const groups = await database.getGroups().then(data => {
  writeDone(data);
}).catch(error => {
  writeError(error);
})
