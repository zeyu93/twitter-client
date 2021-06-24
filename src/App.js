import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import Tweet from "./Tweet";
import "./App.css";
const APIURL = "https://keyhole-client.herokuapp.com";

function App() {
  const [queryTerm, setQueryTerm] = useState("");
  const [tweets, setTweets] = useState([]);
  const [nextToken, setNextToken] = useState("");
  const [prevToken, setprevToken] = useState("");

  useEffect(() => {
    setTweets([]);
  }, [queryTerm]);

  function getTweets(queryTerm, nextToken = "", prevToken = "") {
    axios
      .get(`${APIURL}?term=${queryTerm}&next_token=${nextToken}`)
      .then((res) => {
        const next_token = res.data?.meta?.next_token || "";
        const prev_token = res.data?.meta?.prev_token || "";
        // this just makes the data easier to work with since API returns user object in a different array
        const tweetsWithUsers = mapUserToTweet(res.data);
        const sortedTweets = sortTweetsByRetweetsAndLikes(tweetsWithUsers);
        setTweets(sortedTweets);
        setNextToken(next_token);
        setprevToken(prev_token);
      })
      .catch((e) => console.log("error fetching tweets", e));
  }

  function mapUserToTweet(data) {
    const users = data.includes.users;
    const tweets = data.data;
    let tweetsWithUserInfo = tweets.map((tweet) => {
      const userInfoForThisTweet = users.find(
        (user) => user.id === tweet.author_id
      );
      return {
        ...tweet,
        username: userInfoForThisTweet.username,
        name: userInfoForThisTweet.name,
      };
    });
    return tweetsWithUserInfo;
  }

  function sortTweetsByRetweetsAndLikes(tweets) {
    return tweets.sort((a, b) => {
      const sumOfRetweetAndLikesA =
        a.public_metrics.retweet_count + a.public_metrics.like_count;
      const sumOfRetweetAndLikesB =
        b.public_metrics.retweet_count + b.public_metrics.like_count;
      return sumOfRetweetAndLikesB - sumOfRetweetAndLikesA;
    });
  }
  // this is to give a little delay 500ms , so it only sends a requsts after user finishes typing to prevent unneeded extra requests
  // useCallBack so it stores the callback between re-render, or useRef works as well
  const delayedRequest = useCallback(
    _.debounce((qterm) => getTweets(qterm), 500),
    []
  );

  function handleCahange(e) {
    const { value } = e.target;
    setQueryTerm(value);
    delayedRequest(queryTerm);
  }

  function handleNextPage() {
    console.log("getting next page");
    getTweets(queryTerm, nextToken);
  }

  function handlePrevPage() {}

  return (
    <div className="App">
      <div className="header-container">
        <span className="header">Zeyu 's twitter app for KeyHole</span>
      </div>
      <div className="search-container">
        <div className="search-container--inner">
          <input
            className="search-bar"
            id="search"
            type="text"
            placeholder="Search"
            value={queryTerm}
            onChange={handleCahange}
          />
        </div>
      </div>
      <div className="tweets-container">
        {tweets.map((tweet) => (
          <Tweet {...tweet} key={tweet.id} />
        ))}
      </div>
      <div className="pagination-container">
        <button className="pagination-button" onClick={handlePrevPage}>
          Prev
        </button>
        <button className="pagination-button" onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
