import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { CREATE_COMMUNITY } from '../graphql/community';

import useInput from '../hooks/useInput';
import InputField from '../components/InputField';

export default function CreateCommunity(props) {
  const { inputs, handleChange } = useInput();
  const [errors, setErrors] = useState({});
  const [createCommunity, { loading }] = useMutation(CREATE_COMMUNITY);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (inputs.description && inputs.description.length > 250) {
      errors.push({ description: 'Must be less than 250 characters long!' });
    }

    const { data } = await createCommunity({ variables: { ...inputs } });

    if (!loading && data) {
      if (!data.createCommunity.ok) {
        const fieldErrors = data.createCommunity.errors;
        for (const key of fieldErrors) {
          setErrors({ [key]: fieldErrors[key] });
        }

        return false;
      } else {
        setErrors({});
      }
    }

    // # go to login page
    props.history.push('/');
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
            <div className="text-lg mb-8 font-semibold">Create Community</div>

            <form onSubmit={handleOnSubmit} className="w-96 flex flex-col">
              <InputField
                type="text"
                name="name"
                placeholder="Community Name"
                hasError={errors.name || ''}
                onChange={handleChange}
                className="py-2 px-2 border-2 border-gray-300 rounded w-full"
              />

              <InputField
                type="text"
                name="title"
                placeholder="Title (Can be modify later)"
                hasError={errors.name || ''}
                onChange={handleChange}
                className="py-2 px-2 border-2 border-gray-300 rounded w-full"
              />

              <InputField
                type="text"
                name="description"
                placeholder="Description (Optional)"
                hasError={errors.name || ''}
                onChange={handleChange}
                className="py-2 px-2 border-2 border-gray-300 rounded w-full"
              />

              <button
                type="submit"
                className="w-full my-4 py-3 px-2 border-2 rounded bg-blue-400 text-white border-white"
              >
                Create Community
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
