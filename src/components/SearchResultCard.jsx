import React from "react";

const SearchResultCard = ({result, resultType}) => {
  const id = result.id;
  let name;
  let image;

  if (resultType === "streamer") {
    name = result.display_name;
    image = result.thumbnail_url;
  } else {
    name = result.name;
    image = result.box_art_url;
  }

  return (
    <div className={"resultCard " + resultType}>
      <a href={"view?type=" + resultType + "&id=" + id}>
        <img src={image} alt={name + " image"}/>
      </a>
      <a href={"view?type=" + resultType + "&id=" + id}>
        <h3>{name}</h3>
      </a>
    </div>
  )
}


export default SearchResultCard;