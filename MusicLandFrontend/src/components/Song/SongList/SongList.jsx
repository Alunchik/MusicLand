import { useState } from "react";
import SongElement from "./SongElement";
import { useDispatch, useSelector } from "react-redux";
import { refreshAudioContext, getAudioContext } from "../../../redux/slices/songsSlice";
import { setPlaying, setCurrent } from "../../../redux/slices/songsSlice";

function RenderSongs(songs) {

    // const [playing, setPlaying] = useState(false)
    const dispatch = useDispatch()
    const current = useSelector(state => state.songs.currentSong);
    const playing = useSelector(state => state.songs.playing);
    

    function playAudio (audioData){

        var audioContext = getAudioContext();
        // Декодируем аудиоданные в AudioBuffer
        audioContext.decodeAudioData(audioData, function(buffer) {
          // Создаем AudioBufferSourceNode
          const source = audioContext.createBufferSource();
          
          // Прикрепляем к AudioBufferSourceNode созданный AudioBuffer
          source.buffer = buffer;
          
          // Подключаем AudioBufferSourceNode к выходу AudioContext
          source.connect(audioContext.destination);
          
          // Начинаем воспроизведение
          source.start(0);
        });
            console.log("PLAYING")
        };
      
      function startSocket (AudioID) {
        const socket = new WebSocket( process.env.REACT_APP_API_URL +  ':8089/audio')
        socket.binaryType = "arraybuffer"
           socket.onopen = (event) => {
               console.log("socket opened ");
               socket.send(AudioID);
             };
           socket.onmessage = function (event) {
               const audio = event.data;
               if (audio instanceof ArrayBuffer) {
                 playAudio(audio);
               }
               else{
                 console.log("not array buffer");
               }
             };
             console.log("sent");
       };

    const toggleSongState = (AudioID) => {
        console.log(AudioID.data)
        let started = current == AudioID;
        if (!started) {
          refreshAudioContext();
          dispatch(setCurrent({songID: AudioID}))
          dispatch(setPlaying({playing: true}))
          startSocket(AudioID)
        } else if (playing) {
          dispatch(setPlaying({playing: false}))
          getAudioContext().suspend();
        } else if (!playing) {
          dispatch(setPlaying({playing: true}))
          getAudioContext().resume()
        }
    }

    return (
        <ul class="songList">
        {
            songs.map( (songData) => {
                console.log(songData.AudioID)
                console.log(current)
                console.log(current===songData.AudioID && playing)
                let props = {songData: songData, toggleSongState: function() {
                    toggleSongState(songData.AudioID)
                },
                playing: current==songData.AudioID && playing
            };
                return(
                    <li>
                        {SongElement(props)}
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