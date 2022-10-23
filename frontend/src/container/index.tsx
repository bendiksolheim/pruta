import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import { useParams } from "react-router-dom";
import { ContainerDetails } from "./container-details";
import Ansi from "ansi-to-react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export function Container(): JSX.Element {
  const { id } = useParams();
  const [container, setContainer] = useState<ContainerDetails>();

  useEffect(() => {
    fetch(`/api/log/${id}`)
      .then((res) => res.json())
      .then((container) => setContainer(container));
  }, [id]);

  if (!container) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar></Navbar>
      <Card>
        <Card.Body>
          <Card.Title>
            {container.name} ({container.state})
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
    </>
  );
}