import buttonStyles from "@/css/components/buttons.module.scss";

function Button(props: InterfaceButton) {
  const children = props.children;
  const className = props.className ?? "";

  return (
    <button
      {...props}
      className={`${buttonStyles["button-default"]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
