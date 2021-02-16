import { gql } from '@apollo/client';

export const CREATE_COMMUNITY = gql`
  mutation CreateCommunity($name: String!, $title: String!, $description: String) {
    createCommunity(name: $name, title: $title, description: $description) {
      ok
      community {
        admins {
          id
          userName
          email
          createdAt
        }
        createdAt
      }

      errors {
        path
        message
      }
    }
  }
`;

export const GET_COMMUNITY = gql`
  query Community($name: String!) {
    getCommunity(name: $name) {
      id
      name
      title
      description
      admins {
        id
        userName
        email
        createdAt
      }
      users {
        id
        userName
      }
      createdAt
    }
  }
`;

export const GET_ALL_COMMUNITY = gql`
  query {
    getCommunities {
      id
      name
      title
      description
      admins {
        id
        userName
        email
        createdAt
      }
      users {
        id
        userName
      }
      createdAt
    }
  }
`;

export const JOIN_COM = gql`
  mutation JoinCom($id: ID!) {
    joinCommunity(id: $id) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const LEAVE_COM = gql`
  mutation LeaveCom($id: ID!) {
    leaveCommunity(id: $id) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
