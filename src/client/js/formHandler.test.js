import { isValidURL } from './formHandler';

describe('isValidURL', () => {
    test('should return true for valid http URLs', () => {
        const validHttpURL = 'http://example.com';
        const result = isValidURL(validHttpURL);
        expect(result).toBe(true);
    });

    test('should return true for valid https URLs', () => {
        const validHttpsURL = 'https://example.com';
        const result = isValidURL(validHttpsURL);
        expect(result).toBe(true);
    });

    test('should return false for URLs without http or https', () => {
        const invalidURL = 'ftp://example.com';
        const result = isValidURL(invalidURL);
        expect(result).toBe(false);
    });

    test('should return false for malformed URLs', () => {
        const malformedURL = 'htp://example.com';
        const result = isValidURL(malformedURL);
        expect(result).toBe(false);
    });

    test('should return false for an empty URL', () => {
        const emptyURL = '';
        const result = isValidURL(emptyURL);
        expect(result).toBe(false);
    });
});
