var React = require('react');
var PropTypes = require('prop-types');

function PlayerPreview (props) {
  const { avatar, username } = props;
  return (
    <div>
      <div className="column">
        <img
          className="avatar"
          src={avatar}
          alt={'Avatar for ' + username}
        />
        <h2 className="username">@{username}</h2>
      </div>
      {props.children}
    </div>
  )
}

PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

module.exports = PlayerPreview;
