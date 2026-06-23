const mongoose = require('mongoose');


main()
.then(()=>{
    console.log("connected to mongo DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://localhost:27017/userdata');
}

const LoginSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required:true
    }
});

const loginCollection = mongoose.model('loginCollection',LoginSchema);

module.exports = loginCollection;