const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/booking',{ useNewUrlParser: true },(err,succ)=>{
	if(err){console.log(err)}
	if(succ){
		console.log("Connection to database successfull!!")
	}
})