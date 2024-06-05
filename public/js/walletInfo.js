document.addEventListener("DOMContentLoaded", function() {
  const updateWalletInfo = () => {
    fetch('/wallet-info') // Changed endpoint to match the server configuration
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        document.querySelector('#balance').innerText = `${data.balance} USDT`;
        document.querySelector('#commission').innerText = `${data.commission} USDT`;
      })
      .catch(error => {
        console.error('Error fetching wallet info:', error);
        console.error(error.stack);
      });
  };

  // Update wallet info every 30 seconds
  setInterval(updateWalletInfo, 30000);
});