document.addEventListener('DOMContentLoaded', function() {
    const claimRewardButton = document.querySelector('.modal-body .btn-primary');
    if (!claimRewardButton) return;

    claimRewardButton.addEventListener('click', function() {
        fetch('/api/claim-daily-reward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    response.json().then(data => {
                        toastr.error(data.message);
                        console.error('Failed to claim daily reward:', data.message);
                    });
                } else {
                    throw new Error('Failed to claim the daily reward');
                }
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.message) {
                toastr.success(data.message);
                if (data.newBalance !== undefined) {
                    document.getElementById('balance').textContent = data.newBalance;
                    console.log('Daily reward claimed successfully, balance updated.');
                }
            }
        })
        .catch(error => {
            toastr.error('An error occurred while claiming the daily reward.');
            console.error('Error claiming daily reward:', error.message, error.stack);
        });
    });
});