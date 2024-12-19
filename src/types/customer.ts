export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  customerId: string;
  accountName: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BankAccountInput {
  accountName: string;
  balance: number;
}

export interface CustomerUpdateInput extends Partial<CustomerInput> {}
export interface BankAccountUpdateInput extends Partial<Omit<BankAccountInput, 'customerId'>> {}