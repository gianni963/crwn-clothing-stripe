import { useState, FormEvent } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

import { selectCartTotal } from '../../store/cart/cart.selector.ts';
import { selectCurrentUser } from '../../store/user/user.selector.ts';

import { BUTTON_TYPE_CLASSES } from "../button/button.component.tsx";

import { PaymentFormContainer, FormContainer, PaymentButton } from "./payment-form.styles.tsx";

const ifValidCardElement = (card: StripedCardElement | null): card is StripeCardElement => card !== null;

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const amount = useSelector(selectCartTotal);
    const currentUser = useSelector(selectCurrentUser);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
    const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      setIsProcessingPayment(true);
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount * 100 }),
      }).then((res) => {
        return res.json();
      });
  
      const clientSecret = response.paymentIntent.client_secret;

      const cardDetails = elements.getElement(CardElement);

      if(!ifValidCardElement(cardDetails)) return;
  
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardDetails,
          billing_details: {
            name: currentUser ? currentUser.displayName : 'Yihua Zhang',
          },
        },
      });
  
      setIsProcessingPayment(false);
  
      if (paymentResult.error) {
        alert(paymentResult.error.message);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          alert('Payment Successful!');
        }
      }
    };



    return (
        <PaymentFormContainer>
            <FormContainer onSubmit={paymentHandler}>
                <h2>Credit Card Payment: </h2>
                <CardElement />
                <PaymentButton isLoading={isProcessingPayment} buttonType={BUTTON_TYPE_CLASSES.inverted}>
                    Pay now
                </PaymentButton>
            </FormContainer>
        </PaymentFormContainer>
    )
}

export default PaymentForm;