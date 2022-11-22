import Page from "../components/page";
import useFetch from "../use-fetch";
import { Network } from "./Network";
import Error from "../components/error";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import { Table } from "../components/table";

export function Networks(): JSX.Element {
  return useFetch<Array<Network>>(
    "/api/networks",
    () => <Page>Loading ...</Page>,
    () => (
      <Page>
        <Error>Some error occured fetching networks</Error>
      </Page>
    ),
    (networks) => <NetworksSuccess networks={networks} />
  );
}

function NetworksSuccess(props: { networks: Array<Network> }): JSX.Element {
  const rows = props.networks.map((network) => [
    { value: network.id.substring(0, 12) },
    { value: network.name },
    { value: network.driver },
  ]);
  return (
    <>
      <Navbar></Navbar>
      <Card>
        <Card.Body>
          <Card.Title>Networks</Card.Title>
          <Table headers={["Id", "Name", "Driver"]} rows={rows} />
        </Card.Body>
      </Card>
    </>
  );
}
