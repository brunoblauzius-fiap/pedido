import Server  from "./server";
import {MysqlDataBase} from "./external/MysqlDataBase";
import AWSSQS from "./external/aws_sqs";
import QueueSubscribeRepository from "./gateways/QueueSubscribeRepository";

const queueRepository = new QueueSubscribeRepository(new AWSSQS());

function startReceivingMessages() {
    setInterval(async () => {
        await queueRepository.pedidoEntrega();
    }, 1000);
}

let  port = process.env.PORT || 3000;
const _server = new Server(new MysqlDataBase());

_server.app.listen(port, () => {
    console.log('Server exec: PORTA -> ' + port);
    startReceivingMessages();
});
