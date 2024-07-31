document.addEventListener('DOMContentLoaded', () => {
  // Add the save button to the DOM
  const saveButton = document.createElement('button');
  saveButton.id = 'saveButton';
  saveButton.innerText = 'Save to PDF';
  saveButton.style.position = 'fixed';
  saveButton.style.top = '10px';
  saveButton.style.right = '10px';
  document.body.appendChild(saveButton);

  // Define saveToPDF function
  function saveToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const categories = ['very-important', 'important', 'not-important'];
    let yOffset = 10;

    categories.forEach(category => {
      const categoryElement = document.getElementById(category);
      if (!categoryElement) {
        console.warn(`Category element '${category}' not found`);
        return; // Skip this category and continue with the next one
      }

      const cards = categoryElement.querySelectorAll('.card');

      doc.setFontSize(16);
      doc.text(category.toUpperCase().replace('-', ' '), 10, yOffset);
      yOffset += 10;

      if (cards.length === 0) {
        doc.setFontSize(10);
        doc.text('No items in this category', 15, yOffset);
        yOffset += 10;
      } else {
        cards.forEach(card => {
          const value = card.querySelector('strong').innerText;
          const explanation = card.querySelector('.explanation').innerText;

          doc.setFontSize(12);
          doc.text(value, 15, yOffset);
          yOffset += 5;

          doc.setFontSize(10);
          const splitExplanation = doc.splitTextToSize(explanation, 180);
          doc.text(splitExplanation, 20, yOffset);
          yOffset += splitExplanation.length * 5 + 5;

          if (yOffset > 280) {
            doc.addPage();
            yOffset = 10;
          }
        });
      }

      yOffset += 10;
    });

    const currentDate = new Date();
    
    // Convert to PST
    const pstDate = new Date(currentDate.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    
    // Format the date
    const formattedDate = pstDate.getFullYear() +
      '-' + String(pstDate.getMonth() + 1).padStart(2, '0') +
      '-' + String(pstDate.getDate()).padStart(2, '0') +
      '_' + String(pstDate.getHours()).padStart(2, '0') +
      '-' + String(pstDate.getMinutes()).padStart(2, '0') +
      '-' + String(pstDate.getSeconds()).padStart(2, '0');

    doc.save(`person_values_${formattedDate}.pdf`);
  }

  // Add event listener for the save button
  saveButton.addEventListener('click', saveToPDF);

  function prepareDataForChatGPT() {
    const categories = ['very-important', 'important', 'not-important'];
    let result = "Here are my categorized personal values:\n\n";

    categories.forEach(category => {
      const categoryElement = document.getElementById(category);
      if (!categoryElement) {
        console.warn(`Category element '${category}' not found`);
        return;
      }

      const cards = categoryElement.querySelectorAll('.card');
      result += `${category.toUpperCase().replace('-', ' ')}:\n`;

      if (cards.length === 0) {
        result += "No items in this category\n";
      } else {
        cards.forEach(card => {
          const value = card.querySelector('strong').innerText;
          const explanation = card.querySelector('.explanation').innerText;
          result += `- ${value}: ${explanation}\n`;
        });
      }

      result += "\n";
    });

    result += "Based on these personal values, please provide insights and suggestions for personal growth and development.";

    // Copy the result to clipboard
    navigator.clipboard.writeText(result).then(() => {
      alert("Data prepared and copied to clipboard. You can now paste it into ChatGPT.");
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert("Failed to copy to clipboard. Please check console for error details.");
    });
  }

  // Modify the existing prepare button
  const prepareButton = document.createElement('button');
  prepareButton.id = 'prepareButton';
  prepareButton.innerText = 'Prepare for ChatGPT';
  prepareButton.style.position = 'fixed';
  prepareButton.style.top = '50px';
  prepareButton.style.right = '10px';
  document.body.appendChild(prepareButton);

  // Add event listener for the prepare button
  prepareButton.addEventListener('click', prepareDataForChatGPT);

  // Add background image
  const backgroundStyle = document.getElementById('backgroundStyle');
  backgroundStyle.textContent = `
    body {
      background-image: url('background.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }
  `;

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