import "../style/footer.css"
import github from '../assets/github.png';
import telegram from '../assets/telegram.png';

function Footer() {
    return (
        <footer>
                 <div class="name">
                    Music Land
                </div>
            <div>
                {/* <a href="">About us</a> */}
            </div>
            <div></div>
            <div>
            <div>
            <nav>
                
                <div>
                    <a href="https://t.me/Allklkk"  target="_blank">
                        <div>
                        <img src={telegram}  alt=''/>
                        </div>
                    </a>
                </div>
                <div>
                    <a href="https://github.com/Alunchik/MusicLand" target="_blank" >
                        <div>
                        <img src={github}  alt=''/>
                        </div>
                    </a>
                </div>
            </nav>
            <div>

            </div>
            </div>
            </div>
            <div>
            <div>
                <a href="tel:+79067530136">+7-906-753-01-36</a>
                </div>
                <div>
                <a href="mailto:alolachka@gmail.com">alolachka@gmail.com</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;