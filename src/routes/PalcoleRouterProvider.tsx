import { RouterProvider } from 'react-router-dom';
import { PalcoleRouter } from './PalcoleRouter';

export function PalcoleRouterProvider() {
    return <RouterProvider router={PalcoleRouter} />;
}
