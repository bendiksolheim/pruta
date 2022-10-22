import React from "react";
import { Table } from "../components/table";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import FormCheck from "react-bootstrap/FormCheck";
import { useEffect, useState } from "react";
import { DockerContainer } from "./container";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const stateValues = ["running", "exited", "all"] as const;

type ContainerState = typeof stateValues[number];

export function Containers(): JSX.Element {
  const [containers, setContainers] = useState<Array<DockerContainer>>();
  const [selected, setSelected] = useState<ContainerState>("running");

  useEffect(() => {
    fetch(`/api/containers?filter=${selected}`)
      .then((res) => res.json())
      .then((containers) => setContainers(containers));
  }, [selected]);

  if (!containers) {
    return <div>Loading...</div>;
  }

  const rows = containers.map((container) => [
    {
      value: (
        <Link to={`/container/${container.id}`}>
          {removeFirstSlash(container.name)}
        </Link>
      ),
    },
    { value: container.image },
    { value: container.state, className: statusColor(container.state) },
    { value: container.status },
    { value: container.id.substring(0, 12) },
  ]);

  return (
    <>
      <Navbar></Navbar>
      <Card>
        <Card.Body>
          <Card.Title>Containers</Card.Title>
          <ButtonGroup>
            {stateValues.map((statusValue) => (
              <React.Fragment key={statusValue}>
                <FormCheck.Input
                  type="radio"
                  className="btn-check"
                  checked={statusValue == selected}
                  onChange={() => {
                    console.log("hmm");
                    setSelected(statusValue);
                  }}
                />
                <FormCheck.Label
                  className="btn btn-outline-primary"
                  onClick={() => setSelected(statusValue)}
                >
                  {capitalize(statusValue)}
                </FormCheck.Label>
              </React.Fragment>
            ))}
          </ButtonGroup>
          <Table
            headers={["Name", "Image", "State", "Status", "ID"]}
            rows={rows}
          />
        </Card.Body>
      </Card>
    </>
  );
}

function removeFirstSlash(value: string): string {
  return value.replace(/^\//, "");
}

function statusColor(text: string): string {
  switch (text) {
    case "running":
      return "text-success";
    case "exited":
      return "text-danger";
    default:
      return "";
  }
}

function capitalize(value: string): string {
  return value[0].toUpperCase() + value.substring(1);
}
