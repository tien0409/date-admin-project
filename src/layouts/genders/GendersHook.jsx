// Images
import { useCallback, useEffect, useState } from "react";
import GenderApi from "../../api/gender";
import ActionCell from "../../components/ActionCell";
import toast from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";

const useGenders = () => {
  const columns = [
    { name: "code", align: "center" },
    { name: "name", align: "left" },
    {
      name: "number of user",
      align: "center",
    },
    { name: "describe", align: "left" },
    { name: "action", align: "center" },
  ];

  const confirm = useConfirm();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });

  const handleDelete = (item) => {
    confirm({ description: "This action cannot be undone" }).then(() => {
      toast.promise(GenderApi.Delete(item.id), {
        loading: "Deleting...",
        success: (data) => {
          setRows((prevState) => prevState.filter((row) => row.id !== item.id));
          return "Delete success";
        },
        error: (error) => {
          return "Delete fail";
        },
      });
    });
  };

  const getGenders = useCallback(async () => {
    const { data: res } = await GenderApi.GetAll();

    const data = res.data.map((item) => ({
      ...item,
      "number of user": item?.userGenders,
      action: <ActionCell item={item} onDelete={handleDelete} />,
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
    setLoading(true);
    e.preventDefault();
    toast.promise(GenderApi.Create(formData), {
      loading: "Creating...",
      success: ({ data: res }) => {
        setRows((prevState) => [
          ...prevState,
          {
            ...res.data,
            "number of user": 0,
            action: <ActionCell item={res.data} onDelete={handleDelete} />,
          },
        ]);
        setLoading(false);
        setOpen(false);
        setFormData({ name: "", icon: "", description: "" });
        return "Create success";
      },
      error: (error) => {
        setLoading(false);
        if (Array.isArray(error?.response?.data?.message)) return error?.response?.data?.message[0];
        else return error?.response?.data?.message;
      },
    });
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
