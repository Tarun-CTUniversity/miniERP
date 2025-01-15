const mongo = require("mongoose");

exports.connectDatabase = () => {
    mongo.connect("mongodb://localhost:27017/MiniERP")
        .then((data) => {
            console.log("mongoDB is connected with server")
        }).catch((err)=>{
            console.log(err);
        })
}
