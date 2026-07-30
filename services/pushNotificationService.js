const { getMessaging } = require("firebase-admin/messaging");

const sendPushNotification = async ({
  token,
  title,
  body,
}) => {
  try {
    if (!token) {
      console.log("No FCM Token found.");
      return;
    }

    const message = {
  token,

  notification: {
    title,
    body,
  },

  webpush: {
    notification: {
      icon: "/EWS_logo_192x192.png",
      badge: "/bage.png",
      requireInteraction: true,
      vibrate: [200, 100, 200],
    },

    fcmOptions: {
      link: "http://localhost:5173/orders",
    },
  },
};

    const response = await getMessaging().send(message);

    console.log("Push Notification Sent:", response);

    return response;
  } catch (error) {
    console.error("Push Notification Error:", error);
  }
};

module.exports = {
  sendPushNotification,
};