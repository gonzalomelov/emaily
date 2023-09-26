import React, { Component } from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';

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
          type='submit'
          className='blue btn-flat left white-text'
          onClick={this.props.onCancel}
        >
          <i className='material-icons left'>arrow_back</i>
          Back
        </button>
      </div>
    )
  }
}

const mapStateToProps = ({ form: { surveyForm: { values } } }) => {
  return { formValues: values };
}

export default connect(mapStateToProps)(SurveyFormReview);