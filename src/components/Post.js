import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faComment,
  faShare,
  faBookmark,
  faEllipsisH,
  faTrashAlt,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';

import { REMOVE_POST } from '../graphql/post';
import { UPVOTE_POST, DOWNVOTE_POST } from '../graphql/vote';
import useOnClickOutside from '../hooks/useOnClickOutside';
import Icon from '../assets/avatar.png';

export default function Post({ post, refetch, meData, isAuth, ...props }) {
  const $dropDownRef = useRef();
  const [isToggle, setToggle] = useState(false);
  const [isUpVoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);

  const [upvotePost] = useMutation(UPVOTE_POST);
  const [downVotePost] = useMutation(DOWNVOTE_POST);
  const [removePost] = useMutation(REMOVE_POST);

  useOnClickOutside($dropDownRef, () => setToggle(false));

  useEffect(() => {
    if (isAuth) {
      const userVoted = post.votes.filter((x) => x.user.id === meData.me.id);
      if (userVoted.length > 0) {
        setIsUpVoted(true);
      }
    }
  }, [post, meData, isAuth]);

  const upvotePostHandler = async (e, post) => {
    if (isAuth) {
      const userVoted = post.votes.filter((x) => x.user.id === meData.me.id);
      if (userVoted.length === 0) {
        await upvotePost({ variables: { postID: post.id } });
        setIsUpVoted(true);
        setIsDownVoted(false);
        refetch();
      }
    } else {
      props.history.push('/login');
    }
  };

  const downVotePostHandler = async (e, post) => {
    if (isAuth) {
      const userDownVoted = post.votes.filter((x) => x.user.id === meData.me.id);
      if (userDownVoted.length > 0) {
        await downVotePost({ variables: { postID: post.id } });
        setIsUpVoted(false);
        setIsDownVoted(true);
        refetch();
      }
    } else {
      props.history.push('/login');
    }
  };

  const deletePostHandler = async (e) => {
    await removePost({ variables: { id: post.id } });
    refetch();
  };

  return (
    <div className="flex mb-2">
      <div className="bg-gray-200 px-2 py-2 flex flex-col items-center justify-center">
        <button
          type="button"
          className="upvote text-lg text-grey-500"
          onClick={(e) => upvotePostHandler(e, post)}
        >
          <FontAwesomeIcon
            icon={faCaretUp}
            className={`${isUpVoted ? 'text-red-500' : 'text-gray-500'}`}
          />
        </button>

        <span className="vote-count text-sm font-bold text-gray-500">{post.votes.length}</span>

        <button
          type="button"
          className="downvote text-lg"
          onClick={(e) => downVotePostHandler(e, post)}
        >
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`${isDownVoted ? 'text-red-500' : 'text-gray-500'}`}
          />
        </button>
      </div>
      <div className="flex-1 bg-white">
        <div className="p-2">
          <div className="flex items-center">
            <Link to={`/r/${post.community.name}`} className="flex items-center mr-2">
              <img
                src={Icon}
                alt="react-icon"
                className="h-4 rounded-full my-2 mr-2 object-cover object-center object-right"
              />
              <span className="text-xs font-bold text-black mr-2 hover:underline">
                /r/{post.community.name}
              </span>
              <span className="h-0.5 w-0.5 bg-gray-500 rounded-full" />
            </Link>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 font-semibold mr-1">Posted by</span>
              <Link to="/#" className="hover:underline text-xs text-gray-400 font-semibold">
                u/{post.author.userName}
              </Link>
            </div>
          </div>
          <div onClick={() => props.history.push(`/r/${post.community.name}/${post.id}`)}>
            <h1 className="title text-2xl font-bold">{post.title}</h1>
            <p className="text mt-2">{post.body}</p>
          </div>
        </div>
        <div className="flex mt-2 bg-gray-100 px-1 py-1">
          <Link
            to={`/r/${post.community.name}/${post.id}`}
            className="comment hover:bg-gray-200 px-2"
          >
            <FontAwesomeIcon icon={faComment} className="text-xs text-gray-400 mr-2" />
            <span className="text-xs font-bold text-gray-400">{post.comments.length} Comments</span>
          </Link>

          <div className="share hover:bg-gray-200 px-2">
            <FontAwesomeIcon icon={faShare} className="text-xs text-gray-400 mr-2" />
            <span className="text-xs font-bold text-gray-400">Share</span>
          </div>

          <div className="save hover:bg-gray-200 px-2">
            <FontAwesomeIcon icon={faBookmark} className="text-xs text-gray-400 mr-2" />
            <span className="text-xs font-bold text-gray-400">Save</span>
          </div>

          {post.author.id === meData.me.id && (
            <div className="relative" ref={$dropDownRef} onClick={() => setToggle((prev) => !prev)}>
              <div className="save hover:bg-gray-200 px-2">
                <FontAwesomeIcon icon={faEllipsisH} className="text-xs text-gray-400" />
              </div>

              {isToggle && (
                <div className="absolute w-52 bg-white shadow-md flex flex-col z-50">
                  <Link
                    to={{
                      pathname: `/r/${post.community.name}/${post.id}`,
                      state: {
                        shouldUpdate: true,
                        post: {
                          title: post.title,
                          body: post.body,
                        },
                      },
                    }}
                    className="flex-1 flex py-2 px-4 pointer hover:bg-gray-300 items-center"
                  >
                    <span className="pr-2">
                      <FontAwesomeIcon className="text-gray-400" icon={faPencilAlt} />
                    </span>
                    <span className="text-sm font-semibold text-gray-400">Edit Post</span>
                  </Link>

                  <hr />

                  <button
                    onClick={deletePostHandler}
                    className="flex-1 flex py-2 px-4 pointer hover:bg-gray-300 items-center"
                  >
                    <span className="pr-2">
                      <FontAwesomeIcon className="text-gray-400" icon={faTrashAlt} />
                    </span>
                    <span className="text-sm font-semibold text-gray-400">Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
