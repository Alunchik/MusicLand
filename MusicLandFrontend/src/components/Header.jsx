import logo from '../image/logo.svg'
import '../style/header.css'
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <div>
            <img src={logo} className='HeaderLogo' alt=':-)'/>
            </div>
            <div className='Navigation'>
            <p>
            <Link to={"/"}>Main</Link>
            </p>
            <p>
            <Link to={"/songs"}>Songs</Link>
            </p>
            <p>
            <Link to={"/details"}>Me</Link>
            </p>
            </div>
        </header>    
    );
}

export default Header;