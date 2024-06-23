import AWSSQS from "./external/aws_sqs";
const aws_sqs = new AWSSQS();
const response = aws_sqs.send(JSON.stringify({
    nome : 'Bruno Blauzius 22',
}), process.env.AWS_SQS_PEDIDO_ENTREGA);