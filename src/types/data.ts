export interface BrideAndGroom {
  name: string;
  relation: string;
  parents: Parent;
}

type Parent = { relation: string; isDeceased?: boolean; name: string }[];

export interface ILocationInfo {
  title: string;
  desc: string;
}

export interface IAccount {
  name: string;
  relation: string;
  bank: string;
  account: string;
  kakaopayAccount?: string;
  tossAccount?: string;
}

export interface IHostInfo {
  host: string;
  accountInfo: IAccount[];
}
