function Button(props: InterfaceButton) {
  const children = props.children;

  return (
    <button {...props} className={`button-default ${props.className}`}>
      {children}
    </button>
  );
}

export default Button;
