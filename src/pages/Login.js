import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import { LOGIN_USER } from '../graphql/user';

import useInput from '../hooks/useInput';
import InputField from '../components/InputField';

export default function Register(props) {
  const { inputs, handleChange } = useInput();
  const [errors, setErrors] = useState({});
  const [loginAccount, { loading }] = useMutation(LOGIN_USER);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const { data } = await loginAccount({ variables: { ...inputs } });

    if (!loading && data) {
      if (!data.loginAccount.ok) {
        const fieldErrors = data.loginAccount.errors;
        for (let i = 0; i < fieldErrors.length; i++) {
          setErrors({ [fieldErrors[i].path]: fieldErrors[i].message });
        }

        return false;
      } else {
        setErrors({});
      }
    }

    // # set token to localstorage
    localStorage.setItem('accessToken', data.loginAccount.accessToken);
    localStorage.setItem('refreshToken', data.loginAccount.refreshToken);
    // # go to login page
    window.location.href = '/';
  };

  return (
    <div className="h-full w-full">
      <div className="h-full flex flex-row">
        <img
          className="object-cover h-full w-24"
          src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
          alt="reddit-pic"
        />

        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-11/12 mx-auto">
            <div className="text-lg mb-8 font-semibold">Sign In</div>

            <form onSubmit={handleOnSubmit} className="w-96 flex flex-col">
              <InputField
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                hasError={errors.email || ''}
                className="py-2 px-2 border-2 border-gray-300 rounded w-full"
              />
              <InputField
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                hasError={errors.password || ''}
                className="py-2 px-2 border-2 border-gray-300 rounded w-full"
              />

              <Link to="/register" className="text-xs no-underline text-blue-500 font-medium">
                Don't have an account?
              </Link>

              <button
                type="submit"
                className="w-full my-4 py-3 px-2 border-2 rounded bg-blue-400 text-white border-white"
              >
                Login Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
