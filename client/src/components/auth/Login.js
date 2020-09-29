import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login, loginSpotify} from "../../actions/auth";

const Login = ({ login, isAuthenticated, loginSpotify}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const getCode = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);
    if(code!=null){
      let res = await fetch('http://localhost:5000/api/auth/spotifySuccess?code='+code);
      let resJson = await res.json();
      loginSpotify(resJson);
    }
  }

  useEffect(() => {
    getCode();
  }, []);

  const loginButton = () => {
    var scopes = 'user-read-private user-read-email';
    window.location.replace('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + 'e1cea386be574842887095c9d756e0d9' +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent('http://localhost:3000/login'));
  }

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  //   const onChange = (e) => setFormData({ [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      {" "}
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign In Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
        <button type="button" onClick={loginButton}>Activate Lasers</button>
      </form>
      <p className="my-1">
        Dont have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  loginSpotify: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated, //En reducer index
});

export default connect(mapStateToProps, { login, loginSpotify })(Login);
