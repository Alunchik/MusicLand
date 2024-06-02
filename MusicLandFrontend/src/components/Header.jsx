import '../style/header.css'
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
function Header() {
    function hasCookie(name) {
        return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
      }
    return (
        
        <header>
            <div>
            <img src={logo} className='HeaderLogo' alt=':-)'/>
            </div>
            <div className='Navigation'>
            <p>
            <Link class="headerNav" to={"/"}>Main</Link>
            </p>
            <p>
            <Link class="headerNav" to={"/addSong"}>Add Song</Link>
            </p>
            <p>
            <Link class="headerNav" to={"/me"}>Me</Link>
            </p>
            <p>
            {hasCookie('isAdmin') ? <Link class="headerNav" to={"/admin"}>Admin</Link> : <></>}
            </p>
            </div>
        </header>    
    );
}

export default Header;