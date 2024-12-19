import {
  BankAccount,
  BankAccountInput,
  BankAccountUpdateInput,
} from "@/types/customer";
import { storage } from "../storage/fileStorage";
import { createError, Errors } from "../errors";
import {
  bankAccountSchema,
  bankAccountUpdateSchema,
} from "../validation/schemas";

export async function createAccount(
  customerId: string,
  input: BankAccountInput
): Promise<BankAccount> {
  const validation = bankAccountSchema.safeParse(input);
  if (!validation.success) {
    throw Errors.ValidationError(validation.error);
  }

  const data = await storage.readData();

  if (!data.customers[customerId]) {
    throw Errors.CustomerNotFound(customerId);
  }

  const existingAccount = Object.values(data.accounts).find(
    (account) => account.customerId === customerId
  );

  if (existingAccount) {
    throw createError(
      `Customer ${customerId} already has an account`,
      400,
      "VALIDATION_ERROR"
    );
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const account: BankAccount = {
    id,
    customerId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  data.accounts[id] = account;
  await storage.writeData(data);
  return account;
}

export async function updateAccount(
  customerId: string,
  input: BankAccountUpdateInput
): Promise<BankAccount> {
  const validation = bankAccountUpdateSchema.safeParse(input);
  if (!validation.success) {
    throw Errors.ValidationError(validation.error);
  }

  const data = await storage.readData();
  const account = Object.values(data.accounts).find(
    (account) => account.customerId === customerId
  );

  if (!account) {
    throw Errors.AccountNotFound(customerId);
  }

  const updatedAccount: BankAccount = {
    ...account,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  data.accounts[account.id] = updatedAccount;
  await storage.writeData(data);
  return updatedAccount;
}
