/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-spinner';

import {
  faCaretDown,
  faCaretUp,
  faComment,
  faShare,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';

import { GET_POST, UPDATE_POST } from '../graphql/post';
import { CREATE_COMMENT } from '../graphql/comment';
import PostContainer from '../containers/PostContainer';
import Icon from '../assets/avatar.png';
import TextArea from '../components/TextArea';
import useInput from '../hooks/useInput';

export default function Post(props) {
  const [isMount, setMount] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updatePost] = useMutation(UPDATE_POST);

  const { loading: postLoading, data: postData, refetch } = useQuery(GET_POST, {
    variables: {
      id: props.match.params.id,
    },
  });

  const { inputs, handleChange, clearInputs } = useInput();
  useEffect(() => {
    if (props.location.state) {
      setShouldUpdate(true);
      if (!isMount) {
        inputs.body = props.location.state.post.body;
        setMount(true);
      }
    }
  }, [props.location, inputs, isMount]);

  if (postLoading)
    return (
      <div className="absolute inset-center">
        <Loader type="Bars" color="#00BFFF" height={100} width={100} />
      </div>
    );

  const submitCommentHandler = async (e) => {
    if (props.isAuth) {
      e.preventDefault();
      await createComment({
        variables: { body: inputs.commentBody, postID: props.match.params.id },
      });
      clearInputs();
      refetch();
    }
  };

  const updatePostHandler = async (e) => {
    e.preventDefault();
    await updatePost({ variables: { id: props.match.params.id, body: inputs.body } });
    // props.history.push(`/r/${postData.getPost.community.name}`);
    props.history.goBack();
  };

  return (
    <PostContainer {...props}>
      <div className="flex flex-1 mb-2">
        <div className="bg-gray-200 px-2 py-2 flex flex-col items-center">
          <button type="button" className="upvote text-lg text-grey-500">
            <FontAwesomeIcon icon={faCaretUp} className="text-gray-500" />
          </button>

          <span className="vote-count text-sm font-bold text-gray-500">0</span>

          <button type="button" className="downvote text-lg">
            <FontAwesomeIcon icon={faCaretDown} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 bg-white">
          <div className="p-2">
            <div className="flex items-center">
              <Link to={`/r/${postData.getPost.community.name}`} className="flex items-center mr-2">
                <img
                  src={Icon}
                  alt="react-icon"
                  className="h-4 rounded-full my-2 mr-2 object-cover object-center object-right"
                />
                <span className="text-xs font-bold text-black mr-2 hover:underline">
                  /r/{postData.getPost.community.name}
                </span>
                <span className="h-0.5 w-0.5 bg-gray-500 rounded-full" />
              </Link>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 font-semibold mr-1">Posted by</span>
                <Link to="/#" className="hover:underline text-xs text-gray-400 font-semibold">
                  u/{postData.getPost.author.userName}
                </Link>
              </div>
              <span className="text-xs text-black ml-2">
                {/* {timeAgo.format(postData.getPost.createdAt)} */}A few moment ago
              </span>
            </div>
            <h1 className="title text-2xl font-bold">{postData.getPost.title}</h1>
            <div className="text mt-2">
              {!shouldUpdate ? (
                postData.getPost.body
              ) : (
                <form className="flex flex-col" onSubmit={updatePostHandler}>
                  <div className="block relative">
                    <TextArea
                      type="text"
                      name="body"
                      value={inputs.body || ''}
                      onChange={handleChange}
                      className="h-48 py-2 px-2 border-2 border-gray-300 font-light rounded w-full relative resize-y"
                    />
                  </div>
                  <div className="relative mt-2 text-right">
                    <button
                      type="submit"
                      className="py-1 px-4 border-2 border-transparent rounded-md bg-blue-400 text-white"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="flex mt-2 px-1 py-1">
            <div to="/#" className="comment hover:bg-gray-200 px-2">
              <FontAwesomeIcon icon={faComment} className="text-xs text-gray-400 mr-2" />
              <span className="text-xs font-bold text-gray-400">0 Comments</span>
            </div>

            <div className="share hover:bg-gray-200 px-2">
              <FontAwesomeIcon icon={faShare} className="text-xs text-gray-400 mr-2" />
              <span className="text-xs font-bold text-gray-400">Share</span>
            </div>

            <div className="save hover:bg-gray-200 px-2">
              <FontAwesomeIcon icon={faBookmark} className="text-xs text-gray-400 mr-2" />
              <span className="text-xs font-bold text-gray-400">Save</span>
            </div>
          </div>

          {props.isAuth ? (
            <form className="flex p-4 flex-col" onSubmit={submitCommentHandler}>
              <div className="text-light text-xs">
                Comment as <span className="text-red-700">{postData.getPost.author.userName}</span>
              </div>

              <div className="block relative">
                <TextArea
                  type="text"
                  name="commentBody"
                  placeholder="What are your thoughts?"
                  value={inputs.commentBody || ''}
                  onChange={handleChange}
                  className="h-48 py-2 px-2 border-2 border-gray-300 font-light rounded w-full relative resize-y"
                  required
                />
              </div>

              <div className="relative mt-2 text-right">
                <button
                  type="submit"
                  className="py-1 px-4 border-2 border-transparent rounded-md bg-blue-400 text-white"
                >
                  Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="flex border border-gray-400 p-2 m-3">
              <div className="flex-1 text-gray-400 font-light">
                Log in or sign up to leave a comment
              </div>
              <div className="flex-1 flex justify-end">
                <Link
                  to="/login"
                  className="mr-2 rounded-full border border-blue-700 text-blue-700 text-sm py-1 px-4"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-blue-700 text-white text-sm py-1 px-4"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          <hr />

          <div className="flex flex-col p-4">
            {postData.getPost.comments.length > 0 ? (
              postData.getPost.comments.map((comment, key) => {
                if (comment.post.id === props.match.params.id) {
                  return (
                    <div className="flex flex-1 border-b-2" key={key}>
                      <div className="px-2 flex flex-col items-center">
                        <button type="button" className="upvote text-lg text-grey-500">
                          <FontAwesomeIcon icon={faCaretUp} className="text-gray-500" />
                        </button>

                        <span className="vote-count text-sm font-bold text-gray-500">0</span>

                        <button type="button" className="downvote text-lg">
                          <FontAwesomeIcon icon={faCaretDown} className="text-gray-500" />
                        </button>
                      </div>
                      <div className="flex-1 bg-white">
                        <div className="p-2">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <span className="text-xs text-gray-400 font-semibold mr-1">
                                Commented by
                              </span>
                              <Link
                                to="/#"
                                className="hover:underline text-xs text-gray-400 font-semibold"
                              >
                                u/{comment.author.userName}
                              </Link>
                            </div>
                          </div>
                          <p className="text mt-2">{comment.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="text-center">No Comments</div>
            )}
          </div>
        </div>
      </div>
    </PostContainer>
  );
}
