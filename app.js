const express = require('express')
const app = express()
const bparser = require('body-parser')
//public files will be stored on /public folder
app.use(express.static('public'))
app.set('view engine','hbs')
app.use(bparser.urlencoded({extended : false}))
//db connection
require('./models/connection')
const bookingModel = require('./models/booking')
//display booking page
app.get('/',(req,res)=>{
	res.render('index',{title : "Welcome Home"})
})

//receive post request of booking
app.post('/book',async (req,res)=>{
	//destructure req.body
	const {body} = req
	//check if the same booking detail exists
	var check = await bookingModel.findOne({$and : [{bookingDay : body.bookingDay},{time : body.time},{type : body.type}]})
	//if no , then add a booking on db
	if(check == null){
		new bookingModel(body)
		.save((err,succ)=>{
			if(err){
				res.send({
					type : 'error',
					msg : err
				})
			}
			if(succ){
				res.send({
					type : 'success',
					msg : "Booking successfull !!",
					data : succ
				})
			}
		})
	}
	//if yes , say the time is booked already
	else{
		res.send({
			type : 'error',
			msg : 'The time is booked already !!'
		})
	}
})


//list out all the bookings on the time passed
app.get('/booking/:time',async(req,res)=>{
	const {params} = req
	var books = await bookingModel.find({bookingDay : params.time})
	res.send({
		books
	})
})

//port to listen
const port = process.env.PORT || 3000
//listen to the port
app.listen(port,(err)=>{
	if(err){console.log(err)}
	else{
		console.log("App up and running at port ",port)
	}
})