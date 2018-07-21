//24 hour to 12 hour number
	function check_num(number){
	var time = number
	if(number>=13){
		time = number-12
	}
	return time
}
//detect am pm from 24 hour time
function check_clock(number){
	var type = "AM"
	if(number>=13){
		type = "PM"
	}
	return type
}

$(function(){
	//fullcalendar setup
	$('#calendar').fullCalendar({
		header: {
		  left:   'title',
		  right:  'prev,next'
		},
		defaultView: 'month',
		//when you click on any date
		dayClick : function(e){
			var myd = this.attr('data-date')
		    // if selected dates is before today
		    var remain = moment(e._d).unix()- Date.now()/1000
		    // remain = remain/1000/60
		    if(remain<-86400)
		    {
		       return false;
		    }
			//get the readable value of the date
			// var date = e._d.toDateString()
			//set it in modal title
			$('#ddates').html(myd)
			$("#dt").html(myd)
			//lets fine out which which hours are packed in current clicked date
			var ondb = []
			// /booking/time will throw you the bookings in the date
				$.ajax({
					method : "GET",
					url : '/booking/'+myd,
					//success 
					success : function(data){
						//loop through the booked events ,						
						data.books.forEach(ds=>{
							//make readable time of the booked time
							var dm = ds.time + `${ds.type}`
							ondb.push(dm)
						})

						//the time values displayed for booking
						var times = ''
						//from 9 am to 8 pm
						for(i=9;i<21;i++){
							var time = check_num(i)
							var type = check_clock(i)
							// next hour
							var next_time = check_num(i+1)
							var next_type = check_clock(i+1)

							times+=`
									<div class="card card-body">
										<strong>
									<i class="far fa-clock"></i> ${time}:00 ${type} - ${next_time}:00 ${next_type}
									`

									//readable value of time
									var ourt = time+`${type}`
									//check if this value is booked already or not , if yes , show unavailable , else show book now
									if(ondb.includes(ourt)){
										times+=`
											
											<button class="float-right btn btn-secondary btn-sm disabled" readonly = "true" id = "book" data-time = ${time} data-type = '${type}' data-nextt = ${next_time} data-nextty = '${next_type}' data-for = ${e._i}>Unavailable</button>

										`
									}
									else{

										times+=`

	<button class="float-right btn btn-primary btn-sm" id = "book" data-time = ${time} data-type = '${type}'
	 data-nextt = ${next_time} data-nextty = '${next_type}' data-for = ${e._i}>Book an Appointment</button>

										`
									}

									times+=`
				
									</strong>
									</div>
									<br />
							`
							//show the time datas in modal
							$('#infos').html(times)
						}

					}
				})
			//showing the modal
			$("#exampleModal").modal('show')
		}
	});


// post the booking data
$(document).on('click','#book',function(e){
	e.preventDefault()
	if($(this).hasClass('disabled')){
		return false;
	}
	//get the values of the selected date here
	var time = $(this).attr('data-time')
	var type = $(this).attr('data-type')
	var nextt = $(this).attr('data-nextt')
	var nextty = $(this).attr('data-nextty')
	var fors = $(this).attr('data-for')
	const th = this
	//on click book appointment , hide the current modal and show info grabbing modal
	$('#exampleModal').modal('hide')
	$('#infoTaker').modal('show')
	//on submit of info , send the data to database
	$('#form').on('submit',function(e){
		e.preventDefault()
		//get the values of informations submitted by user here
		var name = $('#name').val()
		var address = $('#address').val()

		$.ajax({
		url : '/book',
		method : "POST",
		data : {
			name,
			address,
			time,
			type,
			nextt,
			nextty,
			bookingDay : $('#ddates').html()
		},
		success : function(data){
			$('#infoTaker').modal('hide')
			// $('#exampleModal').modal('show')
			swal({
				type : data.type,
				text : data.msg,
				title : data.type.toUpperCase()
			})
			$(th).removeClass('btn-primary')
			$(th).addClass('disabled  btn-secondary')
			$(th).attr('readonly',true)
			$(th).html('Unavailable')
			$('form')[0].reset()
		}
	})

	})

})	






})

//  [July 20 2018]
// A Random Programmer , https://fiverr.com/yartitech