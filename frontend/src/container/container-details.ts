export type ContainerDetails = {
  id: string;
  name: string;
  running: boolean;
  ports: Array<string>;
  image: string;
  state: string;
  log: string;
};
