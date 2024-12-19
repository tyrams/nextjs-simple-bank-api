import { promises as fs } from 'fs';
import path from 'path';
import { Customer, BankAccount } from '@/types/customer';
import { Errors } from '../errors';

const DB_PATH = path.join(process.cwd(), 'data');
const CUSTOMERS_FILE = path.join(DB_PATH, 'customers.json');
const ACCOUNTS_FILE = path.join(DB_PATH, 'accounts.json');

type DataStore = {
  customers: Record<string, Customer>;
  accounts: Record<string, BankAccount>;
};

async function ensureDbExists() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
  } catch (error) {
    throw Errors.DatabaseError('Failed to create database directory');
  }
}

async function readData(): Promise<DataStore> {
  try {
    await ensureDbExists();
    
    const [customersRaw, accountsRaw] = await Promise.all([
      fs.readFile(CUSTOMERS_FILE, 'utf-8').catch(() => '{}'),
      fs.readFile(ACCOUNTS_FILE, 'utf-8').catch(() => '{}')
    ]);

    return {
      customers: JSON.parse(customersRaw),
      accounts: JSON.parse(accountsRaw)
    };
  } catch (error) {
    throw Errors.DatabaseError('Failed to read database');
  }
}

async function writeData(data: DataStore): Promise<void> {
  try {
    await ensureDbExists();
    
    await Promise.all([
      fs.writeFile(CUSTOMERS_FILE, JSON.stringify(data.customers, null, 2)),
      fs.writeFile(ACCOUNTS_FILE, JSON.stringify(data.accounts, null, 2))
    ]);
  } catch (error) {
    throw Errors.DatabaseError('Failed to write to database');
  }
}

export const storage = {
  readData,
  writeData
};