import { Navigate, Route, Routes } from 'react-router-dom';
import TeamSetupScreen from './screens/TeamSetupScreen';
import GameSelectionScreen from './screens/GameSelectionScreen';
import GameScreen from './screens/GameScreen';

/**
 * Kein Dashboard mehr - die Spielauswahl ist die Startseite. Teams werden
 * nicht mehr dauerhaft verwaltet, sondern vor jedem Team-Spiel frisch
 * ausgelost (siehe GameScreen). "/setup" bleibt als eigene Route erreichbar,
 * um Spieler einzutragen bzw. zu bearbeiten (siehe Einstellungen in der
 * Spielauswahl).
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/games" replace />} />
      <Route path="/setup" element={<TeamSetupScreen />} />
      <Route path="/games" element={<GameSelectionScreen />} />
      <Route path="/games/:gameId" element={<GameScreen />} />
      <Route path="*" element={<Navigate to="/games" replace />} />
    </Routes>
  );
}
