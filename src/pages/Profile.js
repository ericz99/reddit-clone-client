/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';

import { ME_QUERY } from '../graphql/user';
import { GET_POSTS } from '../graphql/post';
import { GET_COMMENTS } from '../graphql/comment';

import Post from '../components/Post';
import ProfileContainer from '../containers/ProfileContainer';

export default function Profile(props) {
  const [isLoading, setLoading] = useState(false);
  const [overview, setOverview] = useState([]);
  const { loading: meLoading, data: meData } = useQuery(ME_QUERY);
  const { loading: commentLoading, data: commentData } = useQuery(GET_COMMENTS);
  const { loading: postLoading, data: postData, refetch } = useQuery(GET_POSTS, {
    variables: {
      offset: 0,
      limit: 1000, // # TODO: probably gonna have a separate post / comments catalog
    },
  });

  useEffect(() => {
    if (meLoading || commentLoading || postLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [meLoading, commentLoading, postLoading]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!postLoading && !commentLoading) {
      console.log(postData.getPosts.docs);
      const combined = [...postData.getPosts.docs, ...commentData.getComments];
      const matched = combined
        .filter((u) => u.author.id === meData.me.id)
        .sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

      setOverview(matched);
    }

    return () => {
      setOverview([]);
    };
  }, [meData, postData, commentData, postLoading, commentLoading]);

  // if (meLoading) return null;
  // if (postLoading) return null;
  // if (commentLoading) return null;

  if (isLoading)
    return (
      <div className="absolute inset-center">
        <Loader type="Bars" color="#00BFFF" height={100} width={100} />
      </div>
    );

  return (
    <ProfileContainer {...props}>
      {overview.length !== 0 ? (
        overview.map((o, key) => {
          if (o.__typename === 'Post') {
            return <Post key={key} post={o} {...props} meData={meData} refetch={refetch} />;
          } else {
            return (
              <div key={key} className="flex mb-2">
                <div className="bg-gray-200 px-2 py-2 flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faCommentAlt} className="text-gray-300" />
                </div>
                <div className="flex-1 bg-white">
                  <div className="p-2">
                    <span className="text-blue-300 text-xs">{meData.me.userName} </span>
                    <span className="text-gray-300 text-xs">commented on: {o.post.title}</span>
                    <span className="h-0.5 w-0.5 bg-gray-500 rounded-full" />
                  </div>

                  <hr />

                  <div className="p-2">
                    <span className="text-lg">{o.body}</span>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="text-center">Currently Empty!</div>
      )}
    </ProfileContainer>
  );
}
