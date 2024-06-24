import AWSSQS from "../external/aws_sqs";
import { IQueue } from "../interfaces/IQueue";

class QueueSubscribeRepository implements IQueue {
    
    queue_name : string = process.env.AWS_SQS_PEDIDO_ENTREGA;

    constructor( readonly sqsQueue: AWSSQS ) {}

    async pedidoEntrega(): Promise<void> {
        
        const messages = await this.sqsQueue.receive(this.queue_name);

        if (messages) {
            for (const message of messages) {
                console.log("Messagem recebida:" , message.Body );          
                // Excluir a mensagem da fila após o processamento
                await this.sqsQueue.deleteMessage(message.ReceiptHandle!, this.queue_name);
            }
        } 
        
    }
}

export default QueueSubscribeRepository;