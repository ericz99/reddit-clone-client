/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Loader from 'react-loader-spinner';

import { ME_QUERY } from '../graphql/user';
import { GET_COMMUNITY } from '../graphql/community';

import Post from '../components/Post';
import ComContainer from '../containers/ComContainer';

export default function Community(props) {
  // const limitRef = useRef(10);
  const { loading: meLoading, data: meData } = useQuery(ME_QUERY);
  const { loading: comLoading, data: comData, refetch } = useQuery(GET_COMMUNITY, {
    variables: {
      name: props.match.params.name,
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (meLoading) return null;
  if (comLoading)
    return (
      <div className="absolute inset-center">
        <Loader type="Bars" color="#00BFFF" height={100} width={100} />
      </div>
    );

  // const handleScroll = ({ currentTarget }) => {
  //   if (
  //     Math.round(currentTarget.scrollTop + currentTarget.clientHeight) >= currentTarget.scrollHeight
  //   ) {
  //     if (postData.getPosts.hasNextPage) {
  //       refetch({
  //         name: props.match.params.name,
  //         offset: 0,
  //         limit: (limitRef.current += 10),
  //       });
  //     }
  //   }
  // };

  return (
    <ComContainer
      loggedInUser={meData ? meData.me : null}
      comData={comData}
      refetch={refetch}
      {...props}
    >
      {comData.getCommunity.posts.map((post, key) => {
        return <Post key={key} post={post} {...props} meData={meData} refetch={refetch} />;
      })}
    </ComContainer>
  );
}
