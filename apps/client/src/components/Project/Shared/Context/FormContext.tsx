import { createContext, useContext } from 'react';
import { useFormik } from 'formik';

const FormContext = createContext<ReturnType<typeof useFormik> | undefined>(undefined);

export const useFormContext = () => {
	const context = useContext(FormContext);
	return context;
};

export const FormProvider = FormContext.Provider;
