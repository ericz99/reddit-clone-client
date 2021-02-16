import { gql } from '@apollo/client';

export const GET_POST = gql`
  query Post($id: ID!) {
    getPost(id: $id) {
      id
      title
      body
      comments {
        id
      }
      community {
        id
        name
        title
        description
        createdAt
      }
      author {
        id
        email
        userName
        createdAt
      }
      votes {
        id
        user {
          id
          userName
          email
        }
      }
      downvotes {
        id
        user {
          id
          userName
          email
        }
      }
      createdAt
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($name: String, $offset: Int, $limit: Int) {
    getPosts(name: $name, offset: $offset, limit: $limit) {
      docs {
        id
        title
        body
        comments {
          id
        }
        community {
          id
          name
          title
          description
          createdAt
        }
        author {
          id
          email
          userName
          createdAt
        }
        votes {
          id
          user {
            id
            userName
            email
          }
        }
        downvotes {
          id
          user {
            id
            userName
            email
          }
        }
        createdAt
      }
      totalPages
      page
      hasPrevPage
      hasNextPage
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String, $comName: String!) {
    createPost(title: $title, body: $body, comName: $comName) {
      ok
      post {
        id
        title
        body
        community {
          id
          name
          title
          description
          createdAt
        }
        author {
          id
          email
          userName
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

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $body: String!) {
    updatePost(id: $id, body: $body) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const REMOVE_POST = gql`
  mutation RemovePost($id: ID!) {
    removePost(id: $id) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const FILTER_POST = gql`
  query FilterPost($searchVal: String!) {
    filterPost(searchVal: $searchVal) {
      ok
      posts {
        id
        title
        body
        community {
          id
          name
          title
          description
          createdAt
        }
        author {
          id
          email
          userName
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
