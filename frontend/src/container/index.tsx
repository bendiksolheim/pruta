import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from "react-router-dom";
import { ContainerDetails } from "./container-details";
import Ansi from "ansi-to-react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useFetch from "../use-fetch";
import Error from "../components/error";
import Page from "../components/page";
import Stop from "../icons/stop";
import Play from "../icons/play";
import { mutate } from "swr";
import { SmallButton } from "../components/small-button";
import Delete from "../icons/delete";

export function Container(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

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
    (details) => <Details container={details} navigate={navigate} />
  );
}

function Details(props: {
  container: ContainerDetails;
  navigate: ReturnType<typeof useNavigate>;
}): JSX.Element {
  const container = props.container;
  function stopContainer() {
    fetch(`/api/containers/${container.id}/stop`, { method: "POST" }).then(
      () => {
        mutate(`/api/containers/${container.id}`);
      }
    );
  }

  function startContainer() {
    fetch(`/api/containers/${container.id}/start`, { method: "POST" }).then(
      () => {
        mutate(`/api/containers/${container.id}`);
      }
    );
  }

  function deleteContainer() {
    fetch(`/api/containers/${container.id}`, { method: "DELETE" }).then(
      (res) => {
        if (res.ok) {
          props.navigate("/");
        }
      }
    );
  }

  return (
    <Page>
      <Card>
        <Card.Body>
          <Card.Title>
            <span className="align-middle">
              {removeFirstSlash(container.name)} ({container.state})
            </span>
            <SmallButton
              onClick={container.running ? stopContainer : startContainer}
            >
              {container.running ? <Stop /> : <Play />}
            </SmallButton>
            {!container.running ? (
              <SmallButton onClick={deleteContainer}>
                <Delete />
              </SmallButton>
            ) : null}
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
              <span className="fw-bold">Network mode</span>
              <br />
              <span>{container.networkMode}</span>
            </Col>
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

function removeFirstSlash(value: string): string {
  return value.replace(/^\//, "");
}
