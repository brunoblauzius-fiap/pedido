service Pedido


## DATA BASE EXECUTABLE

Deve ser executado esse script no banco de dados, antes de iniciar a criação do pedido na API

```bash

  -- Desabilitar a verificação de chaves estrangeiras temporariamente
SET FOREIGN_KEY_CHECKS = 0;

  -- insert data values categoria
    TRUNCATE TABLE categoria;
    INSERT INTO categoria (id, name, created, modified)
            VALUES
            (1, 'Lanche',NOW(), NOW()),
            (2, 'Acompanhamento',NOW(), NOW()),
            (3, 'Bebidas',NOW(), NOW());


    -- insert de produtos
    TRUNCATE TABLE produto;
    insert into `projeto-pedidos`.produto (id, category_id, title, description, value, created, modified)
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
    insert into `projeto-pedidos`.cliente(id, name, email, cpf_cnpj, created, modified)
    values (1, 'Heitor Bernardo Victor Nogueira', 'heitoBVN@gmail.com', '31759487740', now(), now());

    -- inserindo pedido
    insert into `projeto-pedidos`.pedidos(id, customer_id, status, total_value, created, modified)
    values (1, 1, 1, '42.00', now(), now());

    -- insert itens do pedido
    insert into `projeto-pedidos`.pedido_produtos(id, order_id, product_id, created, modified)
    values
    (1, 1, 3, now(), now()),
    (2, 1, 2, now(), now()),
    (3, 1, 5, now(), now()),
    (4, 1, 5, now(), now())
    ;

    -- insert checkout test - pagamento por pix
    INSERT INTO checkout
	(uuid, status, payment_method_id, pedido_id, card_number, card_cvv, card_expiration_date, payer_name, payer_email, payer_document, total_value, created, modified)
	 VALUES
	(UUID(), 0, 1, 1, '5482874095004465', 181, '05/2024', 'Heitor Bernardo Victor Nogueira', 'heitoBVN@gmail.com', '31759487740', 42.00, NOW(),  NOW());

-- Habilitar a verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;

```