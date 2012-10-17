/* Copyright (c) 2009 (josejnv@gmail.com) http://joaquinnunez.cl/blog/
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-2.0.php)
 * Use only for non-commercial usage.
 *
 * Version : 0.1
 *
 * Requires: jQuery 1.2+
 */

/* Modified by Parag Majumdar (admin@bitsofparag.com)
 * Fixes: Memory leak fixes, better management of intervals, Optional GMT information display
 */
jQuery.calcTime = function(offset) {

	// create Date object for current location
	var d = new Date();

	// convert to msec
	// add local time zone offset
	// get UTC time in msec
	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

	// create new Date object for different city
	// using supplied offset
	var nd = new Date(utc + (3600000 * offset));
	//alert(nd.getDay());
	// return time as a string
	return nd;

};


(function(jQuery) {
	jQuery.fn.clock = function(options) {
		var secTimer = 0, hrTimer = 0, minTimer = 0;
		var defaults = {
			offset : '+0',
			type : 'analog',
			hrType:'24' 
		};
		var _this = this;
		var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var opts = jQuery.extend(defaults, options);
		
		var thisClock = window['PM'+opts.type + 'Clock'] = {
			timers : true,
			stop : function(){
				clearInterval(secTimer);
				clearInterval(hrTimer);
				clearInterval(minTimer);
				//console.log(secTimer, hrTimer, minTimer);
				this.timers = false;
			}
		};
		
		//caching
		thisClock.self = jQuery(_this);
		thisClock.addons = thisClock.self.parent().find('.addOns');
		thisClock.sec = thisClock.self.find(".sec");
		thisClock.hour = thisClock.self.find(".hour");
		thisClock.min = thisClock.self.find(".min");

		secTimer = setInterval(function() {
			if(!thisClock.timers) clearInterval(secTimer);
			var seconds = jQuery.calcTime(opts.offset).getSeconds(), sec = thisClock.sec;
			if (opts.type == 'analog') {
				var sdegree = seconds * 6;
				var srotate = "rotate(" + sdegree + "deg)";
				//console.log(seconds, srotate);
				sec.css({
					"-moz-transform" : srotate,
					"-webkit-transform" : srotate
				});
			} else {
				//console.log(seconds);
				sec.html(seconds);
			}
		}, 1000);

		hrTimer = setInterval(function() {
			if(!thisClock.timers) clearInterval(hrTimer);
			var nd = jQuery.calcTime(opts.offset)
			var hours = nd.getHours();
			var mins = nd.getMinutes();
			var hr = thisClock.hour;
			if (opts.type == 'analog') {
				var hdegree = hours * 30 + (mins / 2);
				var hrotate = "rotate(" + hdegree + "deg)";
				hr.css({
					"-moz-transform" : hrotate,
					"-webkit-transform" : hrotate
				});
			} else {
				if(opts.hrType == "12" && hours > 12){
					hours = parseInt((hours-12), 10);
					(hours < 10)? '0'+hours : hours; 
					hr.html(hours + ':');
				}else{
					hr.html(hours + ':');	
				}
			}
			var meridiem = hours < 12 ? 'AM' : 'PM';
			if(opts.hrType == "12"){
				thisClock.addons.find('.meridiem').html(meridiem).end().find('.day').html(days[nd.getDay()]);
			}else{
				thisClock.addons.find('.meridiem').html("").end().find('.day').html(days[nd.getDay()]);	
			}
			
		}, 1000);

		minTimer = setInterval(function() {
			if(!thisClock.timers) clearInterval(minTimer);
			var mins = jQuery.calcTime(opts.offset).getMinutes();
			if (opts.type == 'analog') {
				var mdegree = mins * 6;
				var mrotate = "rotate(" + mdegree + "deg)";
				thisClock.min.css({
					"-moz-transform" : mrotate,
					"-webkit-transform" : mrotate
				});
			} else {
				//jQuery(_this).find(".min").html(mins+':');
				mins = parseInt(mins, 10);
				thisClock.min.html(mins < 10? '0'+mins : mins);
			}
		}, 1000);
	}
})(jQuery);


