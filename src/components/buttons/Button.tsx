function Button(props: InterfaceButton) {
  const children = props.children;
  return (
    <button {...props} className="button-default">
      {children}
    </button>
  );
}

export default Button;
