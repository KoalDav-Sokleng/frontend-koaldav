import AuthLayout from "./AuthLayout";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to keep tracking your goals.">
      <LoginForm />
    </AuthLayout>
  );
}
