Feature: Pedido

    Scenario: Adicionar um novo pedido
      Given que o cliente criou pedido
      When cliente confirma Pagamento
      Then o sistema registra o pedido com sucesso