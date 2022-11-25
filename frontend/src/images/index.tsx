/* import Table from "react-bootstrap/Table"; */
import { DockerImage } from "./image";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import { Table } from "../components/table";
import useFetch from "../use-fetch";
import Page from "../components/page";
import Error from "../components/error";
import { SmallButton } from "../components/small-button";
import Delete from "../icons/delete";
import { mutate } from "swr";

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
  const deleteImage = (id: string) => () => {
    fetch(`/api/images/${id}`, { method: "DELETE" }).then(() => {
      mutate("/api/images");
    });
  };
  const rows = images.map((image) => [
    {
      value: (
        <SmallButton onClick={deleteImage(image.id)}>
          <Delete />
        </SmallButton>
      ),
    },
    { value: image.repo },
    { value: image.tags },
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
            headers={["", "Repo", "Tags", "Size"]}
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
