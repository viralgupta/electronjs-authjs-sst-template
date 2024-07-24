import db from '@db/db';
import { orderItem } from "@type/api/order";
import { z } from "zod";

export const calculatePaymentStatus = (totalValue: number, amountPaid: number) => {
  if(amountPaid >= totalValue){
    return "Paid";
  } else if(amountPaid === 0){
    return "UnPaid";
  } else {
    return "Partial";
  }
}