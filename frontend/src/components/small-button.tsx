export function SmallButton(
  props: React.PropsWithChildren & { onClick?: () => void }
): JSX.Element {
  return (
    <button
      type="button"
      className="btn btn-sm px-1 py-0"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
