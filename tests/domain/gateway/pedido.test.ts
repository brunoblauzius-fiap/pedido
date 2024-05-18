import PedidoRepository from './../../../gateways/PedidoRepository';
import ClienteRepository from './../../../gateways/ClienteRepository';
import Pedido from './../../../entity/pedido';
import Produto from './../../../entity/produto';
import  mockDataBase from '../../../mockDatabase/MockDataBase';
import Cliente from '../../../entity/cliente';
import Categoria from '../../../entity/categoria';
import { statusPedido } from '../../../entity/enum/statusPedido';


describe('PedidoRepository', () => {
  let pedidoRepository: PedidoRepository;

  beforeEach(() => {
    pedidoRepository = new PedidoRepository(mockDataBase);
  });

  describe('getAll', () => {
    test('should return all orders when no status is provided', async () => {
      // Mocking database response
      const mockOrders = [{ id: 1, status: 'PENDING' }, { id: 2, status: 'COMPLETED' }];
      mockDataBase.find.mockResolvedValue(mockOrders);

      const orders = await pedidoRepository.getAll({});
      expect(orders).toEqual(mockOrders);
    });

    test('should return orders filtered by status', async () => {
      // Mocking database response
      const mockOrders = [{ id: 1, status: 'PENDING' }];
      mockDataBase.find.mockResolvedValue(mockOrders);

      const orders = await pedidoRepository.getAll({ status: 1 });
      expect(orders).toEqual(mockOrders);
    });
  });

  describe('store', () => {
    test('should store a new order', async () => {
      // Mocking database response
      const mockInsertId = 1;
      mockDataBase.store.mockResolvedValue({ insertId: mockInsertId });
      const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
      // Creating a mock order
      const mockPedido = new Pedido(cliente, 0);

      const newOrder = await pedidoRepository.store(mockPedido);
      expect(newOrder.id).toEqual(mockInsertId);
    });
  });

  // Teste para o método adicionarProdutoAoPedido
  describe('adicionarProdutoAoPedido', () => {
    test('should add a product to the order', async () => {
      // Mocking database response
      const mockInsertId = 1;
      mockDataBase.store.mockResolvedValue({ insertId: mockInsertId });

      const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
      // Creating a mock order
      const mockPedido = new Pedido(cliente, 0,1,100);
      // Criar uma categoria para o produto
      const categoria = new Categoria("Eletrônicos");
      let produto = new Produto("Smartphone", 1500, categoria, "Um smartphone avançado",1);
      const mockProdutoId = 1;

      // Calling the method
      const result = await pedidoRepository.adicionarProdutoAoPedido(mockPedido, produto.id);

      // Verifying if the method was called with the correct parameters
    //   expect(mockDataBase.store).toHaveBeenCalledWith(
    //     'pedido_produtos',
    //     [{ campo: 'order_id', valor: mockPedido.id }, { campo: 'product_id', valor: produto.id }, 
    //      { campo: 'created', valor: expect.any(Date) }, { campo: 'modified', valor: expect.any(Date) }]
    //   );

      // Verifying the return value
      expect(result).toEqual(mockInsertId);
    });
  });

  // Teste para o método update
  describe('update', () => {
    test('should update the order', async () => {
      // Mocking order and ID
      const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
      // Creating a mock order
      let mockPedido= new Pedido(cliente,statusPedido.EM_PREPARACAO,1,10.00);
      mockPedido.cliente.id=1;
      // Calling the method
      const result = await pedidoRepository.update(mockPedido, mockPedido.id);

      // Verifying if the method was called with the correct parameters
      expect(mockDataBase.update).toHaveBeenCalledWith(
        'pedidos',
        [{ campo: 'customer_id', valor: mockPedido.cliente.id }, { campo: 'status', valor: mockPedido.getStatus() }, 
         { campo: 'total_value', valor: mockPedido.getValorTotal() }, { campo: 'modified', valor: expect.any(Date) }],
        [{ campo: 'id', valor: mockPedido.id }]
      );

      // Verifying the return value
      expect(result.id).toEqual(mockPedido.id);
      expect(result.cliente.id).toEqual(mockPedido.cliente.id);
      expect(result.getStatus()).toEqual(mockPedido.getStatus());
      expect(result.getValorTotal()).toEqual(mockPedido.getValorTotal());
    });
  });

  // Teste para o método delete
  describe('delete', () => {
    test('should delete the order', async () => {
      // Mocking order ID
      const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
      let mockOrderId= new Pedido(cliente,statusPedido.EM_PREPARACAO,1,10.00);
      // Calling the method
      await pedidoRepository.delete(mockOrderId.id);

      // Verifying if the method was called with the correct parameters
      expect(mockDataBase.delete).toHaveBeenCalledWith(
        'pedidos',
        [{ campo: 'id', valor: mockOrderId.id }]
      );
    });
  });

  // Teste para o método findById
  describe('findById', () => {
    // test('should find the order by ID', async () => {
    //     // Mocking order ID
    //     const cliente= {name:'Nome', email:'email@example.com', cpf_cnpj:'31759487740', id:1};
    //     //const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
    //     const mockPedidoData= {cliente:cliente[3],status: statusPedido.EM_PREPARACAO,id: 1,valorTotal: 100};
    //     // const mockPedidoData = new Pedido(cliente, statusPedido.EM_PREPARACAO, 1, 100);
        
    //     // Mocking product data
    //     const categoria = {name:"Eletrônicos", id:1};
    //     //const produto = new Produto("Smartphone", 1500, categoria, "Um smartphone avançado", 1);
    //     const produto = {title:"Smartphone",value: 1500,categoria: categoria, id: 1};

    //     // mockDataBase.store.mockResolvedValue({ insertId: mockInsertId });
    //     mockDataBase.find.mockResolvedValue(mockPedidoData);
    //     mockDataBase.getProdutosDoPedido.mockResolvedValue([produto]);


    //     // melhorar abaixo TODO
    //     const cliente2 = new Cliente('Nome', 'email@example.com', '31759487740');
    //     let pedido= new Pedido(cliente2,mockPedidoData.id);
    //     // Calling the method
    //     const result = await pedidoRepository.findById(pedido.id);



    //     // Verifying if the method was called with the correct parameters
    //     expect(mockDataBase.find).toHaveBeenCalledWith(
    //         'pedidos',
    //         null,
    //         [{ campo: 'id', valor: 1 }]
    //     );

    //     // Verifying if the method was called with the correct parameters
    //     expect(mockDataBase.getProdutosDoPedido).toHaveBeenCalledWith(1);

    //     // Verifying the return value
    //     expect(result).toBeInstanceOf(Pedido);
    //     expect(result.id).toEqual(1);
    //     expect(result.cliente).toBeInstanceOf(Cliente);
    //     expect(result.getStatus()).toEqual(statusPedido.EM_PREPARACAO);
    //     expect(result.getValorTotal()).toEqual(100);
    //     expect(result.getProdutos()).toHaveLength(1);
    //     expect(result.getProdutos()[0]).toBeInstanceOf(Produto);
    // });


    test('should return null if order not found', async () => {
      // Mocking database response
      mockDataBase.find.mockResolvedValue([]);
      const cliente = new Cliente('Nome', 'email@example.com', '31759487740');
      let mockPedidoData= new Pedido(cliente,statusPedido.EM_PREPARACAO,1,100);
      // Calling the method
      const result = await pedidoRepository.findById(mockPedidoData.id);

      // Verifying the return value
      expect(result).toBeNull();
    });
  });
});

