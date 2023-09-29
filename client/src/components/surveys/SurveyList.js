import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }
  
  renderSurveys() {
    return this.props.surveys.map(survey => (
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">{survey.title}</span>
          <p>Yes: {survey.yes}</p>
          <p>No: {survey.no}</p>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <>
        <h2>SurveyList</h2>
        {this.renderSurveys()}
      </>
    );
  }
}

const mapStateToProps = ({ surveys }) => ({ surveys });

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);