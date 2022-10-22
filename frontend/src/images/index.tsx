/* import Table from "react-bootstrap/Table"; */
import { useEffect, useState } from "react";
import { DockerImage } from "./image";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";
import { Table } from "../components/table";

export function Images(): JSX.Element {
  const [images, setImages] = useState<Array<DockerImage>>();

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((images) => setImages(images));
  }, []);

  if (!images) {
    return <div>Loading...</div>;
  }

  const rows = images.map((image) => [
    { value: image.id },
    { value: image.repo },
    { value: humanReadableSize(image.size), className: "text-end" },
  ]);

  const footer = (
    <tfoot>
      <tr>
        <td colSpan={3} className="text-end">
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
          <Table headers={["ID", "Repo", "Size"]} rows={rows} footer={footer} />
        </Card.Body>
      </Card>
    </>
  );
}
/*
          <Table hover bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Repo</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr>
                  <td>{image.id}</td>
                  <td>{image.repo}</td>
                  <td className="text-end">{humanReadableSize(image.size)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <td colSpan={3} className="text-end">
                {humanReadableSize(
                  images.reduce((prev, cur) => prev + cur.size, 0)
                )}
              </td>
            </tfoot>
          </Table>
 */

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
