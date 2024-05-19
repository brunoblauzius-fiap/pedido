import { defineFeature, loadFeature, DefineStepFunction } from 'jest-cucumber';
import mockAxios from 'jest-mock-axios';
import { PedidoCasoDeUso } from '../../../cases/pedidoCasodeUso';
import PedidoController from '../../../controllers/PedidoController';
import { mockRequest, mockResponse } from 'jest-mock-req-res';

const feature = loadFeature('./tests/BDD/features/pedido.feature');
jest.mock('../../../gateways/PedidoRepository');
jest.mock('../../../gateways/ClienteRepository');
jest.mock('../../../gateways/ProdutoRepository');
jest.mock('../../../cases/pedidoCasodeUso');
jest.mock('../../../adapters/ResponseAPI');
jest.mock('../../../adapters/ResponseErrors');

const mockDbConnection = {};  // Mock database connection
let orders: any[] = [];
let pedidoController: PedidoController;
let request: any;
let response: any;

defineFeature(feature, (scenario: DefineStepFunction) => {
 
  beforeAll(() => {
    pedidoController = new PedidoController(mockDbConnection as any);
    request = { params: {}, body: {}, query: {} };
    response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
  });

  scenario('Adicionar um novo pedido', ({ given, when, then }) => {
    given('que o cliente criou pedido', async () => {
      const mockOrderId = 1;
      (PedidoCasoDeUso.adicionarProdutoPedido as jest.Mock).mockResolvedValue(mockOrderId);

      response=await pedidoController.store(request, response);
    });

    when('cliente confirma Pagamento', async () => {  
      const responsePay = { status: 200, data: { payment_method_id: 1, pedido_id:1, "payer":{name:'Ariane',email:'a@a.com',document:'12345'}}};
      const paymentServiceResponse = { status: 200, data: {responsePay }};
     mockAxios.post.mockResolvedValue(paymentServiceResponse);
    });

    then('o sistema registra o pedido com sucesso', async () => {
      const req = mockRequest({query: { status: 2 },});
      const res = mockResponse({ status: 200})
      await pedidoController.all(req,res)
      expect(res.status).toBe(200);
    });
  });
});
