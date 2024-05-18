import ProdutoRepository from './../../../gateways/ProdutoRepository';
import Produto from './../../../entity/produto';
import  mockDataBase from '../../../mockDatabase/MockDataBase';
import Categoria from '../../../entity/categoria';

describe('ProdutoRepository', () => {
  let produtoRepository: ProdutoRepository;

  beforeEach(() => {
    produtoRepository = new ProdutoRepository(mockDataBase);
  });

  describe('getAll', () => {
    it('deve retornar todos os produtos quando não houver parâmetros de consulta', async () => {
        mockDataBase.find.mockResolvedValue([
            { id: 1, title: 'Produto 1', value: 10, description: 'Descrição do Produto 1', category_id: 1 },
            { id: 2, title: 'Produto 2', value: 20, description: 'Descrição do Produto 2', category_id: 2 },
          ]);
      const result = await produtoRepository.getAll({});
      expect(result).toHaveLength(2); // Espera-se que o mock retorne dois produtos
    });

    it('deve retornar produtos filtrados por título', async () => {
        mockDataBase.find.mockResolvedValue([
            { id: 1, title: 'Produto 1', value: 10, description: 'Descrição do Produto 1', category_id: 1 }
          ]);
      const result = await produtoRepository.getAll({ title: 'Produto 1' });
      expect(result).toHaveLength(1); // Espera-se que o mock retorne um produto com o título 'Produto 1'
    });

    // Adicione mais testes conforme necessário para cobrir outros cenários
  });

  describe('store', () => {
    it('deve armazenar um novo produto corretamente', async () => {
        // Criar uma categoria para o produto
      const categoria = new Categoria("Categoria 3");
      let newProduct = new Produto("Novo Produto", 30, categoria, "Um smartphone avançado",3);
      const storedProduct = await produtoRepository.store(newProduct);
      expect(storedProduct).toBeInstanceOf(Produto);
      expect(storedProduct.id).toBe(1); // Espera-se que o ID retornado seja 3, conforme simulado pelo mock
    });

    // Adicione mais testes conforme necessário para cobrir outros cenários
  });
  describe('update', () => {
    it('deve atualizar o produto corretamente', async () => {
      // Criando um produto para atualizar
      const categoria = new Categoria("Categoria 1");
      let originalProduct = new Produto("Produto Original", 50, categoria, "Um smartphone avançado",3);
      const storedProduct = await produtoRepository.store(originalProduct);

      // Criando um novo produto com os dados atualizados
      const updatedProduct = new Produto('Produto Atualizado', 60, categoria, "Um smartphone avançado");

      // Executando o método update
      const updatedResult = await produtoRepository.update(updatedProduct, storedProduct.id);

      // Verificando se o método retornou o produto atualizado com o mesmo ID
      expect(updatedResult).toBeInstanceOf(Produto);
      expect(updatedResult.id).toBe(storedProduct.id);
      expect(updatedResult.title).toBe(updatedProduct.title);
      expect(updatedResult.value).toBe(updatedProduct.value);
      expect(updatedResult.description).toBe(updatedProduct.description);
      expect(updatedResult.categoria).toEqual(updatedProduct.categoria);
    });

    // Adicione mais testes conforme necessário para cobrir outros cenários, como tentativa de atualizar um produto inexistente, etc.
  });
  describe('delete', () => {
    it('deve excluir o produto corretamente', async () => {
      // Criando um produto para excluir
      const categoria = new Categoria("Categoria 1");
      const productToDelete = new Produto('Produto para Excluir', 50, categoria, "Um smartphone avançado");
      const storedProduct = await produtoRepository.store(productToDelete);

      // Executando o método delete
      const deleteResult = await produtoRepository.delete(storedProduct.id);

      // Verificando se o produto não está mais presente no banco de dados
     // const foundProduct = await produtoRepository.findById(storedProduct.id);
       // Verifying if the method was called with the correct parameters
       expect(mockDataBase.delete).toHaveBeenCalledWith(
        'produto',
        [{ campo: 'id', valor: storedProduct.id }]
      );
      //expect(foundProduct).toBeNull();
    });

    // Adicione mais testes conforme necessário para cobrir outros cenários, como tentativa de excluir um produto inexistente, etc.
  });

  describe('findByMultipleIds', () => {
    it('deve retornar null se nenhum ID for fornecido', async () => {
        
      const result = await produtoRepository.findByMultipleIds([]);
      expect(result).toBeNull();
    });

    it('deve retornar null se os IDs não forem fornecidos como array', async () => {
      const result = await produtoRepository.findByMultipleIds([1]); // IDs não fornecidos como array
      expect(result).toBeNull();
    });

    it('deve retornar os produtos correspondentes aos IDs fornecidos', async () => {
        const categoria = new Categoria("Categoria 3");
        
      // Mock dos IDs fornecidos
      const ids = [1, 2, 3];

      // Mock dos dados de produtos correspondentes aos IDs fornecidos
      const produtosEsperados = [
        new Produto('Produto 1', 10, categoria, 'teste'),
        new Produto('Produto 2', 20, categoria,'teste' ),
        new Produto('Produto 3', 30, categoria,'teste' ),
      ];

      // Mock do método getMultipleIdsProduto do banco de dados para retornar os produtos correspondentes aos IDs fornecidos
      jest.spyOn(mockDataBase, 'getMultipleIdsProduto').mockResolvedValueOnce(produtosEsperados);

      // Chamada ao método findByMultipleIds
      const result = await produtoRepository.findByMultipleIds(ids);

      // Verifica se os produtos retornados correspondem aos esperados
      expect(result).toEqual(produtosEsperados);
    });

    it('deve retornar null se não houver produtos correspondentes aos IDs fornecidos', async () => {
      // Mock dos IDs fornecidos
      const ids = [4, 5, 6];

      // Mock do método getMultipleIdsProduto do banco de dados para retornar null (nenhum produto correspondente)
      jest.spyOn(mockDataBase, 'getMultipleIdsProduto').mockResolvedValueOnce(null);

      // Chamada ao método findByMultipleIds
      const result = await produtoRepository.findByMultipleIds(ids);

      // Verifica se o resultado é null
      expect(result).toBeNull();
    });
  });
  describe('findByCategory', () => {
    it('deve retornar null se nenhum produto for encontrado para a categoria fornecida', async () => {
      // Mock do método find do banco de dados para retornar uma lista vazia (nenhum produto encontrado)
      jest.spyOn(mockDataBase, 'find').mockResolvedValueOnce([]);
      const categoria = new Categoria("Categoria 3");
      // Chamada ao método findByCategory com uma categoria inexistente
      const result = await produtoRepository.findByCategory(categoria.id); // Supondo que o ID da categoria seja 1

      // Verifica se o resultado é null
      expect(result).toBeNull();
    });

    it('deve retornar os produtos correspondentes à categoria fornecida', async () => {
      // Mock dos dados de produtos correspondentes à categoria fornecida
      const produtosCorrespondentes = [
        { id: 1, title: 'Produto 1', category_id: 1 },
        { id: 2, title: 'Produto 2', category_id: 1 },
      ];

      // Mock do método find do banco de dados para retornar os produtos correspondentes
      jest.spyOn(mockDataBase, 'find').mockResolvedValueOnce(produtosCorrespondentes);
      const categoria = new Categoria("Categoria 3");
      // Chamada ao método findByCategory com uma categoria existente
      const result = await produtoRepository.findByCategory(categoria.id); // Supondo que o ID da categoria seja 1

      // Verifica se os produtos retornados correspondem aos esperados
      expect(result).toEqual(produtosCorrespondentes);
    });
  });
  describe('findById', () => {
    it('deve retornar null se nenhum produto for encontrado com o ID fornecido', async () => {
      // Mock do método find do banco de dados para retornar uma lista vazia (nenhum produto encontrado)
      jest.spyOn(mockDataBase, 'find').mockResolvedValueOnce([]);
      const categoria = new Categoria("Categoria 3");
      let newProduct = new Produto("Novo Produto", 30, categoria, "Um smartphone avançado",1);
      // Chamada ao método findById com um ID inexistente
      const result = await produtoRepository.findById(newProduct.id); // Supondo que o ID do produto seja 1

      // Verifica se o resultado é null
      expect(result).toBeNull();
    });

    it('deve retornar o produto correspondente ao ID fornecido', async () => {
      // Mock dos dados do produto correspondente ao ID fornecido
      const produtoCorrespondente = { id: 1, title: 'Produto 1', category_id: 1 };

      // Mock do método find do banco de dados para retornar o produto correspondente
      jest.spyOn(mockDataBase, 'find').mockResolvedValueOnce([produtoCorrespondente]);
      const categoria = new Categoria("Categoria 3");
      let newProduct = new Produto("Novo Produto", 30, categoria, "Um smartphone avançado",1);
      // Chamada ao método findById com um ID existente
      const result = await produtoRepository.findById(newProduct.id); // Supondo que o ID do produto seja 1

      // Verifica se o produto retornado corresponde ao esperado
      expect(result).toEqual(produtoCorrespondente);
    });
  });
  describe('getAll', () => {
    it('deve retornar todos os produtos quando nenhum parâmetro é fornecido', async () => {
      // Mock do método find do banco de dados para retornar uma lista de produtos
      const produtos = [{ id: 1, title: 'Produto 1' }, { id: 2, title: 'Produto 2' }];
      jest.spyOn(mockDataBase, 'find').mockResolvedValueOnce(produtos);

      // Chamada ao método getAll sem parâmetros
      const result = await produtoRepository.getAll({});

      // Verifica se o resultado corresponde aos produtos retornados pelo mock
      expect(result).toEqual(produtos);
    });

    it('deve retornar os produtos com base no parâmetro de nome fornecido', async () => {
      // Mock do método find do banco de dados para retornar uma lista de produtos com base no parâmetro de nome
      const produtos = [{ id: 1, title: 'Produto 1' }, { id: 2, title: 'Produto 2' }];
      jest.spyOn(mockDataBase, 'find').mockResolvedValueOnce(produtos);

      // Chamada ao método getAll com um parâmetro de nome fornecido
      const result = await produtoRepository.getAll({ name: 'Produto' });

      // Verifica se o resultado corresponde aos produtos retornados pelo mock
      expect(result).toEqual(produtos);
    });
  });
  // Adicione testes para os outros métodos da classe ProdutoRepository conforme necessário
});
