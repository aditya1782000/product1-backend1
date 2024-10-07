import { Kafka } from 'kafkajs';

const myKafka = new Kafka({
    clientId: process.env.CLIENT_ID || '',
    brokers: [process.env.KAFKA_BROKER || ''],
});

export async function init() {
    try {
        const admin = myKafka.admin();
        console.log('Admin Connecting...');
        admin.connect();
        console.log('Admin connection Success...');

        const topicName = process.env.TOPIC_ONE || '';

        const topicList = await admin.listTopics();

        if (!topicList.includes(topicName)) {
            console.log(`Creating Topic [${topicName}]`);
            try {
                await admin.createTopics({
                    topics: [
                        {
                            topic: topicName || '',
                            numPartitions: 4,
                        },
                    ],
                });
                console.log(`Topic Created Successfully [${topicName}]`);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return {
                        statusCode: 500,
                        success: false,
                        message: error.message || 'Something went wrong',
                    };
                }

                return {
                    statusCode: 500,
                    success: false,
                    message: 'Something went wrong',
                };
            }
        } else {
            console.log(`Topic [${topicName}] already exists`);
        }
        console.log('Disconnecting Admin...');
        await admin.disconnect();
        return {
            statusCode: 200,
            success: true,
            message: 'Kafka setup successful',
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
}

export { myKafka };
