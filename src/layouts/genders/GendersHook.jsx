import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import SoftAvatar from "components/SoftAvatar";

// Images
import { useEffect, useState } from "react";
import GenderApi from "../../api/gender";
import ActionCell from "../../components/ActionCell";

const useGenders = () => {
  const Gender = ({ image, name, email }) => {
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
    { name: "code", align: "center" },
    { name: "name", align: "left" },
    { name: "number of user", align: "center" },
    { name: "describe", align: "left" },
    { name: "action", align: "center" },
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getGenders = async () => {
      const { data: res } = await GenderApi.GetAll();

      const data = res.data.map((item) => ({
        ...item,
        "number of user": item?.userGenders,
        action: <ActionCell />,
      }));

      setRows(data);
    };
    getGenders();
  }, []);

  return {
    rows,
    columns,
  };
};

export default useGenders;
