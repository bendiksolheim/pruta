export type ContainerDetails = {
  id: string;
  name: string;
  running: boolean;
  networkMode: string;
  ports: Array<string>;
  image: string;
  state: string;
  log: string;
};
