document.addEventListener('DOMContentLoaded', function() {
  const deleteButtons = document.querySelectorAll('.btn-danger');

  deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const userId = this.getAttribute('href').split('/').pop();
        
        fetch(`/admin/users/delete/${userId}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log(`User with ID ${userId} successfully deleted.`);
              window.location.reload();
            } else {
              console.error('Failed to delete user. Error:', data.error);
              alert('Failed to delete user.');
            }
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            alert('Error deleting user.');
          });
      }
    });
  });
});