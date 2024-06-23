import Server  from "./server";
import {MysqlDataBase} from "./external/MysqlDataBase";
import AWSSQS from "./external/aws_sqs";

const aws_sqs = new AWSSQS();

function startReceivingMessages() {
    setInterval(async () => {
        aws_sqs.receive(process.env.AWS_SQS_PEDIDO_ENTREGA);
    }, 1000);
}

let  port = process.env.PORT || 3000;
const _db = new MysqlDataBase();
const _server = new Server(_db);

_server.app.listen(port, () => {
    console.log('Server exec: PORTA -> ' + port);
    startReceivingMessages();
});
