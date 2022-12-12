import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SoftTypography from "../SoftTypography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";

const ActionCell = (props) => {
  const { onView, onEdit, onDelete } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="action__cell-btn"
        aria-controls={open ? "action__cell-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreHorizIcon cursor="pointer" />
      </IconButton>
      <Menu
        id="action__cell-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "action__cell-btn",
        }}
      >
        <MenuItem onClick={onView}>
          <SoftTypography
            component="a"
            href="#"
            variant="caption"
            color="secondary"
            fontWeight="medium"
          >
            View
          </SoftTypography>
        </MenuItem>
        <MenuItem onClick={onEdit}>
          <SoftTypography
            component="a"
            href="#"
            variant="caption"
            color="secondary"
            fontWeight="medium"
          >
            Edit
          </SoftTypography>
        </MenuItem>
        <MenuItem onClick={onDelete}>
          <SoftTypography
            component="a"
            href="#"
            variant="caption"
            color="secondary"
            fontWeight="medium"
          >
            Delete
          </SoftTypography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ActionCell;
