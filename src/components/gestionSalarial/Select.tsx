import { Select,  } from "@chakra-ui/react";
import {GrSelect } from "react-icons/gr";

interface SelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function Seleccionar({ value, onChange }: SelectProps) {
  return (
    <Select icon={<GrSelect />} placeholder="" size="lg" onChange={onChange} value={value}>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
      <option value="I">I</option>
    </Select>
  );
}

export default Seleccionar;
