class Trivia {
	constructor(question) {
		this.question = question.question;
		this.options = question.options;
		this.answer = question.answer;
	}

	drawQuestion() {
		writeTextAtLine(this.question, 1);
	}

	drawOptions() {
		let lineStart = 5;
		this.options.forEach(option => { 
			let displayText = Object.keys(option)[0] + ') ' + Object.values(option)[0];
			writeTextAtLine(displayText, lineStart);
			lineStart++;	
		});
	}

    isCorrect = function(entry) {
        if(entry.toUpperCase() === this.answer) {
            return true;
        } else {
            return false;
        }
    }

    init() {
    	this.drawQuestion();
    	this.drawOptions();
    }

}