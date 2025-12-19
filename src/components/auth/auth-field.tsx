import { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLanguageContext } from '@/contexts/language-context'

interface AuthFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  placeholder: string
  type?: string
}

export function AuthField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: AuthFieldProps<TFieldValues, TName>) {
  const { t } = useLanguageContext()

  // Map English labels to translated labels
  const getLabel = () => {
    if (label === 'Email' || label === 'البريد الإلكتروني') {
      return t.auth.email
    }
    if (label === 'Password' || label === 'كلمة المرور') {
      return t.auth.password
    }
    if (label === 'Name' || label === 'الاسم') {
      return t.auth.name || 'الاسم'
    }
    return label
  }

  // Map English placeholders to translated placeholders
  const getPlaceholder = () => {
    if (placeholder.includes('@') || placeholder === 'john@doe.com') {
      return 'example@email.com'
    }
    if (
      placeholder === 'Enter your password' ||
      placeholder.toLowerCase().includes('password')
    ) {
      return t.auth.enterPassword || 'أدخل كلمة المرور'
    }
    if (
      placeholder === 'Enter your name' ||
      placeholder.toLowerCase().includes('name')
    ) {
      return t.auth.enterName || 'أدخل اسمك'
    }
    return placeholder
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm md:text-base">{getLabel()}</FormLabel>
          <FormControl>
            <Input
              className="text-sm md:text-base h-8 md:h-9"
              type={type}
              placeholder={getPlaceholder()}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-xs md:text-sm" />
        </FormItem>
      )}
    />
  )
}
