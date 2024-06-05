document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.confirm-purchase').forEach(button => {
        button.addEventListener('click', function() {
            const purchaseId = this.getAttribute('data-purchase-id');
            fetch(`/admin/purchase/${purchaseId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Purchase ${purchaseId} confirmed successfully.`);
                    window.location.reload();
                } else {
                    console.error(`Failed to confirm purchase ${purchaseId}.`);
                    alert('Failed to confirm purchase.');
                }
            })
            .catch(error => {
                console.error('Error confirming purchase:', error);
                alert('Error confirming purchase.');
            });
        });
    });

    document.querySelectorAll('.reject-purchase').forEach(button => {
        button.addEventListener('click', function() {
            const purchaseId = this.getAttribute('data-purchase-id');
            fetch(`/admin/purchase/${purchaseId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Purchase ${purchaseId} rejected successfully.`);
                    window.location.reload();
                } else {
                    console.error(`Failed to reject purchase ${purchaseId}.`);
                    alert('Failed to reject purchase.');
                }
            })
            .catch(error => {
                console.error('Error rejecting purchase:', error);
                alert('Error rejecting purchase.');
            });
        });
    });
});