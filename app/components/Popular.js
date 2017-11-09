var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');
var Loading = require('./Loading');

// SelectLanguage Bar Component

function SelectLanguage (props) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {
        languages.map(function (lang){
          return (
            <li
              style={ lang === props.selectedLanguage ? { color: '#d0021b'} : null }
              onClick={props.onSelect.bind(null, lang)}
              key={lang}>
              {lang}
            </li>
          )
        })
      }
    </ul>
  );
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// RepoGrid Bar Component

function RepoGrid (props) {
  const { repos } = props;
  return (
    <ul className='popular-list'>
      {
        repos.map(function (repo, index) {
          return (
            <li key={repo.name} className='popular-item'>
              <div className="popular-rank">#{index + 1}</div>
              <ul className="space-list-items">
                <li>
                  <img
                    className="avatar"
                    src={repo.owner.avatar_url}
                    alt={'Avatar for ' + repo.owner.login} />
                </li>
                <li><a href={repo.html_url}>{repo.name}</a></li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count} stars</li>
              </ul>
            </li>
          )
        })
      }
    </ul>
  );
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

// Popular component

class Popular extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null,
    };
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount () {
    const { selectedLanguage } = this.state;
    this.updateLanguage(selectedLanguage)
  }

  updateLanguage(lang) {
    this.setState(function () {
      return {
        selectedLanguage: lang,
        repos: null
      }
    });

    api.fetchPopularRepos(lang)
      .then(function(repos) {
        this.setState(function () {
          return {
            repos: repos
          }
        });
      }.bind(this));
  }

  render() {
    const { selectedLanguage, repos } = this.state;
    return(
      <div>
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage} />
        {
          !repos ? <Loading /> : <RepoGrid repos={repos} />
        }
      </div>
    );
  }
}

module.exports = Popular;
