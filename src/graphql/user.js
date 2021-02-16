import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($userName: String!, $email: String!, $password: String!) {
    registerAccount(userName: $userName, email: $email, password: $password) {
      ok
      user {
        id
        email
        userName
        createdAt
      }
      errors {
        path
        message
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    loginAccount(email: $email, password: $password) {
      ok
      accessToken
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export const ME_QUERY = gql`
  query {
    me {
      id
      userName
      email
      createdAt
    }
  }
`;
