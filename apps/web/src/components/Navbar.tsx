import { Snap2CodeLogo } from './Snap2CodeLogo'
import './Navbar.css'

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Snap2CodeLogo />
        </div>
        <div className="navbar-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#docs" className="nav-link">Docs</a>
        </div>
      </div>
    </nav>
  )
}
