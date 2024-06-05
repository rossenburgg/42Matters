// Toastr global options configuration
toastr.options = {
  closeButton: true, // Show close button
  debug: false, // Debug mode
  newestOnTop: true, // Display new toasts on top
  progressBar: true, // Show progress bar
  positionClass: "toast-top-right", // Position of toast
  preventDuplicates: true, // Prevent duplicate toasts
  onclick: null, // On click function
  showDuration: "300", // Duration of the show animation
  hideDuration: "1000", // Duration of the hide animation
  timeOut: "5000", // How long the toast will display without user interaction
  extendedTimeOut: "1000", // How long the toast will display after a user hovers
  showEasing: "swing", // Show animation easing
  hideEasing: "linear", // Hide animation easing
  showMethod: "fadeIn", // Show method
  hideMethod: "fadeOut", // Hide method
  tapToDismiss: true // Dismiss on tap
};

console.log("Toastr options configured.");