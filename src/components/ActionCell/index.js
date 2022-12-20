import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SoftTypography from "../SoftTypography";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import SoftButton from "../SoftButton";

const ActionCell = (props) => {
  const { item, onView, onEdit, onDelete } = props;

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
        <MenuItem onClick={() => onView(item)}>
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
        <MenuItem onClick={() => onEdit(item)}>
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
        <MenuItem onClick={() => onDelete(item)}>
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

ActionCell.propTypes = {
  item: PropTypes.object,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
