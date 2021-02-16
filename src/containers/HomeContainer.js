import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import { GET_ALL_COMMUNITY } from '../graphql/community';

import Icon from '../assets/avatar.png';

export default function HomeContainer(props) {
  const { loading, data, refetch } = useQuery(GET_ALL_COMMUNITY);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) return null;

  return (
    <>
      <div
        className="overflow-y-auto flex-1 h-screen bg-gray-300 relative"
        onScroll={props.onScroll}
      >
        <div className="flex flex-col lg:p-6 lg:flex-row justify-center p-2 bg-gray-300">
          <div className="flex flex-col">
            <div className="lg:w-640 w-auto border-transparent hover:border-gray-400 cursor-pointer mb-3">
              {props.children}
            </div>
          </div>

          <div className="lg:block self-start lg:w-312 ml-7 hidden flex flex-col sticky top-4">
            <div className="top-community mb-2">
              <div className="header h-16 leading-loose bg-white flex justify-center items-center border-b-2 border-gray-400">
                <h1 className="text-center font-semibold text-sm">Top Community</h1>
              </div>
            </div>

            <div className="recent-community mb-2">
              <div className="header h-16 leading-loose bg-white flex justify-center items-center border-b-2 border-gray-400">
                <h1 className="text-center font-semibold text-sm">Recent Created Community</h1>
              </div>
              <ul className="list-none flex flex-col">
                {data.getCommunities.slice(0, 5).map((com, key) => (
                  <li
                    key={key}
                    className="flex bg-gray-100 border-b-2 border-gray-400 items-center cursor-pointer hover:bg-gray-300"
                  >
                    <img
                      src={Icon}
                      alt="react-icon"
                      className="h-7 rounded-full m-2 px-2 object-cover object-center object-right"
                    />
                    <div className="ml-1">
                      <Link to={`/r/${com.name}`} className="font-bold text-sm hover:underline">
                        /r/{com.name}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {props.isAuth && (
              <div className="createCommunityBtn mt-2 w-full">
                <Link
                  to="/create-com"
                  className="rounded bg-pink-600 text-white block px-4 py-2 text-center hover:bg-pink-700"
                >
                  Create Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
