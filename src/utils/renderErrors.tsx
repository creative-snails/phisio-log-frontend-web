import "./renderErrors.css";

export const renderErrors = (fieldErrors?: string[] | { _errors?: string[] }) => {
  if (!fieldErrors) return null;

  const errors = Array.isArray(fieldErrors) ? fieldErrors : (fieldErrors._errors ?? []);

  return errors.map((err: string, i: number) => (
    <p key={i} className="error-message">
      {err}
    </p>
  ));
};
