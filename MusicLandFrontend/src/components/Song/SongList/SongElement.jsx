import PlayButton from "./PlayButton"

function SongElement(songData) {
    return (
        <div class="songElement">
            <PlayButton url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"/>
            <div className="title">
            {
                 songData.title
            }
            </div>
        </div>
    )    
}

export default SongElement
