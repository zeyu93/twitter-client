import React from "react";
import twitter from "twitter-text";

export default function Tweet({ text, public_metrics, username, name }) {
  text = twitter.autoLink(text);
  return (
    <div className="tweet-container">
      <div className="tweet-container__user">
        <a
          href={`https://twitter.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="user-name"
        >
          {name}
        </a>
        <span className="username">{`@${name}`}</span>
      </div>
      <div
        className="tweet-container__body"
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <Metrics public_metrics={public_metrics} />
    </div>
  );
}

function Metrics({ public_metrics }) {
  const { retweet_count, like_count } = public_metrics;
  return (
    <div className="tweet-container__metrics">
      <div>
        <span>retweets {retweet_count}</span>
      </div>
      <div>
        <span>likes {like_count}</span>
      </div>
      <div>
        <span>total {retweet_count + like_count}</span>
      </div>
    </div>
  );
}
