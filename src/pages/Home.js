import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';

import { ME_QUERY } from '../graphql/user';
import { GET_POSTS } from '../graphql/post';
import { GET_ALL_COMMUNITY } from '../graphql/community';

import Post from '../components/Post';
import Icon from '../assets/avatar.png';

export default function Home(props) {
  const limitRef = useRef(10);
  const { loading: meLoading, data: meData } = useQuery(ME_QUERY);
  const { loading: comLoading, data, refetch: comRefetch } = useQuery(GET_ALL_COMMUNITY);
  const { loading: postLoading, data: postData, refetch: postRefetch } = useQuery(GET_POSTS, {
    variables: {
      offset: 0,
      limit: limitRef.current,
    },
  });

  useEffect(() => {
    async function refresh() {
      await Promise.all([postRefetch(), comRefetch()]);
    }

    refresh();
  }, [postRefetch, comRefetch]);

  if (meLoading || postLoading || comLoading)
    return (
      <div className="absolute inset-center">
        <Loader type="Bars" color="#00BFFF" height={100} width={100} />
      </div>
    );

  const handleScroll = ({ currentTarget }) => {
    if (
      Math.round(currentTarget.scrollTop + currentTarget.clientHeight) >= currentTarget.scrollHeight
    ) {
      if (postData.getPosts.hasNextPage) {
        postRefetch({
          offset: 0,
          limit: (limitRef.current += 10),
        });
      }
    }
  };

  return (
    <>
      <div className="overflow-y-auto flex-1 h-screen bg-gray-300 relative" onScroll={handleScroll}>
        <div className="flex flex-col lg:p-6 lg:flex-row justify-center p-2 bg-gray-300">
          <div className="flex flex-col">
            <div className="lg:w-640 w-auto border-transparent hover:border-gray-400 mb-3">
              {postData.getPosts.docs.length > 0 ? (
                postData.getPosts.docs.map((post, key) => (
                  <Post key={key} post={post} {...props} meData={meData} refetch={postRefetch} />
                ))
              ) : (
                <div className="mb-2 text-center">No Post Found!</div>
              )}
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
