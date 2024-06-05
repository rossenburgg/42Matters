document.addEventListener('DOMContentLoaded', function() {
  const depositForm = document.getElementById('depositForm');
  depositForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('depositAmount').value;
    console.log(`Attempting to deposit amount: ${amount}`);
    fetch('/wallet-info')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('balance').innerText = data.balance;
        console.log('Balance updated successfully.');
        toastrNotifications.showToastrNotification('success', `Successfully deposited $${amount}`, 'Deposit Success');
      })
      .catch(error => {
        console.error('Error updating balance:', error);
        toastrNotifications.showToastrNotification('error', 'There was an error updating your balance. Please try again.', 'Update Error');
      });
  });
});