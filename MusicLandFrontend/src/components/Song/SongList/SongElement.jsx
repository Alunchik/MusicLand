import PlayButton from "./PlayButton"

function SongElement(songData) {
    return (
        <div class="songElement">
            <PlayButton id={songData.audioId} />
            <div className="title">
            {
                 songData.title
            }
            </div>
        </div>
    )    
}

export default SongElement
