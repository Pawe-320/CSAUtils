export interface ISessionDataPlain {
  session: {
    timestamp: string;
    host: string;
    cohosts?: string[];
    supervisor?: string;
  };
  trainees: {
    usernames: string[];
    ids: string[];
    priority: string[];
    zone: string[];
    trains: string[];
    lf: boolean[];
  };
  drivers?: {
    usernames: string[];
    ids: string[];
  };
}

export default interface ISessionData {
  [key: string]: ISessionDataPlain;
}
