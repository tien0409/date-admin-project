import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import ActionCell from "../../components/ActionCell";

const useUsers = () => {
  const User = ({ image, name, email }) => {
    return (
      <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
        <SoftBox mr={2}>
          <SoftAvatar src={image} alt={name} size="sm" variant="rounded" />
        </SoftBox>
        <SoftBox display="flex" flexDirection="column">
          <SoftTypography variant="button" fontWeight="medium">
            {name}
          </SoftTypography>
          <SoftTypography variant="caption" color="secondary">
            {email}
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    );
  };

  const columns = [
    { name: "id", align: "center" },
    { name: "name", align: "left" },
    { name: "gender", align: "left" },
    { name: "looking for", align: "left" },
    { name: "birthday", align: "center" },
    { name: "status", align: "center" },
    { name: "action", align: "center" },
  ];

  const rows = [
    {
      id: "1",
      name: <User image={team2} name="John Michael" email="john@creative-tim.com" />,
      gender: <div>Male</div>,
      status: (
        <SoftBadge variant="gradient" badgeContent="online" color="success" size="xs" container />
      ),
      birthday: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          23/04/18
        </SoftTypography>
      ),
      looking_for: <div>Female</div>,
      action: <ActionCell />,
    },
  ];

  return {
    rows,
    columns,
  };
};

export default useUsers;
