import jwt_encode from 'jwt-encode';

export const signToken = (
  userId: string,
  userRole = 'User',
  expiresIn = '10m',
) => {
  return jwt_encode(
    {
      user: {
        id: userId,
        role: userRole,
      },
    },
    Cypress.env('JWT_SECRET'),
    { expiresIn: expiresIn },
  );
};
