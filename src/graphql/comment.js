import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query {
    getComments {
      id
      body
      post {
        id
        title
        body
      }
      author {
        id
        email
        userName
        createdAt
      }
      createdAt
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($body: String!, $replyUser: ID, $postID: ID!) {
    createComment(body: $body, replyUser: $replyUser, postID: $postID) {
      ok
      comment {
        id
        body
        post {
          id
          title
          body
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

export const REMOVE_COMMENT = gql`
  mutation RemoveComment($id: ID!) {
    removeComment(id: $id) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
