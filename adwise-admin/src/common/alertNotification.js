import {store} from "react-notifications-component";

const alertNotification = ({ title, message, type }) => {
    store.addNotification({
        title: title || "Системное уведомление",
        message: message,
        type: type,
        insert: 'top',
        container: 'bottom-left',
        dismiss: {
            duration: 5000,
            onScreen: false,
            pauseOnHover: true,
            delay: 0
        }
    });
}

export default alertNotification
