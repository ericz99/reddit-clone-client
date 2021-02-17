/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Loader from 'react-loader-spinner';

import { ME_QUERY } from '../graphql/user';
import { GET_COMMUNITY } from '../graphql/community';

import Post from '../components/Post';
import ComContainer from '../containers/ComContainer';

export default function Community(props) {
  const [limit, setLimit] = useState(10);
  const { loading: meLoading, data: meData } = useQuery(ME_QUERY);
  const { loading: comLoading, data: comData, refetch } = useQuery(GET_COMMUNITY, {
    variables: {
      name: props.match.params.name,
    },
  });

  useEffect(() => {
    refetch({
      variables: {
        name: props.match.params.name,
      },
    });
  }, [refetch, props.match.params.name]);

  if (meLoading || comLoading)
    return (
      <div className="absolute inset-center">
        <Loader type="Bars" color="#00BFFF" height={100} width={100} />
      </div>
    );

  const handleScroll = ({ currentTarget }) => {
    if (
      Math.round(currentTarget.scrollTop + currentTarget.clientHeight) >= currentTarget.scrollHeight
    ) {
      if (comData.getCommunity.posts.length >= limit) {
        setLimit((prev) => prev + 10);
      }
    }
  };

  return (
    <ComContainer
      loggedInUser={meData ? meData.me : null}
      comData={comData}
      refetch={refetch}
      onScroll={handleScroll}
      {...props}
    >
      {comData.getCommunity.posts.slice(0, limit).map((post, key) => {
        return <Post key={key} post={post} {...props} meData={meData} refetch={refetch} />;
      })}
    </ComContainer>
  );
}
