var firebase = require("firebase");
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk'); //colorizes the output

var app = firebase.initializeApp({
    apiKey: "AIzaSyDfJ4DmrTtnxlYr5pfDHdznE51nLtMz9xM",
    authDomain: "gzu-cli-chat.firebaseapp.com",
    databaseURL: "https://gzu-cli-chat.firebaseio.com",
    projectId: "gzu-cli-chat",
    storageBucket: "",
    messagingSenderId: "701612657181"
});
var db = firebase.database();

function snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};

module.exports = {
        getUserName: async (username) => {
            const status = new Spinner(`Checking username, please wait...`);
            status.start();
            return db.ref(`/Users/${username}`).once('value').then(snapshot => {
                status.stop();
                return snapshotToArray(snapshot);
            }).catch(error => {
                status.stop();
                return false;
            })
        },
        signUp: async (email, password, username) => {
            return firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(user => {
                    if (user) {
                        return firebase.auth().currentUser.updateProfile({
                                displayName: username
                            }).then(() => {
                            return db.ref(`Users/${username}`).set({
                                username,
                                email
                            }).then(()=>{
                                return true;
                            })
                        });
                    }
                })
                .catch(function (error) {
                    return error;
                });
        },
        userProfile: async (data) => {
            return db.ref('Users').set(data);
        },
        signIn: async (email, password) => {

        },
        setData: async (path, data) =>{
            return db.ref(path).set(data);
        },
        getGroups: async () =>{
            const status = new Spinner(`Fetching groups, please wait...`);
            status.start();
            return db.ref('/groups').once('value').then(snapshot => {
                status.stop();
                return snapshotToArray(snapshot);
            }).catch(error=>{
                status.stop();
                return false;
            })
        },
        getChats: async (path) => {
             db.ref(`Chats/${path}`).on("child_added", data => {
                 var snap = data.val();
                 console.log(chalk.green(snap.message));
             });
        },
        sendMessage: async (path,data) =>{
            return db.ref(`Chats/${path}`).push(data);
        },
        getList: (path) =>{
            return app.database().ref(path);
        },
        push: (path, data)=> {
            return  db.ref(path).push(data);
        },
        set: (path, key, data) => {
            return app.list(path).set(key, data);
        },
        update: (path, key, data)=> {
            return app.list(path).update(key, data);
        },
        remove: (path, key) => {
            return app.list(path).remove(key);
        },

        removeAll: (path) => {
            return app.list(path).remove();
        }
    }