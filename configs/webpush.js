import webpush from 'web-push'


export const VAPID_KEY = {
    publicKey : "BHvpZKlLjdn8NqwHD5QOW2PUya580SUmiTyewT-bV__sfpjznRgNjrAKhXvYrOWIsSSabF0C7cM0SLctypU4RZk",
    privateKey : "FrNG3HiRr4eet3WJYlZD9lGNM4i52vpUl99m6lQgQNk"
}


const subscription = {
    endpoint: '/web-push-subscription',
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
        subject: 'mailto:dnipy@protonmail.com',
        publicKey: VAPID_KEY.publicKey,
        privateKey: VAPID_KEY.privateKey,
    },
    TTL: 60,
};

// export const sendNotif = webpush.sendNotification(subscription,JSON.stringify(payload),options)
