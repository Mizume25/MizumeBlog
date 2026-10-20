import { Checkbox } from '@animate-ui/react/primitives/base-ui/checkbox';
import { CheckIcon } from 'lucide-react';

interface TermsProps {
    id: number,
    value: string,
    className: string,
    checked?: boolean,
    onCheckedChange: (id: number, checked: boolean) => void
}

export function Terms({ id, value, className, checked, onCheckedChange }: TermsProps) {
  return (
    <label className={className}>
      <Checkbox.Root
        checked={checked}
        onCheckedChange={(isChecked) => onCheckedChange(id, isChecked)}
      >
        <Checkbox.Indicator animation='pop'>
          <CheckIcon />

        </Checkbox.Indicator>
      </Checkbox.Root>
        {value}
    </label>
  );
}
