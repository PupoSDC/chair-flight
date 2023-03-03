import { Route, Routes, Link } from 'react-router-dom';
import { HelloWorld } from '@chair-flight/chair-flight-components';
import { Button } from '@mui/joy';

export function App() {
  return (
    <>
      <HelloWorld />
      <Routes>
        <Route path="/" element={<Button>Click me!</Button>} />
        <Route
          path="/page-2"
          element={
            <div>
              <Button>Click me!</Button>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </>
  );
}
