import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { reduxForm, Field } from 'redux-form';
import SurveyField from './SurveyField'
import validateEmail from '../../utils/validateEmail';

const FIELDS = [
  { label: 'Title', name: 'title' },
  { label: 'Subject Line', name: 'subject' },
  { label: 'Email Body', name: 'body' },
  { label: 'Recipients', name: 'emails' },
];

class SurveyForm extends Component {
  renderFields() {
    return FIELDS.map(({ label, name}) => {
      return (
        <Field key={name} label={label} type='text' name={name} component={SurveyField} />
      );
    })
  }
  
  render() {
    return (
      <div>
        <form
          onSubmit={this.props.handleSubmit(values => console.log(values))}
        >
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type='submit' className='teal btn-flat right white-text'>Next<i className='material-icons right'>done</i></button>
        </form>
      </div>
    )
  }
}

const validate = (values) => {
  const errors = {};

  FIELDS.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = `You must provide a ${name}`;
    }
  })
  
  const { emails } = values; // title, subject, body, 

  if (emails) {
    const validateEmailResponse = validateEmail(emails);
    if (!validateEmailResponse.valid) {
      errors.emails = validateEmailResponse.error;
    }
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm'
})(SurveyForm);