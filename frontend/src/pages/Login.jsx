import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <--- Tambahkan Link di sini
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(form);

      console.log("Respon dari backend: ", response);

      localStorage.setItem("token", response.token);
      navigate("/", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login gagal. Periksa kembali data Anda."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-base-200 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-md">
        <div className="card-body">
          <h1 className="card-title justify-center text-2xl">Login</h1>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="form-control w-full">
              <span className="label-text">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="johndoe@example.com"
                required
              />
            </label>

            <label className="form-control w-full">
            </label>
              <span className="label-text">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Password"
                required
              />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          {/* === TAMBAHAN OPSI REGISTER DI SINI === */}
          <div className="text-center mt-4">
            <p className="text-sm">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;