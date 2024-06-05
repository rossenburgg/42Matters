document.addEventListener('DOMContentLoaded', function() {
    const redeemPointsButton = document.querySelector('#redeemPointsButton');
    if (redeemPointsButton) {
        redeemPointsButton.addEventListener('click', function() {
            // Removed the static userId assignment. Assuming the server-side logic to identify the user based on session or authentication token.
            fetch('/loyalty/redeem-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming the server can identify the user from the session or a secure token, so no need to send userId explicitly
                },
                body: JSON.stringify({ points: 100 }), // Example value, adjust based on your redemption logic
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Loyalty points redeemed successfully.');
                    // Update UI to reflect the new loyalty points balance
                    document.querySelector('#loyaltyPoints').textContent = data.loyaltyPoints;
                } else {
                    console.error('Failed to redeem loyalty points:', data.error);
                    alert('Failed to redeem loyalty points. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error redeeming loyalty points:', error);
                alert('An error occurred while redeeming loyalty points. Please try again.');
            });
        });
    }
});