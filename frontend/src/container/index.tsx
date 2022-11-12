import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import { ContainerDetails } from "./container-details";
import Ansi from "ansi-to-react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useFetch from "../use-fetch";
import Error from "../components/error";
import Page from "../components/page";
import Pause from "../icons/pause";

export function Container(): JSX.Element {
  const { id } = useParams();

  return useFetch<ContainerDetails>(
    `/api/containers/${id}`,
    () => (
      <Page>
        <div>Loading...</div>
      </Page>
    ),
    () => (
      <Page>
        <Error>Container {id} does not exist</Error>
      </Page>
    ),
    containerDetails
  );
}

function containerDetails(container: ContainerDetails): JSX.Element {
  return (
    <Page>
      <Card>
        <Card.Body>
          <Card.Title>
            <span className="align-middle">
              {removeFirstSlash(container.name)} ({container.state})
            </span>
            <Button>
              <Pause />
            </Button>
          </Card.Title>
          <Row style={{ marginBottom: "0.875rem" }}>
            <Col>
              <span className="fw-bold">Container ID</span>
              <br />
              <span>{container.id}</span>
            </Col>
            <Col>
              <span className="fw-bold">Image</span>
              <br />
              <span>{container.image}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "0.875rem" }}>
            <Col>
              <span className="fw-bold">Port mappings</span>
              <br />
              <span>{container.ports.join(", ")}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className="fw-bold">Log</span>
              <br />
              <pre>
                <Ansi>{container.log}</Ansi>
              </pre>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Page>
  );
}

function Button(props: React.PropsWithChildren): JSX.Element {
  return (
    <button type="button" className="btn btn-sm px-1 py-0">
      {props.children}
    </button>
  );
}

function removeFirstSlash(value: string): string {
  return value.replace(/^\//, "");
}
