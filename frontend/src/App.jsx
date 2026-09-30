import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kategori from "./pages/Kategori";
import Aset from "./pages/Aset";
import CreateAset from "./pages/CreateAset";
import EditAset from "./pages/EditAset";
import DetailAset from "./pages/DetailAset";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kategori" element={<Kategori />} />
          <Route path="/aset" element={<Aset />} />
          <Route path="/aset/create" element={<CreateAset />} />
          <Route path="/aset/:id" element={<DetailAset />} />
          <Route path="/aset/:id/edit" element={<EditAset />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
