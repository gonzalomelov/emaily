import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';
import * as actions from '../../actions';

class SurveyFormReview extends Component {
  renderFields() {
    return formFields.map(({ label, name }) => (
      <div key={name}>
        <label>{label}</label>
        <div>{this.props.formValues[name]}</div>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <h2>Please confirm your entries</h2>
        {this.renderFields()}
        <button
          className='yellow darken-3 btn-flat left white-text'
          onClick={this.props.onCancel}
        >
          <i className='material-icons left'>arrow_back</i>
          Back
        </button>
        <button
          className='teal btn-flat right white-text'
          onClick={() => this.props.createSurvey(this.props.formValues, this.props.history)}
        >
          <i className='material-icons right'>email</i>
          Send
        </button>
      </div>
    )
  }
}

const mapStateToProps = ({ form: { surveyForm: { values } } }) => {
  return { formValues: values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));