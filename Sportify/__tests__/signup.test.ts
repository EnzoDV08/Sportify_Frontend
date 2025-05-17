import { createUser } from '../src/services/api';

describe('User Sign Up', () => {
  it('should create a user successfully', async () => {
    const mockUser = {
      name: 'Test User',
      email: `test${Date.now()}@mail.com`,
      password: 'password123'
    };

    const result = await createUser(mockUser);
    expect(result).toHaveProperty('id'); 
  });
});