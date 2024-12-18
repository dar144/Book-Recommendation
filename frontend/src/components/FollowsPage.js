import React, { useState } from "react";
import {
  fetchFollowers,
  fetchFollowing,
  searchUsers,
  followUser,
  unfollowUser,
} from "../services/api";
import { useFetch } from "../hooks/useFetch";
import FollowRecommendations from "./FollowRecommendations";

const FollowsPage = () => {
  const { data: followersData, loading: loadingFollowers } = useFetch(fetchFollowers);
  const { data: followingData, loading: loadingFollowing } = useFetch(fetchFollowing);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const followers = followersData?.followers || [];
  const following = followingData?.following || [];

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;
    const { data } = await searchUsers(searchQuery);
    setSearchResults(data.users || []);
  };

  const handleFollow = async (user) => {
    await followUser(user);
    setSearchResults((prev) => prev.filter((u) => u !== user));
  };

  const handleUnfollow = async (user) => {
    await unfollowUser(user);
    setSearchResults((prev) => prev.filter((u) => u !== user));
  };

  return (
    <div className="follows-page">
      <h1>Follows</h1>

      <FollowRecommendations /> {/* New Component */}

      <h2>Your Followers</h2>
      {loadingFollowers ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {followers.map((follower, index) => (
            <li key={index}>{follower}</li>
          ))}
        </ul>
      )}

      <h2>People You Follow</h2>
      {loadingFollowing ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {following.map((user, index) => (
            <li key={index}>
              {user} <button onClick={() => handleUnfollow(user)}>Unfollow</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Find Users</h2>
      <input
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((user, index) => (
          <li key={index}>
            {user} <button onClick={() => handleFollow(user)}>Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowsPage;
