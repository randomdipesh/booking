const mongoose = require('mongoose')
const bookingSchema = new mongoose.Schema({
	name : String, //one who is booking this
	address : String, //address of the appointment booker
	// add other needed details here
	bookingDay : String, //the date to be booked 
	time : Number , // the time to be booked
	type : String , //AM or PM,
	nextt : Number, //next hour
	nextty : String, //AM or PM of next hour
	bookedOn : Date //date on which booking is done
})
module.exports =  bookingModel = mongoose.model('bookingModel',bookingSchema)