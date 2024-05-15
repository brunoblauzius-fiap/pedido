import { IDataBase } from '../interfaces/IDataBase';
import { jest } from '@jest/globals';
// Defina um objeto com métodos mockados para a interface IDataBase
const mockDataBase: jest.Mocked<IDataBase> = {
  store: jest.fn().mockReturnValue({ insertId: 1 }) ,
  update: jest.fn().mockReturnValue(undefined),
  delete: jest.fn().mockReturnValue(undefined),
  find: jest.fn(),
  query: jest.fn().mockReturnValue(undefined),
  getProdutosDoPedido: jest.fn().mockReturnValue(undefined),
  getMultipleIdsProduto: jest.fn().mockReturnValue(undefined)
};

export default mockDataBase;

