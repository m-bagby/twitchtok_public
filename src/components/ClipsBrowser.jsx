import React, {useState, useEffect, useMemo, useRef, useContext} from "react";
import {useLocation} from 'react-router-dom';

import AccessTokenContext from "../AccessTokenContext";
import {getClips, getHomepageClips} from "../api/twitchUtils";
import Clip from "./Clip.jsx";


const ClipsBrowser = () => {
  const {accessToken} = useContext(AccessTokenContext);
  //Check if page url has /category or /streamer.. use their id to make streamer or category query if so
  //Otherwise, do random query one
  const [queryCursor, setQueryCursor] = useState("");

  const [clips, setClips] = useState([]);

  const [moreClips, setMoreClips] = useState(true); //If there are more new clips left that can be fetched with the query
  const [loadingClips, setLoadingClips] = useState(false); //Used to prevent loading clips multiple times at once
  const queuedPlay = useRef(null); //use to delay playing clips to prevent them from playing unless they are rested on

  const initialPageLoaded = useRef(false); //Track if the first page load has occurred
  const firstClips = useRef(false); //Track if the first clips have been added yet

  //Determine whether browsing random, a streamer, or a category
  const {search} = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  //Twitch query type and id
  const type = query.get("type");
  const id = query.get("id");


  //Get more clips
  const loadMoreClips = async () => {
    let response;
    if (type === "category" || type === "streamer") {
      response = await getClips(accessToken, type, id, queryCursor);
    }
    //Otherwise, load main page clips
    else {
      response = await getHomepageClips(accessToken);
      //no pagination for homepage, but a filler is used because cursor null suggests end of clips
      response.pagination = {cursor: "filler"}
    }

    //Initialize empty video URLs for each new clip
    const newClips = response.data;

    const newClipsState = clips.concat(newClips);
    const newCursor = response.pagination.cursor;

    //If a new pagination cursor is not given, there are not any more clips
    if (!newCursor) {
      setMoreClips(false);
    }

    //Update the clips, video urls, and cursor
    setQueryCursor(newCursor);
    setClips(newClipsState);
  }


  //Initial load clips
  useEffect(() => {
    if (initialPageLoaded.current) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        // unsubscribe event
        window.removeEventListener("scroll", handleScroll);
      };
    }

    setLoadingClips(true);
    loadMoreClips().then(() => {
      firstClips.current = true;
      setLoadingClips(false);
    });
    initialPageLoaded.current = true;
  }, [loadMoreClips]);


  useEffect(() => {
    if (firstClips.current) {
      playPauseClip();
      firstClips.current = false;
    }

  }, [clips]);


  //Get video file url from the thumbnail url included in twitch clip obj
  const getVideoUrl = (thumbnailUrl) => {
    let videoUrl = thumbnailUrl.substring(0, thumbnailUrl.indexOf("-preview"));
    videoUrl += ".mp4";
    return videoUrl;
  }


  //scrolling plays or pauses clips and load more clips
  const handleScroll = () => {
    //queue to play/pause clips
    if (queuedPlay.current !== null) {
      clearTimeout(queuedPlay.current);
    }

    queuedPlay.current = (setTimeout(playPauseClip, 500));

    //Load more clips
    if (!loadingClips) {
      const scrollPos = window.scrollY;
      if (scrollPos > (document.getElementsByTagName("main")[0].offsetHeight - (window.innerHeight * 3))) {
        setLoadingClips(true);
        loadMoreClips().then(() => {
          setLoadingClips(false);
        });
      }
    }
  }


  const playPauseClip = () => {
    //Find the video element at the center of the screen
    const headerHeight = (document.getElementsByTagName("header")[0]).offsetHeight;
    const scrollPos = window.scrollY;
    const clipElements = document.getElementsByClassName("clip");
    const clipElementSize = clipElements[0].offsetHeight;
    const centeredClipIndex = Math.floor(((scrollPos - headerHeight) + (window.innerHeight / 2)) / clipElementSize);

    const clipPlayers = document.getElementsByClassName("clipVideo");

    //pause any playing videos that are not the centered video
    for (let i = 0; i < clipPlayers.length; i++) {
      if (i !== centeredClipIndex) {
        if (!clipPlayers[i].paused) {
          try {
            clipPlayers[i].pause();
          } catch (e) {
          }
        }
      }
    }

    //Hide all video players except for the centered clip
    const playingClips = document.getElementsByClassName("playingVideo");
    for (let element of playingClips) {
      element.className = "clip container";
    }
    clipElements[centeredClipIndex].className += " playingVideo";


    //Determine if centered video player is playing a clip
    let centeredPlaying;
    try {
      centeredPlaying = !clipPlayers[centeredClipIndex].paused;
    } catch (err) {
      centeredPlaying = false;
    }

    //If the centered video is not playing, play it
    if (!centeredPlaying) {
      const videoURL = getVideoUrl(clips[centeredClipIndex].thumbnail_url);
      //If it is the first play, add the url
      if (clipPlayers[centeredClipIndex].src !== videoURL) {
        clipPlayers[centeredClipIndex].src = videoURL;
      }
      //Otherwise, call play
      else {
        clipPlayers[centeredClipIndex].play();
      }

      //Sync the player's audio properties
      clipPlayers[centeredClipIndex].muted = JSON.parse(sessionStorage.getItem("muted"));
      clipPlayers[centeredClipIndex].volume = JSON.parse(sessionStorage.getItem("volume"));
    }

    queuedPlay.current = null;
  }


  return (
    <div className={"clipsList"}>
      {/*display no clips message*/}
      {
        (!moreClips && clips.length === 0) &&
        <div>
          <br/>
          <h3>Sorry, this {type} doesn't have any clips available.</h3>
        </div>
      }


      {/*display all clips*/}
      {clips.map((clip, index) => (
        <Clip key={clip.id + index} clip={clip}/>
      ))}

      <div className={"loadingContainer"}>
        {
          loadingClips &&
          <img className={"loadingIcon"} src={"./images/loading.svg"} alt={"loading symbol"}/>
        }
      </div>

      {/*display end of clips message*/}
      {
        !moreClips &&
        <div>
          <p>All out of clips! <a href={"/"}><i>Return to homepage?</i></a></p>
        </div>
      }
    </div>
  )
}

export default ClipsBrowser;