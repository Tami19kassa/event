export type PaymentSettings = {
  cbeAccount: string;
  cbeAccountName: string;
  telebirrNumber: string;
  telebirrAccountName: string;
  allowPayAtGate: boolean;
  currency: string;
};

export const defaultPaymentSettings: PaymentSettings = {
  cbeAccount: "1000345678901",
  cbeAccountName: "Utopia Event Management PLC",
  telebirrNumber: "0911223344",
  telebirrAccountName: "Utopia Events",
  allowPayAtGate: true,
  currency: "ETB",
};
