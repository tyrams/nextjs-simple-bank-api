import {
  BankAccount,
  Customer,
  CustomerInput,
  CustomerUpdateInput,
} from "@/types/customer";
import { storage } from "../storage/fileStorage";
import { Errors } from "../errors";
import { customerSchema, customerUpdateSchema } from "../validation/schemas";

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const validation = customerSchema.safeParse(input);
  if (!validation.success) {
    throw Errors.ValidationError(validation.error);
  }

  const data = await storage.readData();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const customer: Customer = {
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  data.customers[id] = customer;
  await storage.writeData(data);
  return customer;
}

export async function updateCustomer(
  id: string,
  input: CustomerUpdateInput
): Promise<Customer> {
  const validation = customerUpdateSchema.safeParse(input);
  if (!validation.success) {
    throw Errors.ValidationError(validation.error);
  }

  const data = await storage.readData();
  const customer = data.customers[id];

  if (!customer) {
    throw Errors.CustomerNotFound(id);
  }

  const updatedCustomer: Customer = {
    ...customer,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  data.customers[id] = updatedCustomer;
  await storage.writeData(data);
  return updatedCustomer;
}

export async function deleteCustomer(id: string): Promise<void> {
  const data = await storage.readData();

  if (!data.customers[id]) {
    throw Errors.CustomerNotFound(id);
  }

  delete data.customers[id];

  // Also delete associated bank account
  const accountToDelete = Object.values(data.accounts).find(
    (account) => account.customerId === id
  );

  if (accountToDelete) {
    delete data.accounts[accountToDelete.id];
  }

  await storage.writeData(data);
}

export async function getCustomer(id: string): Promise<Customer> {
  const data = await storage.readData();
  const customer = data.customers[id];

  if (!customer) {
    throw Errors.CustomerNotFound(id);
  }

  return customer;
}

export interface CustomerWithBalance extends Customer {
  accounts: Array<BankAccount>;
}

export async function getAllCustomersWithBalances(): Promise<
  CustomerWithBalance[]
> {
  const data = await storage.readData();

  return Object.values(data.customers).map((customer) => ({
    ...customer,
    accounts: Object.values(data.accounts).filter(
      (account) => account.customerId === customer.id
    ),
  }));
}
