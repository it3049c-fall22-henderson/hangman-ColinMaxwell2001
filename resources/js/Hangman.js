class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty, next) {
    // get word and set it to the class's this.word
    this.word = await this.getRandomWord(difficulty);
    // clear canvas
    this.clearCanvas();
    // draw base
    this.drawBase();
    // reset this.guesses to empty array
    this.guesses = [];
    // reset this.isOver to false
    this.isOver = false;
    // reset this.didWin to false
    this.didWin = false;

  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    this.letter = letter;

    // Check if nothing was provided and throw an error if so   // Check if more than one letter was provided. throw an error if it is.

    try {
      if(letter.length < 1 || letter.length > 1)
      {
        throw new Error("Enter 1 letter, (a,b,c,d,e,f...)");
      }

    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    if(!letter.match(a-zA-Z))
    {
      throw new Error("No Symbols, enter a letter, (a,b,c,d,e,f...)");
    }
    
    // if it's a letter, convert it to lower case for consistency.
    if(letter.match(a-zA-Z))
    {
      letter = letter.toLowerCase();
    }

    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    if(!this.guesses.includes(letter))
    {
      // add the new letter to the guesses array.
      this.guesses.push(letter);
    }
    else
    {
      throw new Error("This letter has already been guessed!");
    }

    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
    if(this.word.includes(letter))
    {
      this.checkWin();
    }
    else
    {
      this.onWrongGuess();
    }

  
    } catch(error) {
      console.error(error);
    }
    
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
    
    var howMany = 0;
    var letterGuesses = this.word.split("");   
    var letterGuessesArray = new Array(this.word.split(""));                                                 
    letterGuesses = letterGuesses.filter(lettersLeft => this.guesses.includes(lettersLeft)).length;
    howMany = (letterGuessesArray.length - letterGuesses.length);

    if (howMany == 0)
    {
      this.isOver = true;
      this.didWin = true;
    }

  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    var userGuesses = this.guesses;

    if(userGuesses.length == 1)
    {
      this.drawHead();
    }

    if(userGuesses.length == 2)
    {
      this.drawBody();
    } 
    
    if(userGuesses.length == 3)
    {
      this.drawRightArm();
    } 
    
    if(userGuesses.length == 4)
    {
      this.drawLeftArm();
    } 
    
    if(userGuesses.length == 5)
    {
      this.drawRightLeg();
    } 
    
    if(userGuesses.length == 6)
    {
      this.drawLeftLeg();

      this.isOver = true;
      this.didWin = false;
    }

  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    const wordHolder = [];

    for(var i =0; i < this.word.length(); i++)
    {
      if(this.word.includes(guess)) 
      {
        wordHolder.push(this.guess)
      }

      else
      {
        wordHolder.push("_");
      }
    }

    return wordHolder;
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return this.guesses.join(", ");
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }


  //https://gamedevelopment.tutsplus.com/tutorials/how-to-create-an-html5-hangman-game-with-canvas-the-basic-gameplay--pre-28764
  drawHead() {
    this.ctx.beginPath();
    this.ctx.arc(180,120,23,0,Math.PI*2,false);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.moveTo(180,143);
    this.ctx.lineTo(180,248);
    this.ctx.stroke();
  }

  drawLeftArm() {
    this.ctx.moveTo(180,175);
    this.ctx.lineTo(142,167);
    this.ctx.stroke();
  }

  drawRightArm() {
    ctx.moveTo(180,175); 
	  ctx.lineTo(218,167); 
	  ctx.stroke(); 
  }

  drawLeftLeg() {
    ctx.moveTo(180,245); 
	  ctx.lineTo(145,270); 
	  ctx.stroke(); 
  }

  drawRightLeg() {
    ctx.moveTo(180,245); 
	  ctx.lineTo(215,270); 
	  ctx.stroke();
  }
}
