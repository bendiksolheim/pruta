/* import Table from "react-bootstrap/Table"; */
import { DockerImage } from "./image";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import { Table } from "../components/table";
import useFetch from "../use-fetch";
import Page from "../components/page";
import Error from "../components/error";

export function Images(): JSX.Element {
  return useFetch(
    "/api/images",
    () => <Page>Loading...</Page>,
    () => (
      <Page>
        <Error>Could not fetch images</Error>
      </Page>
    ),
    images
  );
}

function images(images: Array<DockerImage>): JSX.Element {
  const rows = images.map((image) => [
    { value: image.repo },
    { value: image.tags },
    { value: image.id },
    { value: humanReadableSize(image.size), className: "text-end" },
  ]);

  const footer = (
    <tfoot>
      <tr>
        <td colSpan={4} className="text-end">
          {humanReadableSize(images.reduce((prev, cur) => prev + cur.size, 0))}
        </td>
      </tr>
    </tfoot>
  );

  return (
    <>
      <Navbar></Navbar>
      <Card>
        <Card.Body>
          <Card.Title>Images</Card.Title>
          <Table
            headers={["Repo", "Tags", "ID", "Size"]}
            rows={rows}
            footer={footer}
          />
        </Card.Body>
      </Card>
    </>
  );
}

function humanReadableSize(size: number): string {
  const mb = size / 1_000_000;
  if (mb < 1000) {
    return `${+mb.toFixed(2)} MB`;
  }
  const gb = mb / 1000;
  if (gb < 1000) {
    return `${+gb.toFixed(2)} GB`;
  }
  const tb = gb / 1000;
  return `${+tb.toFixed(2)} TB`;
}
