import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends Component {
  render() {
    return (
      <>
        <li>
          <StripeCheckout
            name="Emaily"
            description="$5 for 5 email credits"
            amount={500}
            token={(token) => this.props.handleToken(token)}
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
          >
            <button className="btn">Add Credits</button>
          </StripeCheckout>
        </li>
        <li style={{margin: '0 10px'}}>
          <span>Credits: {this.props.credits}</span>
        </li>
      </>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { credits: auth.credits };
}

export default connect(mapStateToProps, actions)(Payments);
