import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DetailPage } from "./pages/DetailPage";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:type/:id" element={<DetailPage />} />
      </Route>
    </Routes>
  );
}
