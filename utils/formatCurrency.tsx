import React from "react";

const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  const formattedString = formatter.format(amount / 100);

  return formattedString;
};

export default formatCurrency;
