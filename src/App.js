import React, { Component } from "react";
import "./App.css";
import firebase from "./Firebase";
import Iframe from "react-iframe";
import 'font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Row, Container, Col } from 'react-bootstrap'
// eslint-disable-next-line
class App extends Component {
  constructor(props) {
    super(props);
    this.movies = firebase.firestore().collection("movies");
    this.users = firebase.firestore().collection("users");

    this.unsubscribe = null;
    this.state = {
      movies: [],
      url: "",
      email: "",
      password: "",
      isLoggedIn: false,
      isShareClicked: false
    };
  }
  onCollectionUpate = querySnapshot => {
    const movies = [];
    querySnapshot.forEach(doc => {
      const { url, shared_by } = doc.data();
      movies.push({
        key: doc.id,
        doc,
        url,
        shared_by
      });
    });
    this.setState({
      movies
    });
  };
  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };
  onSubmit = (e) => {
    e.preventDefault();
    var { movies, url, email, password, isLoggedIn, isShareClicked } = this.state;
    var query = this.users;
    query.where("email", "==", email).where("password", "==", password)
      .get().then(function (doc) {
        if (!doc.exists) {
          query.add({ email, password });
        }
      });
    this.setState({ isLoggedIn: true, email: email });
  };
  onLogOut = () => {
    this.setState({ isLoggedIn: false, isShareClicked: false });
  };
  onShareClick = () => {
    this.setState({ isShareClicked: true, email: this.state.email });
  };
  onSubmitShare = () => {
    var { movies, url, email, password, isLoggedIn, isShareClicked } = this.state;
    this.movies.add({ url, shared_by: email });
    this.setState({ isShareClicked: false });
  };

  componentDidMount() {
    this.unsubscribe = this.movies.onSnapshot(this.onCollectionUpate);
  }
  render() {
    var { movies, url, email, password, isLoggedIn, isShareClicked } = this.state;
    let form, body;
    if (isLoggedIn) {
      form = <div className="row">
        <h5 style={{ marginTop: '15px' }}>Welcome {this.state.email}</h5>
        <button onClick={this.onShareClick}>Share a movie</button>
        <button onClick={this.onLogOut}>LogOut</button>
      </div>;
    } else {
      form =
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.onChange}
          />
          <span>  </span>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={this.onChange}
          /><span> </span>
          <input type="submit" value="Login/Register" />
        </form>;
    }
    if (isShareClicked) {
      body = <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <form onSubmit={this.onSubmitShare}>
            <fieldset class="border p-5">
              <legend class="w-auto">Share a youtube movie:</legend>
              Youtube URL: <input type="text" style={{ width: '240px'}} name="url" value={url} onChange={this.onChange} /><br />
              <input type="submit" value="Share" style={{ marginLeft: '23%', marginTop: '20px', width: '240px' }} ></input>
            </fieldset>
          </form>
        </div>
      </div>;
    } else {
      body = <div className="container">
        {this.state.movies.map(movie => (
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-4"><Iframe
              url={movie.url}
              width="300px"
              height="200px"
              id="myId"
              className="myClassname"
              display="initial"
            /></div>
            <div className="col-md-4">
              <h2> Movie Title </h2> <h5> Shared by: {movie.shared_by} </h5>
              <span>15 <i className="fa fa-thumbs-up"></i> 10 <i className="fa fa-thumbs-down"></i></span>
              <h5>Description:</h5>
              <p> Style never met and those among great.
              Style never met and those among great.Style never met and those among great.
              </p>
            </div>
            <div className="col-md-2"></div>
          </div>
        ))}
      </div>;

    }
    return (
      <div className="container">
        <div class="topnav">
          <a>
            <h3><i className="fa fa-home" style={{ height: '20px', width: 'auto' }} /> Funny Movies</h3>
          </a>
          <div class="login-container"> {form} </div>
        </div>
        <hr />
        <div>
          {body}
        </div>
      </div>
    );
  }
}

export default App;
