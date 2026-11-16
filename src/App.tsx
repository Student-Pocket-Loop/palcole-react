import PalcoleClientProvider from "./client/PalcoleClientProvider"
import { PalcoleRouterProvider } from "./routes/PalcoleRouterProvider"

function App() {

    return (
        <PalcoleClientProvider>
            <PalcoleRouterProvider />
        </PalcoleClientProvider>
    )
}

export default App
