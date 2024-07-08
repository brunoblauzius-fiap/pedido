import AWSSQS from "./external/aws_sqs";
const aws_sqs = new AWSSQS();
const response = aws_sqs.send(JSON.stringify({
    idPedido : 1,
}), process.env.AWS_SQS_CANCELAR_PEDIDO);