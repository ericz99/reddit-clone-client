import React from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import { JOIN_COM, LEAVE_COM } from '../graphql/community';

import InputField from '../components/InputField';
import Icon from '../assets/avatar.png';

export default function ComContainer({ comData, refetch, ...props }) {
  const [joinCommunity] = useMutation(JOIN_COM);
  const [leaveCommunity] = useMutation(LEAVE_COM);

  const handleJoinCom = async (e) => {
    if (props.loggedInUser) {
      // # join & refetch the data
      await Promise.all([joinCommunity({ variables: { id: comData.getCommunity.id } }), refetch()]);
    }
  };

  const handleLeaveCom = async (e) => {
    if (props.loggedInUser) {
      // # leave & refetch the data
      await Promise.all([
        leaveCommunity({ variables: { id: comData.getCommunity.id } }),
        refetch(),
      ]);
    }
  };

  return (
    <>
      <div className="h-1/6 w-full">
        <div className="h-1/2 bg-blue-500" />
        <div className="flex bg-white lg:w-2/4 m-auto w-full px-8">
          <div className="flex mb-4 -mt-10 w-full items-start">
            <img
              src={Icon}
              alt="react-icon"
              className="h-24 border-t-8 border-b-8 rounded-full inline border-white bg-white bg-cover m-2 px-2 object-cover object-center"
            />
            <div className="flex-1 ml-2 pt-8 self-center flex">
              <div className="block pr-4">
                <h1 className="text-4xl font-bold">{comData.getCommunity.name}</h1>
                <h2 className="text-xs font-semibold text-gray-500 mt-1">
                  r/{comData.getCommunity.name}
                </h2>
              </div>
              <div className="flex-1 mt-2">
                {props.loggedInUser &&
                comData.getCommunity.users.some((x) => x.id === props.loggedInUser.id) ? (
                  <button
                    type="button"
                    className="leave-btn text-lg text-grey-500 rounded-full bg-yellow-400 text-white block px-8 py-0.5 text-center hover:bg-yellow-500"
                    onClick={handleLeaveCom}
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    type="button"
                    className="join-btn text-lg text-grey-500 rounded-full bg-gray-400 text-white block px-8 py-0.5 text-center hover:bg-gray-500"
                    onClick={handleJoinCom}
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 h-1/2 bg-gray-300 relative" onScroll={props.onScroll}>
        <div className="flex flex-col lg:p-6 lg:flex-row justify-center p-2 bg-gray-300">
          <div className="flex flex-col">
            <div className="flex mb-4 bg-white items-center">
              <img
                src={Icon}
                alt="react-icon"
                className="h-12 rounded-full m-2 px-2 object-cover object-center object-right"
              />
              <div className="flex-1 mr-4">
                <InputField
                  type="text"
                  name="createPost"
                  placeholder="Create Post"
                  className="py-2 px-2 border-2 border-gray-300 rounded w-full"
                  onClick={() =>
                    props.history.push(
                      `${props.isAuth ? `/r/${props.match.params.name}/submit` : '/login'}`
                    )
                  }
                />
              </div>
            </div>

            <div className="lg:w-640 w-auto border-transparent hover:border-gray-400 cursor-pointer mb-3">
              {props.children}
            </div>
          </div>

          <div className="lg:block self-start lg:w-312 ml-7 hidden flex flex-col sticky top-4">
            <div className="about-community mb-2 bg-gray-100 rounded-md">
              <div className="header h-12 leading-loose bg-blue-500 flex px-4 items-center border-b-2 border-gray-400">
                <h1 className="font-semibold text-sm text-white">About Community</h1>
              </div>

              <div className="bg-gray-100 p-4">
                <p className="description text-sm">{comData.getCommunity.description}</p>
                {props.isAuth && (
                  <div className="createCommunityBtn mt-4 w-full">
                    <Link
                      to={`/r/${props.match.params.name}/submit`}
                      className="rounded-full bg-blue-400 text-white block px-4 py-2 text-center hover:bg-blue-500"
                    >
                      Create Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
