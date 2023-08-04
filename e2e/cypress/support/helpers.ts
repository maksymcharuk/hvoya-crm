import jwt_encode from 'jwt-encode';

interface SignTokenData {
  userId?: string;
  userRole?: string;
  userEmail?: string;
  expiresIn?: string;
}

const defaultSignTokenData: SignTokenData = {
  userRole: 'User',
  expiresIn: '1h',
};

export const signToken = (data: SignTokenData) => {
  return jwt_encode(
    {
      user: {
        id: data.userId || defaultSignTokenData.userId,
        role: data.userRole || defaultSignTokenData.userRole,
      },
    },
    Cypress.env('JWT_SECRET'),
    { expiresIn: data.expiresIn || defaultSignTokenData.expiresIn },
  );
};

export const signCustomToken = (data: Record<string, any>) => {
  return jwt_encode(
    {
      ...data,
    },
    Cypress.env('JWT_SECRET'),
    { expiresIn: '1h' },
  );
};
