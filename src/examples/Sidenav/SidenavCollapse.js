/**
 =========================================================
 * Soft UI Dashboard React - v4.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from "examples/Sidenav/styles/sidenavCollapse";

// Soft UI Dashboard React context
import { useSoftUIController } from "context";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import { NavLink, useLocation } from "react-router-dom";
import SoftTypography from "../../components/SoftTypography";
import Divider from "@mui/material/Divider";

function SidenavCollapse({ color, icon, name, children, active, noCollapse, collapse, ...rest }) {
  const [controller] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;

  const [openCollapse, setOpenCollapse] = useState(false);

  return (
    <>
      <ListItem component="li" onClick={() => setOpenCollapse(!openCollapse)} {...rest}>
        <SoftBox {...rest} sx={(theme) => collapseItem(theme, { active, transparentSidenav })}>
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, color })}
          >
            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
          />
          {!!collapse?.length && (openCollapse ? <ExpandLess /> : <ExpandMore />)}
        </SoftBox>
      </ListItem>
      {!!collapse?.length && (
        <Collapse in={openCollapse} unmountOnExit>
          <List component={"div"} disablePadding>
            {collapse.map(({ type, name, icon, title, noCollapse, collapse, key, route, href }) => {
              let returnValue;
              const collapseName = pathname.split("/").slice(1)[0];

              if (type === "collapse") {
                returnValue = href ? (
                  <Link
                    href={href}
                    key={key}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textDecoration: "none" }}
                  >
                    <SidenavCollapse
                      color={color}
                      name={name}
                      icon={icon}
                      active={key === collapseName}
                      noCollapse={noCollapse}
                    />
                  </Link>
                ) : (
                  <NavLink to={route} key={key}>
                    <SidenavCollapse
                      color={color}
                      key={key}
                      name={name}
                      icon={icon}
                      active={key === collapseName}
                      noCollapse={noCollapse}
                      collapse={collapse}
                      sx={{ paddingLeft: 3 }}
                    />
                  </NavLink>
                );
              } else if (type === "title") {
                returnValue = (
                  <SoftTypography
                    key={key}
                    display="block"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="uppercase"
                    opacity={0.6}
                    pl={3}
                    mt={2}
                    mb={1}
                    ml={1}
                  >
                    {title}
                  </SoftTypography>
                );
              } else if (type === "divider") {
                returnValue = <Divider key={key} />;
              }

              return returnValue;
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  color: "info",
  active: false,
  noCollapse: false,
  collapse: [],
  children: false,
  open: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
};

export default SidenavCollapse;
