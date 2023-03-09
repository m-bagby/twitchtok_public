import React from "react";

const Clip = ({clip}) => {
  //Create formatted date
  let date = new Date(Date.parse(clip.created_at));
  const options = {year: "numeric", month: "long", day: "numeric"};
  date = (date.toLocaleString("en-US", options));

  //Format the view count
  const views = clip.view_count.toLocaleString("en-US");

  //Update muted or volume if it differs from global volume attributes
  const handleVolumeChange = (event) => {
    if (event.target.muted !== JSON.parse(sessionStorage.getItem("muted"))) {
      sessionStorage.setItem("muted", JSON.stringify(event.target.muted));
    }
    if (event.target.volume !== JSON.parse(sessionStorage.getItem("volume"))) {
      sessionStorage.setItem("volume", JSON.stringify(event.target.volume));
    }
  };

  return (
    <div className={"clip container"}>
      <div className={"clipHeader"}>
        <h2 title={clip.title}>{clip.title}</h2>

        <span className={"inlineHeaders"}>
          <h3><b><a title={"Browse Streamer Clips"}
            href={"view?type=streamer&id=" + clip.broadcaster_id}>{clip.broadcaster_name}</a></b></h3>
        <span>&nbsp;-&nbsp;</span>
        <h4><b><a title={"Browse Category Clips"} href={"view?type=category&id=" + clip.game_id}>{clip.gameName}</a></b></h4>
        </span>

        <h5>{views} views · {date}</h5>
      </div>

      <div className={"iframeContainer"}>
        {
          <div className={"thumbnailContainer"}>
            <img className={"clipThumbnail"} src={clip.thumbnail_url} alt={"clip thumbnail"}/>
          </div>
        }
        <video className={"clipVideo"} type={"video/mp4"} autoPlay={true}
          controls={true} loop={true} onVolumeChange={handleVolumeChange}/>
      </div>
    </div>
  );
};

export default Clip;