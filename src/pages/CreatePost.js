import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { ME_QUERY } from '../graphql/user';
import { CREATE_POST } from '../graphql/post';

import useInput from '../hooks/useInput';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';
import PostContainer from '../containers/PostContainer';

export default function CreatePost(props) {
  const [createPost] = useMutation(CREATE_POST);
  const { loading, data } = useQuery(ME_QUERY);
  const [counter, setCounter] = useState(0);
  const { inputs, handleChange } = useInput();

  if (loading) return null;

  const handleKeyDown = (e) => {
    if (e.keyCode === 8 && counter > 0) {
      setCounter((prev) => prev - 1);
    }

    if ((e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 96 && e.keyCode < 123)) {
      if (counter < 200) {
        setCounter((prev) => prev + 1);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({ variables: { ...inputs, comName: props.match.params.name } });
    // # redirect user back to community page
    props.history.goBack();
  };

  return (
    <PostContainer loggedInUser={data ? data.me : null} {...props}>
      <form onSubmit={handleSubmit} className="lg:w-640 w-auto cursor-pointer mb-3 bg-white p-4">
        <h1 className="text-lg font-light">Submit a post</h1>
        <div className="block relative">
          <InputField
            type="text"
            name="title"
            placeholder="Title (required)"
            value={inputs.title || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={200}
            className="py-2 px-2 border-2 border-gray-300 font-light rounded w-full relative"
          />
          <div className="counter absolute inset-y-2 right-3 text-gray-300">{counter}/200</div>
        </div>
        <div className="block relative">
          <TextArea
            type="text"
            name="body"
            placeholder="Body (optional)"
            value={inputs.body || ''}
            onChange={handleChange}
            className="py-2 px-2 border-2 border-gray-300 font-light rounded w-full relative resize-none"
          />
        </div>
        <div className="block relative mt-2">
          <button
            type="submit"
            className="w-full py-2 px-2 border-2 rounded-md bg-blue-400 text-white border-white"
          >
            Submit Post
          </button>
        </div>
      </form>
    </PostContainer>
  );
}
