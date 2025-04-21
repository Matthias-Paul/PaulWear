import { PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js"


const PayPalButton = ({amount, onSuccess, onError}) => {
  return <PayPalScriptProvider options={{"client-id":"AaMT-MS2IOV-oj3za5pN3RC71d-9Aep9JOi_7JhC-yL1CToFfLTvlFKwC0XCH5togG28bOBwg7RNtPu3"}} >
    <PayPalButtons  style={{ layout:"vertical"}} 
      createOrder={(data, actions) =>{
        return actions.order.create({
          purchase_units:[{amount :{value: amount}}]
        })
      }}
      onApprove={(data, actions)=>{
          return actions.order.capture().then(onSuccess)
      }}

      onError={onError}

      />
    </PayPalScriptProvider>
}

export default PayPalButton
