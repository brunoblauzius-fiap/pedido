import AWSSQS from "../external/aws_sqs";
import { IDataBase } from "../interfaces/IDataBase";
import { IQueue } from "../interfaces/IQueue";
import PedidoRepository from "./PedidoRepository";
import { PedidoCasoDeUso } from "../cases/pedidoCasodeUso";
import Pedido from "../entity/pedido";

class QueueSubscribeRepository implements IQueue {
    
    queue_name : string = process.env.AWS_SQS_PEDIDO_ENTREGA;

    repository : PedidoRepository;
    pedido : Pedido;

    constructor( 
        readonly sqsQueue: AWSSQS, 
        readonly dataBase : IDataBase
    ) {
        this.repository = new PedidoRepository(dataBase);
    }

    async pedidoFinalizado() : Promise<void> {
        /**
         * {idPedido : int}
         */
        const messages = await this.sqsQueue.receive(process.env.AWS_SQS_PEDIDO_FINALIZADO);

        if (messages) {
            for (const message of messages) {
                console.log("Messagem recebida pedidoFinalizado:" , message.Body ); 
                let idPedido = JSON.parse(message.Body).idPedido; 
                // Excluir a mensagem da fila após o processamento
                this.pedido = await this.repository.findById(idPedido);
                if (this.pedido != null) {
                    PedidoCasoDeUso.pedidoFinalizado(
                        this.pedido,
                        this.repository
                    );
                    await this.sqsQueue.deleteMessage(message.ReceiptHandle, process.env.AWS_SQS_PEDIDO_FINALIZADO);
                } else {
                    console.log(`Pedido com o ID ${idPedido} não exite.`);
                }
            }
        } 
    }

    async pedidoCancelado(): Promise<void> {
        /**
         * {idPedido : int}
         */
        const messages = await this.sqsQueue.receive(process.env.AWS_SQS_CANCELAR_PEDIDO);

        if (messages) {
            for (const message of messages) {
                console.log("Messagem recebida cancelarPedido:" , message.Body ); 
                let idPedido = JSON.parse(message.Body).idPedido; 
                // Excluir a mensagem da fila após o processamento
                this.pedido = await this.repository.findById(idPedido);
                if (this.pedido != null) {
                    PedidoCasoDeUso.pedidoCancelado(
                        this.pedido,
                        this.repository,
                        this.sqsQueue
                    );
                    await this.sqsQueue.deleteMessage(message.ReceiptHandle, process.env.AWS_SQS_CANCELAR_PEDIDO);
                } else {
                    console.log(`Pedido com o ID ${idPedido} não exite.`);
                }
            }
        } 
    }

    async pedidoConfirmado(): Promise<void> {
        /**
         * {idPedido : int}
         */
        const messages = await this.sqsQueue.receive(process.env.AWS_SQS_CONFIRMACAO_PAGAMENTO);

        if (messages) {
            for (const message of messages) {
                console.log("Messagem recebida pedidoConfirmado:" , message.Body ); 
                let idPedido = JSON.parse(message.Body).idPedido; 
                // Excluir a mensagem da fila após o processamento
                this.pedido = await this.repository.findById(idPedido);
                if (this.pedido != null) {
                    PedidoCasoDeUso.pedidoConcluido(
                        this.pedido,
                        this.repository,
                        this.sqsQueue
                    );
                    await this.sqsQueue.deleteMessage(message.ReceiptHandle, process.env.AWS_SQS_CONFIRMACAO_PAGAMENTO);
                } else {
                    console.log(`Pedido com o ID ${idPedido} não exite.`);
                }
            }
        } 
    }
    
}

export default QueueSubscribeRepository;