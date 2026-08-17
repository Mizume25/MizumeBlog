// components/ui/form-field.tsx
import { Field, Input, Label, Select, Textarea, type InputProps, type SelectProps } from '@headlessui/react';
import { type LucideIcon } from 'lucide-react';
import InputError from './input-error';

/*** Propiedades Genericas */
type BaseFieldProps = {
    label: string;
    icon?: LucideIcon;
    error?: string;
};

type SelectOption = { value: string; label: string };

/** Constantes de Estilos */
const fieldStyles = 'rounded-md border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20';

/** Cast de Varaiables */
type FormFieldProps =
    | (BaseFieldProps & { type: 'input' } & InputProps)
    | (BaseFieldProps & { type: 'date' } & InputProps)
    | (BaseFieldProps & { type: 'select'; options: SelectOption[] } & Omit<SelectProps, 'children'>)
    | (BaseFieldProps & { type: 'textarea' } & React.ComponentProps<typeof Textarea>);

export default function FormField(props: FormFieldProps) {
    const { label, icon: Icon, error } = props;

    const renderControl = () => {
        switch (props.type) {
            case 'select': {
                const { type, label, icon, error, options, ...selectProps } = props;
                return (
                    <Select {...selectProps} className={`${fieldStyles} capitalize`}>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-white/30 text-black capitalize">
                                {opt.label}
                            </option>
                        ))}
                    </Select>
                );
            }
            case 'textarea': {
                const { type, label, icon, error, ...textareaProps } = props;
                return <Textarea {...textareaProps} className={fieldStyles} />;
            }
            case 'input':
            default: {
                const { type, label, icon, error, ...inputProps } = props;
                return <Input {...inputProps} className={fieldStyles} />;
            }

            case 'date': {
                const { type, label, icon, error, ...dateProps } = props;
                return <Input type="date" {...dateProps} className={fieldStyles} />;
            }
        }
    };

    return (
        <Field className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-white">
                {Icon && <Icon size={20} />}
                <span>{label}</span>
            </Label>
            {renderControl()}
            <InputError message={error} />
        </Field>
    );
}
