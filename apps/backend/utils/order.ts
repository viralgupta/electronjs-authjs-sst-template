import { Config } from 'sst/node/config';

export const calculatePaymentStatus = (totalValue: number, amountPaid: number) => {
  if(amountPaid >= totalValue){
    return "Paid";
  } else if(amountPaid === 0){
    return "UnPaid";
  } else {
    return "Partial";
  }
}

export const calculatePriority = (totalAmountPaid: number) => {
  if(totalAmountPaid > parseFloat(Config.HIGH_PRIORITY_CUSTOMER)){
    return "High";
  } else if (totalAmountPaid > parseFloat(Config.MID_PRIORITY_CUSTOMER)){
    return "Mid";
  } else {
    return "Low";
  }
}