import logo from './logo.svg';
import './App.css';
import * as ReactDOM from "react-dom";
import { HashRouter as Router, Route, Routes, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Index_Page } from './pages/index_page';
import { Training_Page } from './pages/training_page';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Index_Page />,
  },
]);


function App() {
  return (
    <Routes>
    <Route path={"/"} element={<Index_Page />}></Route>
    <Route path={"/training"} element={<Training_Page />}></Route>
    </Routes>
   
  );
}

export default App;
