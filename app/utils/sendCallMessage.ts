export default async function sendCallMessage(device: String, data: Object) {
    try {
        console.log('⚙️Preparing to send message', device, data);
        const res = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'key=AAAA_NhSjHE:APA91bG6cuT7eAiPJEz59D1bG9QaC-0F-UEKLt16bIGz29Q7LPZuoWmQFHldzhVuJthqv6ozkVwN3n7Cz1IKYmsQ7u-SbjgxVnOD83kzI6qtESYP0o5FcwCDkUqOXKieo8DDiBiQUihv',
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
