var firebase = require("firebase");
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk'); //colorizes the output
var moment = require('moment');

var term = require('terminal-kit').terminal; //http://blog.soulserv.net/terminal-friendly-application-with-node-js-part-ii-moving-and-editing/

var app = firebase.initializeApp({
    apiKey: "YOUR-PROJECT-KEY",
    authDomain: "xxxxxxxxxxxx.firebaseapp.com",
    databaseURL: "https://xxxxxxxxxxx.firebaseio.com",
    projectId: "xxxxxxxxxx",
    storageBucket: "",
    messagingSenderId: "000000000000"
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
        signIn: async (email, password) => {
             return firebase.auth().signInWithEmailAndPassword(email,password);
        },
        userProfile: async (data) => {
            return db.ref('Users').set(data);
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
        getChats: async (path, username) => {
             db.ref(`Chats/${path}`).on("child_added", data => {
                 var snap = data.val();
                 var now = new Date().getTime();
                 if(snap.sender !== username){
                    console.log(
                        chalk.yellow(`<${snap.sender}>`),
                        chalk.green(snap.message),
                        chalk.blue(`${moment(snap.timestamp).fromNow()}`)
                    );
                 } else if ((snap.timestamp + 30*1000) < now) {
                    console.log(
                        chalk.yellow(`<You>`),
                        chalk.green(snap.message),
                        chalk.blue(`${moment(snap.timestamp).fromNow()}`)
                    );
                 }
             });
        },
        sendMessage: async (path,data) =>{
            return db.ref(`Chats/${path}`).push(data);
        },
        setOnline: async (groupname, username) =>{
            return db.ref(`Online/${groupname}`).set({username});
        },
        checkOnline: async (groupname, username) => {
            db.ref(`Online/${groupname}`).on("child_changed", data => {
                var snap = data.val();
                if (snap !== username) {
                    console.log(
                        chalk.yellow(`${snap} is online`)
                    );
                }
            });
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