import { useEffect, useState } from 'react';
import Confetti from 'react-confetti'; // Import Confetti component
import './App.css';

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [cardObjects, setCardObjects] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  const startGame = () => {
    const emojis = ['🎯', '🧩', '🕹️', '🎮', '🏆', '🔮'];
    const cardObjects = shuffleArray([...emojis, ...emojis]).map((emoji, index) => ({
      index,
      emoji,
      flipped: false,
      solved: false,
    }));
    setCardObjects(cardObjects);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleCardClick = (clickedCard) => {
    if (clickedCard.flipped || clickedCard.solved || selectedCards.length === 2) {
      return;
    }

    // Flip the clicked card
    setCardObjects((prevCards) =>
      prevCards.map((card) =>
        card.index === clickedCard.index ? { ...card, flipped: true } : card
      )
    );

    // Update selected cards state
    setSelectedCards((prevSelected) => [...prevSelected, clickedCard]);

    if (selectedCards.length === 1) {
      const [firstCard] = selectedCards;

      // Check for match
      if (firstCard.emoji === clickedCard.emoji) {
        setCardObjects((prevCards) =>
          prevCards.map((card) =>
            card.emoji === clickedCard.emoji ? { ...card, solved: true } : card
          )
        );
        setSelectedCards([]);
      } else {
        // Flip cards back if not a match after a short delay
        setTimeout(() => {
          setCardObjects((prevCards) =>
            prevCards.map((card) =>
              card.index === firstCard.index || card.index === clickedCard.index
                ? { ...card, flipped: false }
                : card
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Check if the player has won (all cards are solved)
  const hasWon = cardObjects.every((card) => card.solved);

  useEffect(() => {
    if (hasWon) {
      const timer = setTimeout(() => {
        startGame();
      }, 6000); // 

      return () => clearTimeout(timer);
    }
  }, [hasWon]);

  return (
    <main>
      {hasWon && <Confetti />} 
      {!hasWon && <h1>Memory Game Using React</h1>}
      {hasWon && <h2>Congratulations! You Won</h2>}
      <div className="card-container">
        {cardObjects.map((card) => (
          <div
            className={`card ${card.flipped ? 'active' : ''}`}
            key={card.index}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
