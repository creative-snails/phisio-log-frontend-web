import React, { useState } from "react";

import { useAuth } from "~/components/AuthContext";
import type { FormErrors } from "~/types";
import { renderErrors } from "~/utils/renderErrors";
import { type SignupData, Z_Signup } from "~/validation/authValidation";

type Props = {
  onSuccess?: () => void;
};

const SignupForm: React.FC<Props> = ({ onSuccess }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors<SignupData>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = Z_Signup.safeParse(formData);

    if (!result.success) {
      const flat = result.error.flatten();
      const fieldErrors: FormErrors<SignupData> = {};
      for (const key in flat.fieldErrors) {
        fieldErrors[key as keyof SignupData] = { _errors: flat.fieldErrors[key as keyof SignupData] };
      }
      if (flat.formErrors.length) fieldErrors._errors = flat.formErrors;
      setErrors(fieldErrors);

      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const data = result.data;
      await signup({ name: data.name, email: data.email, password: data.password });
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrors({ email: { _errors: [err.message || "Sign up failed"] } });
      } else {
        setErrors({ email: { _errors: ["Sign up failed"] } });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label>Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={loading} />
      {renderErrors(errors.name?._errors)}

      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} />
      {renderErrors(errors.email?._errors)}

      <label>Password</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={loading} />
      {renderErrors(errors.password?._errors)}

      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={loading}
      />
      {renderErrors(errors.confirmPassword?._errors)}

      {renderErrors(errors._errors)}

      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
