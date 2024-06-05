// Establish a connection to the server using socket.io-client
const socket = io();

// Listen for the 'balance update' event from the server
socket.on('balance update', (data) => {
  try {
    // Update the UI with the new balance
    const balanceElement = document.getElementById('balance');
    const commissionElement = document.getElementById('commission'); // Ensure commission element is targeted for updates
    if (balanceElement && commissionElement) {
      balanceElement.textContent = data.newBalance + ' USDT';
      commissionElement.textContent = data.newCommission + ' USDT'; // Update the commission element with new data
      console.log(`Balance updated to ${data.newBalance} USDT`);
      console.log(`Commission updated to ${data.newCommission} USDT`); // Log the commission update for clarity
    } else {
      console.error('Balance or commission element not found on the page.');
    }
  } catch (error) {
    console.error('Error updating balance or commission on the client side:', error.message);
    console.error(error.stack);
  }
});