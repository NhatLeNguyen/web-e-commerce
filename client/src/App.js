import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route ket={index} path={route.path} element={<Page />} />;
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
