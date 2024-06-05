const toastrNotifications = {
    showToastrNotification: (type, message, title) => {
        switch (type) {
            case 'success':
                try {
                    toastr.success(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                    console.log(`Success notification: ${title} - ${message}`);
                } catch (error) {
                    console.error(`Error displaying success notification: ${error.message}`, error);
                }
                break;
            case 'error':
                try {
                    toastr.error(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                    console.log(`Error notification: ${title} - ${message}`);
                } catch (error) {
                    console.error(`Error displaying error notification: ${error.message}`, error);
                }
                break;
            case 'info':
                try {
                    toastr.info(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                    console.log(`Info notification: ${title} - ${message}`);
                } catch (error) {
                    console.error(`Error displaying info notification: ${error.message}`, error);
                }
                break;
            case 'warning':
                try {
                    toastr.warning(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                    console.log(`Warning notification: ${title} - ${message}`);
                } catch (error) {
                    console.error(`Error displaying warning notification: ${error.message}`, error);
                }
                break;
            default:
                console.error('Unsupported toastr notification type');
        }
    }
};

if (typeof window !== 'undefined') {
    window.toastrNotifications = toastrNotifications;
}

toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    showDuration: '400',
    hideDuration: '1000',
    timeOut: '7000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
};