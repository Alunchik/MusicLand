import { useState } from "react";
import SongElement from "./SongElement";
import { useDispatch, useSelector } from "react-redux";
import { refreshAudioContext, getAudioContext, setPosition } from "../../../redux/slices/songsSlice";
import { setPlaying, setCurrent } from "../../../redux/slices/songsSlice";
import { useEffect } from "react";
function RenderSongs(songs) {

    // const [playing, setPlaying] = useState(false)
    const dispatch = useDispatch()
    const current = useSelector(state => state.songs.currentSong);
    const playing = useSelector(state => state.songs.playing);
    const position = useSelector(state => state.songs.position);

    const [duration, setDuration] = useState(40.0);

    useEffect(() => {
      // таймер пересоздаётся каждый раз когда обновляется position
      const id = setInterval(() => dispatch(setPosition({position: playing ? position+1 : position})), 1000);
      console.log(position)
      return () => {
        clearInterval(id);
      };
    }, [position]);

    function playAudio (audioData){
        var audioContext = getAudioContext();
        // Декодируем аудиоданные в AudioBuffer
        audioContext.decodeAudioData(audioData, function(buffer) {
          // Создаем AudioBufferSourceNode
          const source = audioContext.createBufferSource();
          
          // Прикрепляем к AudioBufferSourceNode созданный AudioBuffer
          source.buffer = buffer;
          setDuration(buffer.duration)
          if(position==0){
            dispatch(setPosition({position: position + 1}))
          } else {
            dispatch(setPosition({position: 0}))
          }
          source.addEventListener("ended", () => {
            dispatch(setCurrent({songID: ""}))
            dispatch(setPlaying({playing: false}))
            dispatch(setPosition({position: 0}))
            console.log("stop")
        });
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

   function TimeScale(AudioID){
      let timeScaleWidth = 130;
      return(
         current == AudioID ?
        <div class="timeScale" style={{width: timeScaleWidth + "px"}}>
          <div class="timeScalePosition" style={{width: position/duration*timeScaleWidth + "px"}}></div>
        </div> : <></>
      )
    }


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
          {position ? <></> : <></>}
        {
            songs.map( (songData) => {
                let props = {songData: songData, toggleSongState: function() {
                    toggleSongState(songData.AudioID)
                },
                id: songData.id,
                playing: current==songData.AudioID && playing,
                TimeScale: TimeScale
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