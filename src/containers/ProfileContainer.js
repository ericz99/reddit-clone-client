import React from 'react';

export default function ProfileContainer(props) {
  return (
    <>
      <div className="flex-1 h-screen bg-gray-300 relative">
        <div className="flex flex-col lg:p-6 lg:flex-row justify-center p-2 bg-gray-300">
          <div className="flex flex-col">
            <div className="lg:w-640 w-auto border-transparent hover:border-gray-400 cursor-pointer mb-3">
              {props.children}
            </div>
          </div>

          <div className="lg:block self-start lg:w-312 ml-7 hidden flex flex-col sticky top-4">
            <div className="about-community mb-2 bg-gray-100 rounded-md">
              <div className="header h-12 leading-loose bg-blue-500 flex px-4 items-center border-b-2 border-gray-400">
                <h1 className="font-semibold text-sm text-white">About Me</h1>
              </div>

              <div className="bg-gray-100 p-4">
                <p className="description text-sm">Joined Recently</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
