import { Route, Routes } from 'react-router-dom';
import { TestView } from './views/test-view';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TestView />} />
    </Routes>
  );
};
