import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://stuffy:stuffyypass@localhost:5672';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Define Queues
        await channel.assertQueue('INVENTORY_SYNC', { durable: true });
        await channel.assertQueue('EMAIL_NOTIFICATIONS', { durable: true });
        await channel.assertQueue('user_behavior_tracking', { durable: true });
        
        console.log(`[RabbitMQ] Connected and queues initialized.`);
    } catch (err) {
        console.error('[RabbitMQ] Connection Error:', err);
    }
};

export const pubsub = {
    publish: (queue: string, message: any) => {
        if (!channel) {
            console.error(`[RabbitMQ] Channel not initialized. Cannot publish to ${queue}`);
            return;
        }
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`[RabbitMQ] Message published to ${queue}`);
    },
    
    subscribe: (queue: string, callback: (msg: any) => void) => {
        if (!channel) {
            console.error(`[RabbitMQ] Channel not initialized. Cannot subscribe to ${queue}`);
            return;
        }
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                channel.ack(msg);
            }
        });
    }
};
