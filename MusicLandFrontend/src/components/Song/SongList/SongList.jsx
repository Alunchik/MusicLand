import SongElement from "./SongElement";

function RenderSongs(songs) {
    return (
        <ul>
        {
            songs.map( (songData) => {
                return(
                    <li>
                        {SongElement(songData)}
                    </li>
                )
            }
            )
        }
        </ul>
    )    
}

function SongList(songs) {
    return(
        <main>
           {RenderSongs(songs)}
        </main>
    );
}
export default SongList;