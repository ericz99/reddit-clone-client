import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import { REGISTER_USER } from '../graphql/user';

import useInput from '../hooks/useInput';
import InputField from '../components/InputField';

export default function Register(props) {
  const { inputs, handleChange } = useInput();
  const [errors, setErrors] = useState({});
  const [registerAccount, { loading }] = useMutation(REGISTER_USER);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const { data } = await registerAccount({ variables: { ...inputs } });

    if (!loading && data) {
      if (!data.registerAccount.ok) {
        const fieldErrors = data.registerAccount.errors;
        for (let i = 0; i < fieldErrors.length; i++) {
          setErrors((prev) => ({
            ...prev,
            [fieldErrors[i].path]: fieldErrors[i].message,
          }));
        }

        return false;
      } else {
        setErrors({});
      }
    }

    // # go to login page
    props.history.push('/login');
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
            <div className="text-lg mb-8 font-semibold">Sign Up</div>

            <form onSubmit={handleOnSubmit} className="w-96 flex flex-col">
              <InputField
                type="text"
                name="userName"
                placeholder="Username"
                hasError={errors.userName || ''}
                onChange={handleChange}
                className="py-2 px-2 border-2 border-gray-300 rounded w-full"
              />
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

              <Link to="/login" className="text-xs no-underline text-blue-500 font-medium">
                Already have an account?
              </Link>

              <button
                type="submit"
                className="w-full my-4 py-3 px-2 border-2 rounded bg-blue-400 text-white border-white"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
