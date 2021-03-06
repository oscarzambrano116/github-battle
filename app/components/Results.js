var React = require('react');
var PropTypes = require('prop-types');
var queryString = require('query-string');
var api = require('../utils/api');
var Link = require('react-router-dom').Link;
var PlayerPreview = require('./PlayerPreview');
var Loading = require('./Loading');

// Profile component

function Profile (props) {
  const { info } = props;
  return (
    <PlayerPreview avatar={info.avatar_url} username={info.login}>
      <ul className="space-list-items">
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        {info.company && <li>{info.company}</li>}
        <li>Followers: {info.followers}</li>
        <li>Following: {info.following}</li>
        <li>Public Repos: {info.public_repos}</li>
        {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
      </ul>
    </PlayerPreview>
  );
}

Profile.propTypes = {
  info: PropTypes.object.isRequired
};

// Player component

function Player (props) {
  const { label, score, profile } = props;
  return (
    <div>
      <h1 className="header">{label}</h1>
      <h3 style={{ textAlign: 'center' }}>Score: {score}</h3>
      <Profile info={profile} />
    </div>
  );
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired
};

// Result component

class Results extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true
    }
  }

  componentDidMount () {
    const {
      location: {
        search
      }
    } = this.props;
    var players = queryString.parse(search);
    api.battle([
      players.playerOneName,
      players.playerTwoName
    ]).then(function (results) {

      if (results === null) {
        return this.setState(function () {
          return {
            error: 'Looks like there was an error. Check that both users exist on Github',
            loading: false
          }
        })
      }

      this.setState(function () {
        return {
          winner: results[0],
          loser: results[1],
          error: null,
          loading: false
        }
      });

    }.bind(this));
  }

  render() {
    const {
      winner,
      loser,
      error,
      loading
    } = this.state;

    if(loading === true) {
      return <Loading />
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to='/battle'>Reset</Link>
        </div>
      )
    }

    return (
      <div className="row">
        <Player
          label='Winner'
          score={winner.score}
          profile={winner.profile}
        />
        <Player
          label='Loser'
          score={loser.score}
          profile={loser.profile}
        />
      </div>
    )
  }
}

module.exports = Results;
