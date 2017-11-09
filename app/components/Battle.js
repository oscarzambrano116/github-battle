var React = require('react');
var PropTypes = require('prop-types');
var Link = require('react-router-dom').Link;
var PlayerPreview = require('./PlayerPreview');

// Player Input component

class PlayerInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    var value = event.target.value;
    this.setState(function(){
      return {
        username: value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username } = this.state;
    const { onSubmit, id } = this.props;
    onSubmit(id, username);
  }

  render() {
    const { username } = this.state;
    const { label } = this.props;
    return (
      <form className="column" onSubmit={this.handleSubmit} >
        <label htmlFor="username" className="header">
          {label}
        </label>
        <input
          id='username'
          placeholder='github username'
          type='text'
          autoComplete='off'
          value={username}
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'
          disabled={!username}
          >
            Submit
        </button>
      </form>
    )
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

// Battle Component

class Battle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit(id, username) {
    this.setState(function(){
      var newState = {};
      newState[id+ 'Name'] = username;
      newState[id+ 'Image'] = 'https://github.com/' + username + '.png?size=200';
      return newState;
    });
  }

  handleReset(id,) {
    this.setState(function(){
      var newState = {};
      newState[id+ 'Name'] = '';
      newState[id+ 'Image'] = null;
      return newState;
    });
  }

  render() {
    const { match } = this.props;
    const {
      playerOneName,
      playerTwoName,
      playerOneImage,
      playerTwoImage
    } = this.state;
    return (
      <div>
        <div className="row">
          { !playerOneName &&
            <PlayerInput
              id="playerOne"
              label='Player One'
              onSubmit={this.handleSubmit}
            /> }
          { playerOneImage !== null &&
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}>
                <button
                  className="reset"
                  onClick={this.handleReset.bind(null, 'playerOne')}>
                    Reset
                </button>
            </PlayerPreview> }
          { !playerTwoName &&
            <PlayerInput
              id="playerTwo"
              label='Player Two'
              onSubmit={this.handleSubmit}
            /> }
          { playerTwoImage !== null &&
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}>
                <button
                  className="reset"
                  onClick={this.handleReset.bind(null, 'playerTwo')}>
                    Reset
                </button>
            </PlayerPreview> }
        </div>
        { playerOneImage && playerTwoImage &&
          <Link
            className="button"
            to={{
              pathname: match.url + '/results',
              search: '?playerOneName=' + playerOneName + '&playerTwoName=' + playerTwoName
            }} >
              Battle
          </Link>
        }
      </div>
    )
  }
}

module.exports = Battle;
