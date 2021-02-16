import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { ME_QUERY } from '../graphql/user';
import { FILTER_POST } from '../graphql/post';

import InputField from './InputField';
import Icon from '../assets/avatar.png';

import useOnClickOutside from '../hooks/useOnClickOutside';
import useDebounce from '../hooks/useDebounce';
import useInput from '../hooks/useInput';

export default function NavBar({ isAuth }) {
  const $menuRef = useRef();
  const $searchRef = useRef();
  const [inputTouch, setInputTouch] = useState(false);
  const [isToggle, setToggle] = useState(false);
  const { client, loading, data } = useQuery(ME_QUERY);
  const [filterPost, { loading: filterLoading, data: filterData }] = useLazyQuery(FILTER_POST);
  const { inputs, handleChange } = useInput();

  // # on click outside
  useOnClickOutside($searchRef, () => setInputTouch(false));
  // # on click outside
  useOnClickOutside($menuRef, () => setToggle(false));
  // # for debounce
  const debounceVal = useDebounce(inputs.searchVal, 1000);

  useEffect(() => {
    if (debounceVal) {
      filterPost({ variables: { ...inputs } });
    }
  }, [debounceVal, inputs, filterPost]);

  if (loading) return null;

  const handleSignOut = async () => {
    // # clear localstorage
    localStorage.clear();
    // # reset store
    await client.clearStore();
    // # redirect user back to home page
    window.location.href = '/';
  };

  return (
    <div className="px-2 py-1 bg-white flex items-center justify-between shadow-lg md:px-8 sticky top-0 z-30">
      <div className="header flex-none">
        <Link to="/" className="font-medium text-sm">
          Reddit
        </Link>
      </div>

      <div className="relative mx-2 w-1/2" ref={$searchRef}>
        <InputField
          type="text"
          name="searchVal"
          placeholder="Search For Post"
          value={inputs.searchVal || ''}
          onChange={handleChange}
          onClick={() => setInputTouch(true)}
          maxLength={200}
          className="py-2 px-2 border-2 border-gray-300 font-light rounded w-full relative"
        />

        {inputTouch && (
          <div className="absolute mt-1 rounded-b-md w-full bg-white shadow-lg flex flex-col z-50">
            {filterLoading ? (
              <div className="text-center p-4">Loading...</div>
            ) : !inputs.searchVal || inputs.searchVal.length === 0 ? (
              <p className="text-center p-4">Search Something 😂</p>
            ) : (
              filterData &&
              filterData.filterPost.posts.map((post, key) => (
                <Link
                  key={key}
                  to={`/r/${post.community.name}/${post.id}`}
                  className="flex flex-col hover:bg-blue-100"
                >
                  <div className="flex-1 px-4 py-2">
                    <div className="text-md text-blue-600">{post.title}</div>
                    <div className="text-sm text-gray-400">{post.body}</div>
                    <div className="flex items-center">
                      <img
                        src={Icon}
                        alt="react-icon"
                        className="h-4 rounded-full my-2 mr-2 object-cover object-center object-right"
                      />
                      <span className="text-xs font-light text-gray-600 mr-2 hover:underline">
                        /r/{post.community.name}
                      </span>
                    </div>
                  </div>

                  <span className="bg-gray-200 w-full h-0.5" />
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {isAuth ? (
        <div className="button-group flex justify-end">
          <div className="relative" ref={$menuRef}>
            <button
              className={`self-center relative w-32 md:w-52  rounded-md border border-gray-300 active:border-transparent hover:border-gray-400 ${
                isToggle ? 'border-gray-400' : null
              } `}
              onClick={() => setToggle((prev) => !prev)}
            >
              <div className="flex items-center text-md mx-1 py-2 px-4 font-semibold">
                <span className="userName text-gray-700">{data.me.userName}</span>
              </div>

              <span className="absolute inset-y-2 right-4">
                <FontAwesomeIcon className="text-gray-400" icon={faCaretDown} />
              </span>
            </button>

            {isToggle && (
              <div className="absolute w-full bg-white shadow-md flex flex-col z-50">
                <Link
                  to={`/user/${data.me.userName}`}
                  className="flex-1 flex mt-2 mb-2 py-2 px-4 pointer  hover:bg-gray-300"
                >
                  <span className="pr-2">
                    <FontAwesomeIcon className="text-gray-400" icon={faUserCircle} />
                  </span>
                  <span className="text-sm font-semibold">My Profile</span>
                </Link>
                <Link
                  to="/#"
                  onClick={handleSignOut}
                  className="flex-1 flex mb-2 py-2 px-4 pointer hover:bg-gray-300"
                >
                  <span className="pr-2">
                    <FontAwesomeIcon className="text-gray-400" icon={faSignOutAlt} />
                  </span>
                  <span className="text-sm font-semibold">Sign Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="button-group flex flex-1 justify-end">
          <Link
            to="/login"
            className="border-solid text-sm rounded-full mx-1 py-2 px-9 border-2 border-blue-500 text-blue-500 font-bold"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="border-solid text-sm rounded-full mx-1 py-2 px-9 border-2 bg-blue-400 text-white font-bold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
