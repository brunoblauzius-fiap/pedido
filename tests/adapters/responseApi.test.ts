import ResponseAPI from '../../adapters/ResponseAPI';

describe('ResponseAPI', () => {
  describe('list', () => {
    it('should return object with totals and results', () => {
      const data = [1, 2, 3];
      const result = ResponseAPI.list(data);
      expect(result).toEqual({ totals: 3, results: [1, 2, 3] });
    });
  });

  describe('data', () => {
    it('should return the input item', () => {
      const item = { id: 1, name: 'John Doe' };
      const result = ResponseAPI.data(item);
      expect(result).toEqual(item);
    });
  });

  describe('success', () => {
    it('should return object with success message', () => {
      const message = 'Operation successful';
      const result = ResponseAPI.success(message);
      expect(result).toEqual({ message: [message] });
    });
  });

  describe('inputError', () => {
    it('should return object with input error message', () => {
        const input = 'username';
        const message = 'Invalid username';
        const result = ResponseAPI.inputError(input, message);
        expect(result).toEqual({ message: { input: [message] } });
      });
  });

  describe('error', () => {
    it('should return object with non_field_error message', () => {
      const message = 'Internal server error';
      const result = ResponseAPI.error(message);
      expect(result).toEqual({ message: { non_field_error: [message] } });
    });
  });
});
