import { gql } from '@apollo/client';

export const UPVOTE_POST = gql`
  mutation UpvotePost($postID: ID!) {
    upvotePost(postID: $postID) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const DOWNVOTE_POST = gql`
  mutation DownVotePost($postID: ID!) {
    downVotePost(postID: $postID) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const UPVOTE_COMMENT = gql`
  mutation UpvoteComment($commentID: ID!) {
    upvoteComment(commentID: $commentID) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const DOWNVOTE_COMMENT = gql`
  mutation DownVoteComment($commentID: ID!) {
    downVoteComment(commentID: $commentID) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
