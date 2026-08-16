import AuthLayout from "./AuthLayout";
import RegisterForm from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start tracking goals, trips and savings.">
      <RegisterForm />
    </AuthLayout>
  );
}
