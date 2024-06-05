const toastrNotifications = {
    showToastrNotification: (type, message, title) => {
        switch (type) {
            case 'success':
                toastr.success(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                console.log(`Success toastr: ${title} - ${message}`);
                break;
            case 'error':
                toastr.error(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                console.error(`Error toastr: ${title} - ${message}`);
                break;
            case 'info':
                toastr.info(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                console.log(`Info toastr: ${title} - ${message}`);
                break;
            case 'warning':
                toastr.warning(message, title, { closeButton: true, progressBar: true, timeOut: 5000 });
                console.warn(`Warning toastr: ${title} - ${message}`);
                break;
            default:
                console.error('Unsupported toastr notification type');
        }
    }
};

if (typeof window !== 'undefined') {
    window.toastrNotifications = toastrNotifications;
}