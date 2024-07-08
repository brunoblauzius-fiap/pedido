import Server  from "./server";
import {MysqlDataBase} from "./external/MysqlDataBase";
import AWSSQS from "./external/aws_sqs";
import QueueSubscribeRepository from "./gateways/QueueSubscribeRepository";
let port = process.env.PORT || 3000;
const db = new MysqlDataBase();
const _server = new Server(db);

const queueRepository = new QueueSubscribeRepository(
    new AWSSQS(),
    db
);

function startReceivingMessages() {
    setInterval(async () => {
        await queueRepository.pedidoCancelado();
        await queueRepository.pedidoFinalizado();
        await queueRepository.pedidoConfirmado();
    }, 1000);
}

_server.app.listen(port, () => {
    console.log('Server exec: PORTA -> ' + port);
    startReceivingMessages();
});
