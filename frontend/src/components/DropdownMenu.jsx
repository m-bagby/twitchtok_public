import {useState, useEffect, useRef} from "react";

const DropdownMenu = ({, }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  //Toggle open on menu button click
  const handleDropdownClick = (event) => {
    event.stopPropagation();

    setOpen(!open);
  };

  //close dropdown if there's a click outside it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  //manage event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleEdit = (event) => {
    event.stopPropagation();

    setOpen(false);
    editComponent();
  };

  const handleDelete = (event) => {
    event.stopPropagation();

    setOpen(false);
    deleteComponent();
  };

  return (
    <div className={"dropdownMenu"} ref={dropdownRef}>
      <button className={"svgButton"} onClick={handleDropdownClick}>
        <span className={"material-icons linkLike interactive"}>more_vert</span>
      </button>
      {
        open &&
        <div className={"dropdownItems"}>

          <button className={"dropdownItem interactive hoverShine svgButton"} onClick={handleEdit}>
            <span className={"material-icons linkLike interactive"}>edit</span>
          </button>

          <button className={"dropdownItem interactive hoverShine svgButton"} onClick={handleDelete}>
            <span className={"material-icons linkLike interactive"}>delete</span>
          </button>
        </div>
      }
    </div>
  );
};

export default DropdownMenu;