/* eslint-disable array-callback-return */
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import Loader from 'react-loader-spinner';

import { ME_QUERY } from '../graphql/user';
import { GET_POSTS } from '../graphql/post';

import Post from '../components/Post';
import ComContainer from '../containers/ComContainer';

export default function Community(props) {
  const limitRef = useRef(10);
  const { loading: meLoading, data: meData } = useQuery(ME_QUERY);
  const { loading: postLoading, data: postData, refetch } = useQuery(GET_POSTS, {
    variables: {
      name: props.match.params.name,
      offset: 0,
      limit: limitRef.current,
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (meLoading) return null;
  if (postLoading)
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
        refetch({
          name: props.match.params.name,
          offset: 0,
          limit: (limitRef.current += 10),
        });
      }
    }
  };

  return (
    <ComContainer loggedInUser={meData ? meData.me : null} onScroll={handleScroll} {...props}>
      {postData.getPosts.docs.map((post, key) => {
        if (post.community.name === props.match.params.name) {
          return <Post key={key} post={post} {...props} meData={meData} refetch={refetch} />;
        }
      })}
    </ComContainer>
  );
}
