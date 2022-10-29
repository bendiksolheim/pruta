import Navbar from "react-bootstrap/Navbar";

export default function (props: React.PropsWithChildren): JSX.Element {
  return (
    <>
      <Navbar></Navbar>
      {props.children}
    </>
  );
}
