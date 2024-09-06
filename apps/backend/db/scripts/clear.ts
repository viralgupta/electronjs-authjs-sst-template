import {
  user,
  customer,
  address_area,
  address,
  architect,
  carpanter,
  driver,
  phone_number,
  item,
  order,
  order_item,
  estimate,
  estimate_item,
  resource,
} from "../schema";
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';

const seedClient = postgres("postgresql://myuser:mypassword@localhost:5432/ctc-cms-db");
const miscDb = drizzle(seedClient, { schema });


async function main() {
  let promiseArray: Promise<any>[] = [];

  
  await new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(order_item);
      res();
    } catch (error) {
      rej(error);
    }
  });

  await new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(order);
      res();
    } catch (error) {
      rej(error);
    }
  });

  const deleteUsers = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(user);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteUsers);

  const deleteCustomers = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(customer);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteCustomers);

  const deleteAddresses = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(address);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteAddresses);

  
  const deleteAddressAreas = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(address_area);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteAddressAreas);

  const deleteArchitects = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(architect);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteArchitects);

  const deleteCarpanters = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(carpanter);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteCarpanters);

  const deleteDrivers = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(driver);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteDrivers);

  const deletePhoneNumbers = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(phone_number);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deletePhoneNumbers);

  const deleteItems = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(item);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteItems);

  const deleteEstimates = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(estimate);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteEstimates);

  const deleteEstimateItems = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(estimate_item);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteEstimateItems);

  const deleteResources = new Promise<void>(async (res, rej) => {
    try {
      await miscDb.delete(resource);
      res();
    } catch (error) {
      rej(error);
    }
  });
  promiseArray.push(deleteResources);

  try {
    await Promise.all(promiseArray);
    console.log("All tables cleared successfully.");
    process.exit(0);
  } catch (error) {
    console.error("An error occurred during the delete operations:", error);
    process.exit(1);
  }
}

main();
