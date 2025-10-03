import React, { useState } from "react";

import { useAuth } from "~/components/AuthContext";
import type { FormErrors } from "~/types";
import { renderErrors } from "~/utils/renderErrors";
import { type LoginData, Z_Login } from "~/validation/authValidation";

type Props = {
  onSuccess?: () => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors<LoginData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = Z_Login.safeParse(formData);

    if (!result.success) {
      const flat = result.error.flatten();
      const fieldErrors: FormErrors<LoginData> = {};
      for (const key in flat.fieldErrors) {
        fieldErrors[key as keyof LoginData] = { _errors: flat.fieldErrors[key as keyof LoginData] };
      }
      if (flat.formErrors.length) fieldErrors._errors = flat.formErrors;
      setErrors(fieldErrors);

      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await login(result.data);
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ _errors: [err.message] });
      } else {
        setErrors({ _errors: ["Login failed"] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} />
      {renderErrors(errors.email?._errors)}

      <label>Password</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={loading} />
      {renderErrors(errors.password?._errors)}

      {renderErrors(errors._errors)}

      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
