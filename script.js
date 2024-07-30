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
  
        function showCard() {
          if (index < data.length) {
            let item = data[index];
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
              <div class="card">
                <strong>${value}</strong>
                <div class="explanation">${explanation}</div>
              </div>
            `;
            index++;
            showCard();
          }
        };
      })
      .catch(error => console.error('Error loading JSON:', error));
  });
  