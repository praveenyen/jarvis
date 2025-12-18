// const checkIss = function(jwt:JWT) {
//     const correctIss =
//       'https://cognito-idp.' +
//       process.env.NEXT_PUBLIC_COGNITO_REGION +
//       '.amazonaws.com/' +
//       process.env.NEXT_PUBLIC_USER_POOL_ID
//     return jwt.payload.iss !== correctIss
//   }

import { JWT } from 'aws-amplify/auth';

// true when aud does not match
const checkAud = function (jwt: JWT) {
  return jwt.payload.aud !== process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
};

// true when token expired
const checkExp = function (jwt: JWT) {
  if (jwt.payload.exp) return Date.now() >= jwt.payload.exp * 1000;
};

export const validateToken = (decodedJwt: JWT) => {
  if (!decodedJwt || checkAud(decodedJwt) || checkExp(decodedJwt)) {
    return null;
  }
  const { sub, name, email, exp } = decodedJwt.payload;
  const result = {
    sub,
    name,
    email,
    exp,
    username: decodedJwt.payload.name,
  };
  return result;
};
