import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import SoftAvatar from "components/SoftAvatar";

// Images
import { useCallback, useEffect, useState } from "react";
import GenderApi from "../../api/gender";
import ActionCell from "../../components/ActionCell";
import toast from "react-hot-toast";

const useGenders = () => {
  const columns = [
    { name: "code", align: "center" },
    { name: "name", align: "left" },
    { name: "number of user", align: "center" },
    { name: "describe", align: "left" },
    { name: "action", align: "center" },
  ];

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });

  const getGenders = useCallback(async () => {
    const { data: res } = await GenderApi.GetAll();

    const data = res.data.map((item) => ({
      ...item,
      "number of user": item?.userGenders,
      action: <ActionCell />,
    }));

    setRows(data);
  }, []);

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const { data: res } = await GenderApi.Create(formData);
      toast.success("Create success");
      setOpen(false);
      getGenders();
    } catch (error) {
      if (Array.isArray(error?.response?.data?.message))
        error?.response?.data?.message.forEach((message) => {
          toast.error(message);
        });
      else toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGenders();
  }, [getGenders]);

  return {
    open,
    rows,
    columns,
    setOpen,
    formData,
    loading,
    handleChangeForm,
    handleSubmit,
  };
};

export default useGenders;
