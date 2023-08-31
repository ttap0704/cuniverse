interface TypographyFormTitleProps {
  title: string;
}

function TypographyFormTitle(props: TypographyFormTitleProps) {
  const { title } = props;
  return <h1 className="typography-form-title">{title}</h1>;
}

export default TypographyFormTitle;
