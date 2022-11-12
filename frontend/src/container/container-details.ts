export type ContainerDetails = {
  id: string;
  name: string;
  ports: Array<string>;
  image: string;
  state: string;
  log: string;
};
