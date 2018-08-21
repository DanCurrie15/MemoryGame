/*
 * Create a list that holds all of your cards
 */
const cardList = Array.from(document.getElementsByClassName('card'));
/*
 * Cards to compare later, move counter, matches counter and minutes and seconds for game timer
 */
let cardOne = null, cardTwo = null, moves = 0, numMatches = 0, seconds = 0, minutes = 0, gameTimerVar;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided 'shuffle' method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// cycles thru card class and replaces their innerHTML with the shuffle
function addCardsToPage(array) {
  let deck = document.getElementsByClassName('card');
  const shuffledArray = shuffle(array);
  // not sure why this is necessary, but deck[i].innerHTML = shuffledArray[i].innerHTML doesn't work
  let htmlArrary = [];
  for (let x = 0; x < shuffledArray.length; x++) {
    htmlArrary.push(shuffledArray[x].innerHTML);
  }
  // sets the cards on the page to the order in the shuffled array
  for(let i = 0; i < deck.length; i++) {
    deck[i].innerHTML = htmlArrary[i];
  }
}

addCardsToPage(cardList);
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function
      that you call from this one)
 *  - add the card to a *list* of 'open' cards (put this functionality in
      another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this
        functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the
        card's symbol (put this functionality in another function that you call
        from this one)
 *    + increment the move counter and display it on the page (put this
        functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put
        this functionality in another function that you call from this one)
 */

// run function when card is clicked
document.querySelector('.deck').addEventListener('click', function(evt) {
  if ((evt.target.className === 'card_face card_face-front') && (cardTwo === null)) {
    openCard(evt.target.parentElement);
    // increments # of moves
    document.querySelector('.moves').innerHTML = ++moves;
    // start game timer
    if (moves === 1) {
      gameTimerVar = setInterval(gameTimer, 1000);
    }
    // removes stars after # of moves
    else if (moves === 30) {
      let star = document.querySelector('.stars');
      star.removeChild(star.childNodes[1]);
    }
    else if (moves === 40) {
      let star = document.querySelector('.stars');
      star.removeChild(star.childNodes[2]);
    }
  }
});

// refresh page / restart game from score panel
document.querySelector('.restart').addEventListener('click', function() {
  location.reload();
});

// refresh page / restart game from win game panel
document.querySelector('.button').addEventListener('click', function() {
  location.reload();
});

// css change to open cards
function openCard(card) {
  card.classList.remove('is-flipped');
  compareCards(card);
}

// check if cards match or  not
function compareCards(card) {
  if (cardOne == null) {
    cardOne = card;
  }
  else if (cardTwo == null) {
    cardTwo = card;
    if (cardOne.innerHTML === cardTwo.innerHTML) {
      // time out function ensures 2nd card finishes transform before compare
      setTimeout(function() {cardsMatch(cardOne,cardTwo);},1000);
      // increment number of matched pairs
      numMatches++;
      if (numMatches === 8){
        // stop game timer
        clearInterval(gameTimerVar);
        setTimeout(function() {winGame();},1000);
      }
      console.log('matched');
    } else {
      // time out function ensures 2nd card finishes transform before compare
      setTimeout(function() {cardsNotMatch(cardOne, cardTwo);},1000);
      console.log('not matched');
    }
  }
}

// css change if cards match
function cardsMatch(matchOne, matchTwo) {
  // empty cards to compare
  cardOne = null;
  cardTwo = null;
  // change CSS of matched cards
  matchOne.querySelector('.card_face-back').classList.add('match');
  matchTwo.querySelector('.card_face-back').classList.add('match');
  // animate matched cards
  matchOne.classList.add('scale_div');
  matchTwo.classList.add('scale_div');
}

// css change if cards do not match
function cardsNotMatch(matchOne, matchTwo) {
  // empty cards to compare
  cardOne = null;
  cardTwo = null;
  // change CSS of cards that do not match
  matchOne.querySelector('.card_face-back').classList.add('not-match');
  matchTwo.querySelector('.card_face-back').classList.add('not-match');
  // animate non-matching cards
  matchOne.classList.add('shake_div');
  matchTwo.classList.add('shake_div');
  // change CSS and animate back to original CSS
  setTimeout(function() {matchOne.classList.remove('shake_div');
  matchTwo.classList.remove('shake_div');},500);
  setTimeout(function() {
  matchOne.classList.add('is-flipped');
  matchTwo.classList.add('is-flipped');
  matchOne.querySelector('.card_face-back').classList.remove('not-match');
  matchTwo.querySelector('.card_face-back').classList.remove('not-match');},600);
}

// displays amount of time game has been played
function gameTimer() {
  ++seconds;
  if (seconds > 59) {
    seconds = 0;
    ++minutes;
  }
  document.querySelector('.timer').innerHTML = 'Time: ' + minutes + ':' + ('0' + seconds).slice(-2);
}

// show game win window
function winGame() {
  document.querySelector('.stars-win-game-panel').innerHTML = document.querySelector('.stars').innerHTML;
  document.querySelector('.moves-win-game-panel').innerHTML = document.querySelector('.moves').innerHTML;
  document.querySelector('.timer-win-game-panel').innerHTML = document.querySelector('.timer').innerHTML;
  document.querySelector('.win-game-panel').style.visibility = 'visible';
}
