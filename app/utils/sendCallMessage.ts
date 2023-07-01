export default async function sendCallMessage(device: String, data: Object) {
    try {
        console.log('⚙️Preparing to send message', device, data);
        const res = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'key=AAAAu3T5eSI:APA91bFfynL6hecTGjN4jGBUULhccdSWIBKjG0oBWefs3D5KvDu5IWHUJSJD9F3uMjhmuZbXqsUSj6GBsqRYkQgt2d2If4FUaYHy3bZ-E8NpBhqHYjsyfB9D1Nk-hxVKelYn165SqRdL',
            },
            body: JSON.stringify({
                to: device,
                notification: {
                    body: 'This is call message',
                    OrganizationId: '2',
                    content_available: false,
                    priority: 'high',
                    subtitle: 'Call message',
                    title: 'Call Message',
                },
                data,
            }),
        });
        const resData = await res.json();
        if (resData.success !== 1) {
            console.log(resData);
            throw new Error('Send message failed');
        }
        console.log('📧 Sent message: ', data);
    } catch (err) {
        console.log(err);
    }
}
