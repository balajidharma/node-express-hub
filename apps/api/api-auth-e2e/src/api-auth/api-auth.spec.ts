import axios from 'axios';
import { v4 as uuid } from 'uuid';

describe('Auth Flow', () => {
  it('should register a new user, receive a token, and access a protected route to get userId', async () => {
    const uniqueUser = {
      email: `test-${uuid()}@example.com`,
      username: `testuser-${uuid()}`,
      password: 'password123',
      name: 'Test User',
    };

    // 1. Register a new user
    const registerResponse = await axios.post('/auth/register', uniqueUser);

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.data).toHaveProperty('token');
    const { token } = registerResponse.data;

    // 2. Use the token to access a protected route
    const protectedResponse = await axios.get('/auth/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Verify the protected route response
    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.data.message).toBe('Protected route accessed');
    expect(protectedResponse.data.user).toHaveProperty('userId');
    expect(typeof protectedResponse.data.user.userId).toBe('string');
  });

  it('Should login a existing user and receive a token, and access a protected route to get userId', async () => {
    const user = {
      username: 'testuser',
      password: 'password',
    };

    // 1. Login a existing user
    const loginResponse = await axios.post('/auth/login', user);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data).toHaveProperty('token');
    const { token } = loginResponse.data;

    // 2. Use the token to access a protected route
    const protectedResponse = await axios.get('/auth/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Verify the protected route response
    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.data.message).toBe('Protected route accessed');
    expect(protectedResponse.data.user).toHaveProperty('userId');
    expect(typeof protectedResponse.data.user.userId).toBe('string');
  });
});
