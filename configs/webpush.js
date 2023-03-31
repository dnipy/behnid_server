import webpush from 'web-push'


export const VAPID_KEY = {
    publicKey : "BAunpsSIpYbTmBW2aEm6c2ov5KoX1XSyLOIV83prWsrh745rXwAxsP-iTgDVAUMkNXX0opyBxCGhY1h8V6DVjJ4",
    privateKey : "R2ua6vI5Ac5QbCBpTBKyqtr6AaufbbvwGS847pzfSiI"
}

const subscription = {
    endpoint: '/web-push-server-end-point',
    keys: {
        auth: '',
        p256dh: '',
    },
};


const payload = {
    notification: {
        title: 'پیام جدید',
        body: 'شما یک پیام جدید از سمت کاربر دارید',
        icon: 'assets/icons/icon-384x384.png',
        actions: [
            // { action: 'bar', title: 'Focus last' },
            // { action: 'baz', title: 'Navigate last' },
        ],
        data: {
            onActionClick: {
                default: { operation: 'openWindow' },
                // bar: {
                //     operation: 'focusLastFocusedOrOpen',
                //     url: '/signin',
                // },
                // baz: {
                //     operation: 'navigateLastFocusedOrOpen',
                //     url: '/signin',
                // },
            },
        },
    },
};

const options = {
    vapidDetails: {
        subject: 'mailto:behnid.com@gmail.com',
        publicKey: VAPID_KEY.publicKey,
        privateKey: VAPID_KEY.privateKey,
    },
    TTL: 60,
};

export const sendNotif = webpush.sendNotification(subscription,JSON.stringify(payload),options)
