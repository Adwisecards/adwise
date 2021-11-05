import {store} from "react-notifications-component";

const alertNotification = ({ title, message, type, dismiss }) => {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: 'top',
        container: 'bottom-left',
        dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            delay: 0,
            showIcon: true,

            ...dismiss
        }
    });
}

alertNotification.defaultProps = {
    dismiss: {}
}

export default alertNotification
