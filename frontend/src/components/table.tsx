type Cell = {
  value: JSX.Element | string;
  className?: string;
};

type TableProps = {
  headers: Array<string>;
  rows: Array<Array<Cell>>;
  footer?: JSX.Element;
};
export function Table(props: TableProps): JSX.Element {
  return (
    <table className="table table-centered table-nowrap rounded">
      <thead className="thead-light">
        <tr>
          {props.headers.map((header, i) => (
            <th
              key={header}
              className={headerClassName(i, props.headers.length)}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, i) => (
          <tr key={`row-${i}`}>
            {row.map((col, i) => (
              <td key={`col-${i}`} className={col.className}>
                {col.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {props.footer ? props.footer : null}
    </table>
  );
}

function headerClassName(i: number, count: number): string {
  return [
    "border-0",
    i === 0 ? "rounded-start" : null,
    i === count - 1 ? "rounded-end" : null,
  ]
    .filter((s) => s !== null)
    .join(" ");
}
