import Input from "./Input";

// 정보 수정 / 추가에 사용되는 Input Component

interface InputWithLabelProps extends InputProps {
  labelText: string;
}

function InputWithLabel(props: InputWithLabelProps) {
  const id = props.id;
  const labelText = props.labelText;

  return (
    <div className="input-width-label">
      <label htmlFor={id}>{labelText}</label>
      <Input {...props} />
    </div>
  );
}

export default InputWithLabel;
