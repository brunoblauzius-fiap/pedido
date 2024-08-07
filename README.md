### ***5º Módulo***
Repositórios:
- [Entrega](https://github.com/brunoblauzius-fiap/entrega)
- [Pagamento](https://github.com/brunoblauzius-fiap/pagamento)
- [kubernetes-manifest](https://github.com/brunoblauzius-fiap/kubernetes-manifest)
- [tech-infra-db](https://github.com/brunoblauzius-fiap/tech-infra-db)
- [tech-infra](https://github.com/brunoblauzius-fiap/tech-infra)

## Arquitetura
![image](diagrama_componentes_aws.svg)

## Justificativa do Padrão SAGA.
Por se tratar de um exemplo tecnicamente simples optamos por uitlizar o padrão "COREOGRAFADO" ja que o problema não exigia um contexto sequencial para orquestração, logo decidimos pelo padrão definido. 

Na imagem acima retratamos como ficou a coreografia entre os módulos e como ficou os push/subscribe de cada um.

## Mensageria
Usamos o SQS AWS como ferramenta para comunicação entre as aplicações, motivo foi pelo baixo custo e por se adequar ao que era proposto.

## Videos
Apresentação e Funcionamento da aplicação

https://www.loom.com/share/6e5bee3dd7694ba8a337e2eb842f44fd?sid=ffd92b85-68a3-49e1-9cbf-77cfe9e8c6fa

Visualizando dados no Kubernets

https://www.loom.com/share/b18ccc2f743742cca6d82b1decfeb727?sid=b07f7955-823c-4034-8302-ad8dd303a9df


## Relatório RPID LGPD:
- [RPID LGPD](https://github.com/brunoblauzius-fiap/pedido/blob/main/LGPD/RIPD-Cafeteria.pdf)

Rota para solicitação de exclusão de dados da plataforma:

>Adicionado um metodo POST  - /cliente/desabilitar.

[Rota adicionada](https://github.com/brunoblauzius-fiap/pedido/blob/e253ee75b1b2c773edbd59f6a2708d764e254d09/application/api/routes/clienteDesabilitarRoutes.ts)

## OWASP

Executado OWASP ZAP  antes da correção de código:
- [OWASP Report Antes PDF](https://github.com/brunoblauzius-fiap/pedido/blob/OWASP/OWASP/ZAP%20Reporter%20Antes.pdf)

Executado OWASP ZAP  depois da correção de código: 
- [OWASP Report Depois PDF](https://github.com/brunoblauzius-fiap/pedido/blob/OWASP/OWASP/ZAP%20Reporter%20depois.pdf)
  
Report gerado pelo Zap Scanner:
- [OWASP Report Download](https://github.com/brunoblauzius-fiap/pedido/tree/OWASP/OWASP)


___________________


### ***4º Módulo***

Geral: 
https://www.loom.com/share/aba3643074444bf7b4b0147726e2eb0c?sid=a9b550d7-6806-44ae-9117-92a4fae718f2

Pedido:
https://www.loom.com/share/58d4be71ba704b299d8a3293e614dcdb?sid=98b7b6af-544c-420b-be4e-55166dc5fdf6

Entrega:
https://www.loom.com/share/ebbd39f475a04aabbde6d6b66254ea55?sid=1ba0c1a5-cb58-4663-91a5-8f0f5aa13bdd

Pagamentos:
https://www.loom.com/share/d979b1af2bd84a439b6bb17cc71848a3?sid=34982d52-c60e-49bf-bd7b-cf020bd38204

Melhorias Deploy:
https://www.loom.com/share/9d819d2af48840908072554212822180?sid=5f3b52a2-faeb-4819-a6a6-7e7d3cbf39f5




## Repositórios

https://github.com/brunoblauzius-fiap/pedido

https://github.com/brunoblauzius-fiap/pagamento

https://github.com/brunoblauzius-fiap/entrega

## Comunicação entre os microserviços
Usamos comunicação Direta, entre serviços implementado na pasta external/services/PedidoService, acessando diretamente outro serviço, sem acessar diretamente o Banco de dados.

## Coverage
### Pedido
![image](https://github.com/brunoblauzius-fiap/pedido/assets/8801500/1a8dfdbf-48fe-4336-b184-e94f9d74a766)

### Pagamento
![image](https://github.com/brunoblauzius-fiap/pedido/assets/8801500/c5746b71-ff90-4d7d-8a7d-a7d88d792af0)

### Entrega
![image](https://github.com/brunoblauzius-fiap/pedido/assets/8801500/74c70a72-7b6e-43f0-8fa7-5b9e4287df97)



## AWS :: Componentes
![AWS :: Componentes](arquitetura_aws.svg)

## DATA ENGENERING :: Componentes
![DATA ENGENERING :: Componentes](data_engenering_componentes.png)


## Architecture

- `Architecture` : Hexagonal

  A aquitetura do segue o modelo de diretórios listado a baixo utilizado o NODE js como linguagem de programação.

```bash
    |__ app/
        |__ application/
            |__ api/
                |_ middler
                |_ routes
            |__ core/
            |__ exception/
        |__ cases
        |__ controllers/
        |__ entity/
            |__ enum
        |__ external
        |__ gateways
        |__ interfaces
        |__ types
    |__ terraform
    |__ testes
```

## ENV Variables

```bash
    MARIADB_HOST=localhost
    MARIADB_USER=root
    MARIADB_PASS=12345678
    MARIADB_DATABASE=projeto-pedidos
    MARIADB_PORT=3321
```
## Modelagem de dados

![image](https://github.com/brunoblauzius-fiap/pedido/assets/8801500/60db7dfd-7abe-4696-aaf5-abc26b7f1d0a)

## Data Base

Banco de dados do projeto é feito com MariaDB, dentro do arquivo de conexão com o banco de dados exite um processo no qual já é criado toda a base de dados assim que for executado o build do projeto.
Cada nova tabela desenvolvida DEVE ser adicionado o create no arquivo para que seja atualizado em todas as imagens.

```bash
  path: external/mariaDBConnect.js
  example:
  await db.query(`
        CREATE TABLE IF NOT EXISTS  cliente (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(200) not null,
            email VARCHAR(245) not null unique,
            cpf_cnpj VARCHAR(20) not null unique,
            birthday date not null,
            created datetime null,
            modified datetime null
        )  ENGINE=INNODB;

        ...
  `);
```

## DATA BASE EXECUTABLE

Deve ser executado esse script no banco de dados, antes de iniciar a criação do pedido na API

```bash
    -- insert data values categoria
    TRUNCATE TABLE categoria;
    INSERT INTO categoria (id, name, created, modified)
            VALUES
            (1, 'Lanche',NOW(), NOW()),
            (2, 'Acompanhamento',NOW(), NOW()),
            (3, 'Bebidas',NOW(), NOW()),
            (4, 'Porções',NOW(), NOW());


    -- insert de produtos
    TRUNCATE TABLE produto;
    insert into produto (id, category_id, title, description, value, created, modified)
    values
    (1, 1, 'X-Salada', 'X-salada tradicional', 15.00, now(), now()),
    (2, 1, 'X-Salada com Bacon', 'X-salada tradicional com Bacon', 20.00, now(), now()),
    (3, 1, 'Prensado com duaa vinas', 'Prensado tradicional com duas vinas', 12.00, now(), now()),
    (4, 3, 'Fanta laranja 250ml', 'Fanata laranja lata 250ml', 5.00, now(), now()),
    (5, 3, 'Coca-Cola 250ml', 'cocacola lata 250ml', 5.00, now(), now()),
    (6, 3, 'Guaraná 250ml', 'Guaraná antartica lata 250ml', 5.00, now(), now()),
    (7, 3, 'Cerveja Bhrama 250ml', 'cerveja bramah lata 250ml', 6.00, now(), now()),
    (8, 4, 'Porção de Salada', '300gm de salada', 8.00, now(), now());


    -- criando cliente
    insert into cliente(id, name, email, cpf_cnpj, created, modified)
    values (1, 'Heitor Bernardo Victor Nogueira', 'heitoBVN@gmail.com', '31759487740', now(), now());

    -- inserindo pedido
    insert into pedidos(id, customer_id, status, total_value, created, modified)
    values (1, 1, 1, '42.00', now(), now());

    -- insert itens do pedido
    insert into pedido_produtos(id, order_id, product_id, created, modified)
    values
    (1, 1, 3, now(), now()),
    (2, 1, 2, now(), now()),
    (3, 1, 5, now(), now()),
    (4, 1, 5, now(), now())
    ;

```

## Install Application

1. Docker DEVE estar instalado na sua maquina.

2. Baixar o Projeto na sua maquina

```bash
git clone https://github.com/brunoblauzius-fiap/pedido.git
```

3. Build Project
   `Para Criar o projeto digite o codigo abaixo no console`

```bash
docker-compose up -d --build
```
4. Abra o container localstack  e va para aba EXEC
   `Digite os comandos abaixo antes de testar a api`

```bash
##CRIANDO UM USUARIO
awslocal iam create-user --user-name test
awslocal iam create-access-key --user-name test


##CRIANDO UMA FILA FIFO pedido finalizado
awslocal sqs create-queue --queue-name pedidos-finalizado.fifo --attributes FifoQueue=true
awslocal sqs create-queue --queue-name pedidos-dlq 

awslocal sqs receive-message --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedidos-finalizado.fifo

## LINKANDO as Filas
awslocal sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedidos-finalizado.fifo \
--attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:pedidos-dlq\",\"maxReceiveCount\":\"2\"}"
}'
##CRIANDO UMA FILA FIFO pedido entregar
awslocal sqs create-queue --queue-name pedido-entrega.fifo --attributes FifoQueue=true

awslocal sqs receive-message --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedido-entrega.fifo

## LINKANDO as Filas
awslocal sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedido-entrega.fifo \
--attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:pedidos-dlq\",\"maxReceiveCount\":\"2\"}"
}'

##CRIANDO UMA FILA FIFO pedido entregar
awslocal sqs create-queue --queue-name pedido-entrega.fifo --attributes FifoQueue=true

awslocal sqs receive-message --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedido-entrega.fifo

## LINKANDO as Filas
awslocal sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedido-entrega.fifo \
--attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:pedidos-dlq\",\"maxReceiveCount\":\"2\"}"
}'

##CRIANDO UMA FILA FIFO confirmação de pagamentos
awslocal sqs create-queue --queue-name confirmacao-pagamento.fifo --attributes FifoQueue=true

## LINKANDO as Filas
awslocal sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/confirmacao-pagamento.fifo \
--attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:pedidos-dlq\",\"maxReceiveCount\":\"2\"}"
}'

##CRIANDO UMA FILA FIFO pedidos pagamentos
awslocal sqs create-queue --queue-name pedidos-pagamentos.fifo --attributes FifoQueue=true

awslocal sqs receive-message --queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedidos-pagamentos.fifo

## LINKANDO as Filas
awslocal sqs set-queue-attributes \
--queue-url http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/pedidos-pagamentos.fifo \
--attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:pedidos-dlq\",\"maxReceiveCount\":\"2\"}"
}'

```

5. Import o arquivo swagger.json no Postman e teste as API


** Lembrando que deve subir os container do Microserviço Entrega e Pagamento também.
   

## Running tests

Aplicação realiza testes unitários com ...

```bash
    npm run test
```
