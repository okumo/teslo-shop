"use client";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import React from "react";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  amount: number;
  orderId: string;
}

export const PayPalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100; //123.23

  if (isPending) {
    return (
      <div className="animate-pulse mb-16">
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded mt-2" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: roundedAmount.toString(),
            currency_code: "USD",
          },
        },
      ],
      intent: "CAPTURE",
    });

    await setTransactionId(transactionId, orderId);

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log("onApprove");
    const details = await actions.order?.capture();

    if (!details) return;

    await paypalCheckPayment(details.id!);
  };
  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};
