import '../style/header.css'
import { Link } from 'react-router-dom';
import logo from '../image/logo.png';
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
            <Link to={"/addSong"}>Add Song</Link>
            </p>
            <p>
            <Link to={"/me"}>Me</Link>
            </p>
            </div>
        </header>    
    );
}

export default Header;