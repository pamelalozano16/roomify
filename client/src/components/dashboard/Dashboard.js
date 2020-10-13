import React, { useEffect, Fragment} from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import {loadCurrentSong, setTimerId} from "../../actions/spotify";

const Dashboard = ({
  auth: { user, loading },
  loadCurrentSong,
  setTimerId
}) => {
  var timerId;
  const playbackState = () => {
    loadCurrentSong();
    timerId = setTimeout(playbackState, 5000); 
    // TO DO : turn of timer after log out change function to auth actions
  }
  useEffect(()=>{setTimerId(timerId);}, [])
  playbackState();
  return loading === true ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        &nbsp; Welcome {user.display_name}
      </p>
        <Fragment>
        Player:

        </Fragment>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  loadCurrentSong: PropTypes.func.isRequired,
  setTimerId: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {loadCurrentSong, setTimerId})(Dashboard);
