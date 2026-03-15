export interface ISessionDataPlain {
  session: {
    type: "practice" | "training";
    timestamp: string;
    host: string;
    cohosts?: string[];
    supervisor?: string;
  };
  trainees: {
    usernames: string[];
    ids: string[];
    level?: string[];
    zone: string[];
    trains: number[];
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
