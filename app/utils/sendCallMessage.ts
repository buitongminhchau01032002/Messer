export default async function sendCallMessage(device: String, data: Object) {
    try {
        console.log('⚙️Preparing to send message', device, data);
        const res = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'key=AAAArh5WpuU:APA91bFK0Rn1vNcKtdwKwOL8uRMlkwQAg3QB3DA_H02jdhRnKizn0S0eewGruC-bvbvIdsP3FBmvAtH79Y2RLrCg5Yz_jlEyQlF9tuzFzpbPjD7qrKIkLffc2ERr74-Fv_Bt04VxKr4r',
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
