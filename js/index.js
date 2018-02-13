class Screen{
	constructor(){
		this.phrases = [['LEBRON JAMES', 'hint: king'], ['KEVIN DURANT', 'hint: snake'], ['CARMELO ANTHONY', 'hint: hoodie'], ['JIMMY BUTLER', 'hint: buckets']];
		this.currentPhrase = '';
		this.round = 0
	}
	setPhrase(){
		this.round++
		$('#round-count').html("Round:" + this.round)
		this.currentPhrase = this.phrases[this.round -1];
		$('.phrase-row').empty();
		$('#hint').html(this.currentPhrase[1])
		for (var i = 0; i < this.currentPhrase[0].length; i++) {
			console.log(this.currentPhrase[i]);
			$('.phrase-row').append('<div id="' + this.currentPhrase[0][i] + '" data-letter="' + this.currentPhrase[0][i] + '" class="col-sm-1 letter-display">' + this.currentPhrase[0][i] + '</div>');
			//$('.letter-space').each(("", "white");
			//'<p data-letter="' + this.currentPhrase[0][i] + '">' + this.currentPhrase[i] + '</p>'
		}
	}
	checkLetter(letter){
		$('.letter-display').each(function(){
			if ($(this).data('letter') === letter) {
				$(this).css("text-indent", "0px");
				$(this).css("background", "green");
			}
		});
	}
	guessPhrase(){
		var make_guess = prompt("Turn on caps lock. Make your guess.", "");
		if (make_guess === this.currentPhrase) {
	    alert("You are correct!");
	    Cookies.set('total-money', "1000000");
		} else if (make_guess === null) {
				alert("Coward");
				}	else {
			    alert("WRONG!");
			    Cookies.set('total-money', "-1000000");
		}
	}
	
}

class Wheel{
	constructor(){
		this.moneyAmounts = [0, 'bankrupt', 200, 300, 300, 400, 450, 450, 500, 550, 600, 650, 650, 700, 750, 800, 800, 900, 5000]; //cookies to save
		var total = Cookies.get('total-money');
		this.totalMoney = total ? JSON.parse(total) : 1000;
		var turns = Cookies.get('turns');
		this.turnsTaken = turns ? JSON.parse(turns) : 0;
	}
	selectAmount(){
		var random_amount = this.moneyAmounts[Math.floor(Math.random() * this.moneyAmounts.length)];
		if (random_amount === 'bankrupt'){
			this.totalMoney = Cookies.set('total-money', JSON.stringify(0));
			alert("Bankrupt!");
		} else {
				this.totalMoney =	random_amount + this.totalMoney
				Cookies.set('total-money', JSON.stringify(this.totalMoney));
			}
	}
	setTotalAmount(){
		var total = Cookies.get('total-money');
		this.totalMoney = total ? JSON.parse(total) : 1000;
		//JSON.parse(Cookies.get('total-money'));
		$('#balance').html('Money: $' + this.totalMoney + '');
		Cookies.set('total-money', JSON.stringify(this.totalMoney));
	}
	subtractForGuess(){
		this.totalMoney = this.totalMoney - 100
		Cookies.set('total-money', JSON.stringify(this.totalMoney));
	}
	checkAmount(){
		//this.totalMoney
		if (this.totalMoney < 0){
			alert("You owe us. Get out.");
			Cookies.set('total-money', '1000');
			$('html').empty();
		} else if (this.totalMoney >= 5000){
				alert("You Win! Give us your credit card information for a new car!");
				Cookies.set('total-money', '1000');
			}
	}
	changeTurns(){
		var turns = Cookies.get('turns');
		console.log(turns = Cookies.get('turns'));
		this.turnsTaken = turns ? JSON.parse(turns) : 0;
		if (this.turnsTaken > 5){
			$('.active').removeClass("active").addClass("inactive");
			console.log($('.active'));
			Cookies.set('turns', '0');
			console.log(Cookies.set('turns', '0'));
			} else {
					this.turnsTaken++
					console.log(this.turnsTaken);
					Cookies.set('turns', JSON.stringify(this.turnsTaken));
			}
			$('.turns-left').html('Turns to spin: ' + (5 - this.turnsTaken) +'');
			console.log($('.turns-left'));
	}
}


$(function(){
	var screen = new Screen();
	var wheel = new Wheel();
	wheel.setTotalAmount();
	screen.setPhrase();
	screen.checkLetter(' ');

	var letter_button = $('.letter-button');
	letter_button.on('click', function(){
		screen.checkLetter($(this).data('letter'));
		wheel.subtractForGuess();
		wheel.setTotalAmount();
		wheel.checkAmount();
		wheel.changeTurns();
	});

	var spin_button = $('.active');
	spin_button.on('click', function(){
		if (!$(this).hasClass("inactive")){
			wheel.selectAmount();
			wheel.setTotalAmount();
			wheel.checkAmount();
			$(this).removeClass("active").addClass("inactive");
		}
	});

	var guess_button = $('.guess');
	guess_button.on('click', function(){
		screen.guessPhrase();
		wheel.setTotalAmount();
		wheel.checkAmount();
		screen.setPhrase();
	});
	var next = $('#next-round')
	next.on('click', function(){
		screen.setPhrase();
		screen.checkLetter(' ');
	});
});
