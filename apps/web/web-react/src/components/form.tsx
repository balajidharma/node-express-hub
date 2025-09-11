import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, FieldValues, FieldErrors } from 'react-hook-form';
import axios, { AxiosError } from 'axios';

// Type definitions for component props and handlers
interface FormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'children'> {
  action: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  headers?: Record<string, string>;
  children: React.ReactNode | ((props: FormState<T>) => React.ReactNode);
  onSuccess?: (response: any) => void;
  onError?: (error: AxiosError | any) => void;
  onFinish?: () => void;
}

// Type for the state exposed to the child render function
interface FormState<T extends FieldValues> {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  errors: FieldErrors<T>;
}

// Type for the methods exposed via ref
interface FormRef {
  submit: () => void;
  reset: (values?: FieldValues) => void;
}

const Form = forwardRef<FormRef, FormProps<any>>(
  (
    {
      action,
      method = 'post',
      headers = {},
      onSuccess = () => {},
      onError = () => {},
      onFinish = () => {},
      children,
      ...props
    },
    ref
  ) => {
    const formMethods = useForm();
    const {
      handleSubmit,
      reset,
      formState: { errors, isSubmitting, isSubmitSuccessful },
    } = formMethods;

    // Expose methods to the parent component via the ref
    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      reset: (values) => reset(values),
    }));

    const onSubmit = async (data: FieldValues) => {
      try {
        const response = await axios({
          url: action,
          method,
          data,
          headers,
        });

        onSuccess(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          onError(error);
        } else {
          onError(error);
        }
      } finally {
        onFinish();
      }
    };

    const formState: FormState<any> = {
      isSubmitting,
      isSubmitSuccessful,
      errors,
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} {...props}>
        {typeof children === 'function' ? children(formState) : children}
      </form>
    );
  }
);

Form.displayName = 'AxiosForm';

export default Form;
export type { FormProps, FormState };
