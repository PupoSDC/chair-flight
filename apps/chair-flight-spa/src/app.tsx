import { Navigate, Route, Routes } from 'react-router-dom';
import { TestView } from './views/test-view';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" />} />
      <Route path="/app" element={<TestView />} />
    </Routes>
  );
};
