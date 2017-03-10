// React
var React = require('react')
var ReactDOM = require('react-dom') 

// Movie data
var movieData = require('./data/movies.json')

// Components
var Header = require('./components/Header')
var MovieDetails = require('./components/MovieDetails')
var MovieList = require('./components/MovieList')
var NoCurrentMovie = require('./components/NoCurrentMovie')
var TheatreMap = require('./components/TheatreMap')
var SortBar = require('./components/SortBar')

// There should really be some JSON-formatted data in movies.json, instead of an empty array.
// I started writing this command to extract the data from the learn-sql workspace
// on C9, but it's not done yet :) You must have the csvtojson command installed on your
// C9 workspace for this to work.
// npm install -g csvtojson
// sqlite3 -csv -header movies.sqlite3 'select "imdbID" as id, "title" from movies' | csvtojson --maxRowLength=0 > movies.json

// Firebase configuration
var Rebase = require('re-base')
var base = Rebase.createClass({
  apiKey: "AIzaSyApffI6rR1juD2wS2hFIAqXIMx6COrtzxg",   // replace with your Firebase application's API key
  authDomain: "finalnew-49e97.firebaseapp.com",
  databaseURL: "https://finalnew-49e97.firebaseio.com", // replace with your Firebase application's database URL
})

var App = React.createClass({
  movieClicked: function(movie) {
    this.setState({
      currentMovie: movie
    })
  },
  movieWatched: function(movie) {
    var existingMovies = this.state.movies
    var moviesWithWatchedMovieRemoved = existingMovies.filter(function(existingMovie) {
      return existingMovie.id !== movie.id
    })
    this.setState({
      movies: moviesWithWatchedMovieRemoved,
      currentMovie: null
    })
  },
  resetMovieListClicked: function() {
    this.setState({
      movies: movieData.sort(this.movieCompareByReleased)
    })
  },
  viewChanged: function(view) {
    this.setState({
      currentView: view
    })
  },


  renderMovieDetails: function() {
    if (this.state.currentMovie == null) {
      return <NoCurrentMovie resetMovieListClicked={this.resetMovieListClicked} />
    } else {
      return <MovieDetails movie={this.state.currentMovie}
                           movieWatched={this.movieWatched} />
    }
  },
  renderMainSection: function() {
  if (this.state.currentView === 'map') {
    return (
      <div className="col-sm-12">
      <TheatreMap />
      </div>
    )
  } else if (this.state.currentView === 'alpha') {
    return (
      <div>
        <MovieList movies={this.state.movies.sort(this.movieCompareByTitle)} movieClicked={this.movieClicked} />
        {this.renderMovieDetails()}
      </div>
    )
  }  else {
    return (
      <div>
        <MovieList movies={this.state.movies.sort(this.movieCompareByReleased)} movieClicked={this.movieClicked} />
        {this.renderMovieDetails()}
      </div>
    )
  }
},
  movieCompareByTitle: function(movieA, movieB) {
    if (movieA.title < movieB.title) {
      return -1
    } else if (movieA.title > movieB.title) {
      return 1
    } else {
      return 0
    }
  },
  movieCompareByReleased: function(movieA, movieB) {
    if (movieA.released > movieB.released) {
      return -1
    } else if (movieA.released < movieB.released) {
      return 1
    } else {
      return 0
    }
  },
  getInitialState: function() {
    return {
      movies: movieData.sort(this.movieCompareByReleased),
      currentMovie: null,
      currentView: 'latest'
    }
  },
  componentDidMount: function() {
    // We'll need to enter our Firebase configuration at the top of this file and
    // un-comment this to make the Firebase database work
    base.syncState('/movies', { context: this, state: 'movies', asArray: true })
  },
  render: function() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <SortBar currentView={this.state.currentView} movieCount={this.state.movies.length} viewChanged={this.viewChanged} />
        <div className="main row">
          {this.renderMainSection()}
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App />, document.getElementById("app"))
