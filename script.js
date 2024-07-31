document.addEventListener('DOMContentLoaded', () => {
    fetch('values.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data loaded:', data); // Debugging line
        let index = 0;
        let cardDeck = [...data]; // Create a copy of the original data

        function showCard() {
          if (cardDeck.length > 0) {
            let item = cardDeck[0];
            let value = item.value;
            let explanation = item.explanation;
            document.getElementById('card').innerHTML = `
              <strong>${value}</strong>
              <div class="explanation">${explanation}</div>
            `;
          } else {
            document.getElementById('card').innerHTML = 'No more values.';
          }
        }
        
        showCard();
  
        window.categorize = (category) => {
          let cardContent = document.getElementById('card').innerHTML;
          if (cardContent !== 'No more values.') {
            let value = document.getElementById('card').querySelector('strong').innerText;
            let explanation = document.getElementById('card').querySelector('.explanation').innerText;
            document.getElementById(category).innerHTML += `
              <div class="card" onclick="moveToTopDeck(this, '${category}')">
                <strong>${value}</strong>
                <div class="explanation">${explanation}</div>
              </div>
            `;
            cardDeck.shift(); // Remove the first card from the deck
            showCard();
          }
        };

        window.moveToTopDeck = (cardElement, category) => {
          let value = cardElement.querySelector('strong').innerText;
          let explanation = cardElement.querySelector('.explanation').innerText;
          cardDeck.unshift({ value, explanation });
          cardElement.remove();
          showCard();
        };
      })
      .catch(error => console.error('Error loading JSON:', error));
  });