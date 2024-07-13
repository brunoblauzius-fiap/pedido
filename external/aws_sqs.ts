import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { v4 as uuid } from 'uuid';

class AWSSQS 
{
    sqsClient : SQSClient = null;

    queueUrl = process.env.AWS_SQS_URL;

    constructor() {
        let configs = {
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        };
        
        if (process.env.DEBUG=='true') {
            configs['endpoint'] = "http://localstack:4566";
        } 
        
        this.sqsClient = new SQSClient(configs);
    }

    async send(message:string, queue : string) {
        try {

            const params = {
                QueueUrl: `${this.queueUrl}${queue}`,
                MessageBody: message,
                MessageGroupId : uuid(),
                MessageDeduplicationId : uuid(),
            };

            const response = await this.sqsClient.send(
                new SendMessageCommand(params)
            );
            console.log("Mensagem enviada com sucesso:", response.MessageId);
        } catch (err) {
            console.error("Erro ao enviar a mensagem:", err);
        }
    }

    async receive(queue: string) {
        const params = {
            QueueUrl: `${this.queueUrl}${queue}`,
            MaxNumberOfMessages: 1, // Número máximo de mensagens a serem recebidas
        };
        try {
            const response = await this.sqsClient.send(
                new ReceiveMessageCommand(params)
            );
            return response.Messages;
        } catch (err) {
            console.error("Erro ao receber mensagens:", err);
        }
    }

    async deleteMessage(receiptHandle: string, queue: string) {
        try {
          const params = {
            QueueUrl: `${this.queueUrl}${queue}`,
            ReceiptHandle: receiptHandle,
          };
      
          const command = new DeleteMessageCommand(params);
          await this.sqsClient.send(command);
          console.log("Mensagem excluída com sucesso");
        } catch (error) {
          console.error("Erro ao excluir a mensagem:", error);
        }
    }
}


export default AWSSQS;