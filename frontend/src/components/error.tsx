import Card from "react-bootstrap/Card";

export default function (props: React.PropsWithChildren): JSX.Element {
  return (
    <Card bg="danger">
      <Card.Body>
        <Card.Title>{props.children}</Card.Title>
      </Card.Body>
    </Card>
  );
}
