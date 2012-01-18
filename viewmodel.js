var viewModel = {
	self:this,
	totalSeconds: ko.observable(0),
	totalChants: ko.observable(0.0),
	seconds:ko.observable(0),
	prayers: ko.observableArray([]),
	logs: ko.observableArray([]), //timestamp: ko.observable( Date() ), seconds: ko.observable(int), note:ko.observable(string)
	onClickTabPrayers:function(){
		if( $('#counter .main .edit-button').text() === "done" ){
			this.counterEdit();
		}
		$('#content > div').hide();
		$('#content #prayers').show();
	},
	onClickTabCounter:function(){
		if( $('#prayers .main .edit-button').text() === "done" ){
			this.prayersEdit();
		}
		$('#content > div').hide();
		$('#content #counter').show();
	},
	onClickTabChart:function(){
		$('#content > div').hide();
		$('#content #chart').show();
	},
	newPrayer:function(obj){
		this.prayers.push(obj);
		console.log(this.prayers());
	},
	setPrayer:function(obj){
		this.prayers()[obj.index].title( obj.title );
		this.prayers()[obj.index].description( obj.description );
		return true;
	},
	start:function(){
		this.pauseDisplay(true);
		this.startDisplay(false);
		$('#counter .main').addClass('disabled');
		startCounter();
	},
	startDisplay:ko.observable(true),
	pause:function(){
		this.pauseDisplay(false);
		this.startDisplay(true);
		$('#counter .main').removeClass('disabled');
		pauseCounter();
	},
	pauseDisplay:ko.observable(false),
	reset:function(){
		if( this.startDisplay() ){
			resetCounter();	
		}
	},
	log:function(){
		if( this.startDisplay() && this.seconds() > 0 ){
			var seconds = this.seconds();
			this.logs.push({
				timestamp: ko.observable(new Date() ), 
				seconds: ko.observable(seconds), 
				note: ko.observable("")
			});
			clearTimeout( timeout );
			viewModel.seconds(0);
			viewModel.fillCircles();
		}
	},
	setLog:function(obj){
		this.logs()[obj.index].seconds( obj.seconds );
		this.logs()[obj.index].note( obj.note );
		return true;
	},
	prayersEdit:function(){
		if( $('#prayers .main .edit-button').text() == "edit" ){ 
			$('#prayers ul.inside .arrow').fadeIn();
			$('#prayers ul.inside .trash').fadeIn();
			$('#prayers .main .edit-button').text('done');
		} else {
			$('#prayers ul.inside .arrow').fadeOut();
			$('#prayers ul.inside .trash').fadeOut();
			$('#prayers .main .edit-button').text('edit');
		}
	},
	prayersEditCancel:function(){
		$('#prayers .main').animate({left:'0%'}, 300);
		$('#prayers .edit').animate({right:'-100%'}, 300, function(){

		});
	},
	prayersEditSave:function(){
		$('#prayers .main').animate({left:'0%'}, 300);
		$('#prayers .edit').animate({right:'-100%'}, 300, function(){
		    var title = $('#prayers .title .text').val();
		    var desc = $('#prayers .description .text').val();
		    var index = editId;
		    if( viewModel.setPrayer({index:index, title:title, description:desc}) ){
		    }
		});
		$('#prayers ul.inside .arrow').hide();
		$('#prayers ul.inside .trash').hide();
		$('#prayers .main .edit-button').text('edit');
	},
	prayersNew:function(){
		$('#prayers .new').animate({bottom:'0%'}, 300);	
	},
	prayersNewDone:function(){
		var title = $('#prayers .new .title .text').val();
        var desc = $('#prayers .new .description .text').val();
        if( title != '' ){
	        viewModel.newPrayer({
	          title:ko.observable(title), 
	          description:ko.observable(desc), 
	          date:ko.observable(new Date())
	        });
	        $('#prayers .new').animate({bottom:'-100%'}, 300, function(){
	            $('#prayers .title .text').val('');
	            $('#prayers .description .text').val('');
			});
			$('#prayers ul.inside .arrow').hide();
			$('#prayers ul.inside .trash').hide();
			$('#prayers .main .edit-button').text('edit');
		}
	},
	prayersNewCancel:function(){
		$('#prayers .new').animate({bottom:'-100%'}, 300, function(){
            $('#prayers .title .text').val('');
            $('#prayers .description .text').val('');
		});
		$('#prayers ul.inside .arrow').hide();
		$('#prayers ul.inside .trash').hide();
		$('#prayers .main .edit-button').text('edit');
	},
	counterEdit:function(){
		if( $('#counter .main .edit-button').text() == "edit" ){ 
			$('#counter ul.log .arrow').fadeIn();
			$('#counter ul.log .trash').fadeIn();
			$('#counter .main .edit-button').text('done');
		} else {
			$('#counter ul.log .arrow').fadeOut();
			$('#counter ul.log .trash').fadeOut();
			$('#counter .main .edit-button').text('edit');
		}
	},
	counterEditCancel:function(){
		$('#counter .edit').animate({right:'-100%'});
        $('#counter .main').animate({left:'0%'});
	},
	counterEditSave:function(){
		var index = editId;
		var originalSeconds = this.logs()[index].seconds();

		var minutes = $("#counter .edit select.hours").val()*1 * 60;
		var seconds = ($("#counter .edit select.minutes").val()*1 + minutes) * 60;
		seconds = $("#counter .edit select.seconds").val()*1 + seconds;
		var notes = $("#counter .edit .notes").val();
		var newSeconds = 0;
		var totalSeconds = this.totalSeconds();
		var totalChants = this.totalChants();
	    if( originalSeconds < seconds ){
	    	newSeconds = seconds - originalSeconds;
	    	this.totalSeconds(totalSeconds+newSeconds);
	    	this.totalChants(totalChants+newSeconds*1.111);
	    } else {
	    	newSeconds = originalSeconds - seconds;
	    	this.totalSeconds(totalSeconds-newSeconds);
	    	this.totalChants(totalChants-newSeconds*1.111);
	    }
	   	this.setLog({index:index, note:notes, seconds:seconds});
	    this.fillCircles();
		$('#counter .main').animate({left:'0%'}, 300);
		$('#counter .edit').animate({right:'-100%'}, 300, function(){
			
		});

        $('#counter ul.log .arrow').hide();
		$('#counter ul.log .trash').hide();
		$('#counter .main .edit-button').text('edit');
	},
	counterNew:function(){
		if( this.startDisplay() ){
			$('#counter .new').animate({bottom:'0%'}, 300);
		}
		if( $('#counter .main .edit-button').text() == "done" ){
			this.counterEdit();
		}
	},
	counterNewDone:function(){
		var that = this;
		if( $("#counter .new select.hours").val() != "0" ||
			$("#counter .new select.minutes").val() != "0" ||
			$("#counter .new select.seconds").val() != "0" ){
			var minutes = $("#counter .new select.hours").val()*1 * 60;
			var seconds = ($("#counter .new select.minutes").val()*1 + minutes) * 60;
			seconds = $("#counter .new select.seconds").val()*1 + seconds;
			var notes = $("#counter .new .notes").val();
			that.logs.push({
				timestamp: ko.observable(new Date() ), 
				seconds: ko.observable(seconds), 
				note: ko.observable(notes)
			});
			var totalSecs = that.totalSeconds() + seconds;
			var totalChants = that.totalChants() + seconds*1.111;
			that.totalChants(totalChants);
			that.totalSeconds(totalSecs);
			viewModel.fillCircles();
			$('#counter .new').animate({bottom:'-100%'}, 300, function(){
				$("#counter .new select.hours").val(0);
				$("#counter .new select.minutes").val(0);
				$("#counter .new select.seconds").val(0);
				$("#counter .new .notes").val("");
			});
		}
	},
	counterNewCancel:function(){
		$('#counter .new').animate({bottom:'-100%'}, 300, function(){
			$("#counter .new select.hours").val(0);
			$("#counter .new select.minutes").val(0);
			$("#counter .new select.seconds").val(0);
			$("#counter .new .notes").val("");
		});
	},
	chartDone:function(){
		if( confirm('log new fill-ins?') ){
			var totalChants = this.totalChants();
			var totalSeconds = this.totalSeconds();

			var circles = 0;
			$('#chart .rows li span.logged').each(function(){
				$(this).removeClass('logged').addClass('selected');
				circles++;
			});
			totalSeconds += circles*15*60;
			totalChants += totalSeconds*1.111;
			this.totalChants(totalChants);
			this.totalSeconds(totalSeconds);
			this.logs.push({
				timestamp: ko.observable(new Date() ), 
				seconds: ko.observable(circles*15*60), 
				note: ko.observable("")
			});
		}
	},
	fillCircles:function(){
		var secs = viewModel.totalSeconds();
		var mins = secs/60;
		var fifteen = Math.floor(mins/15);
		var i = 0;
		for( i=0; i < fifteen; i++ ){
			$('#chart .main .inside .rows li span:not(.label)').eq(i).addClass('selected');
		}
	}
}
var timeout;
function startCounter(){
	timeout = setTimeout(function(){
		viewModel.totalChants(viewModel.totalChants()+1.111);
		viewModel.totalSeconds(viewModel.totalSeconds()+1);
		viewModel.seconds(viewModel.seconds()+1);
		startCounter();
	}, 1000);
}
function pauseCounter(){
	clearTimeout( timeout );
}
function resetCounter(){
	clearTimeout( timeout );
	var secs = viewModel.seconds();
	var total = viewModel.totalSeconds() - secs;
	var totalChants = viewModel.totalChants() - secs*1.111;
	viewModel.totalChants(totalChants);
	viewModel.totalSeconds(total);
	viewModel.seconds(0);
}
var time = ko.computed(
	function(){
		var secs = viewModel.seconds();
		var mins = Math.floor(secs/60);
		secs = secs%60;
		var hrs = Math.floor(mins/60);
		mins = mins%60;
		if( secs < 10 ){
			secs = "0" + secs;
		}
		if( mins < 10 ){
			mins = "0" + mins;
		}
		return hrs+":"+mins+":"+secs;
	});
var timeTotal = ko.computed(
	function(){
		var secs = viewModel.totalSeconds();
		var mins = Math.floor(secs/60);
		secs = secs%60;
		var hrs = Math.floor(mins/60);
		mins = mins%60;
		if( secs < 10 ){
			secs = "0" + secs;
		}
		if( mins < 10 ){
			mins = "0" + mins;
		}
		return hrs+":"+mins+":"+secs;
	}
);

$(function () {
  ko.applyBindings(viewModel);
});
