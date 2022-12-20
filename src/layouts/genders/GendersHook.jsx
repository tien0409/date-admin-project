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
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    icon: "",
    description: "",
  });
  const [genderEdit, setGenderEdit] = useState(null);

  const handleCloseModal = () => {
    setOpen(false);
    setModalType(null);
  };

  const handleDelete = (item) => {
    confirm({ description: "This action cannot be undone" }).then(() => {
      toast.promise(GenderApi.Delete(item.id), {
        loading: "Deleting...",
        success: () => {
          setRows((prevState) => prevState.filter((row) => row.id !== item.id));
          return "Delete success";
        },
        error: (error) => {
          if (Array.isArray(error?.response?.data?.message))
            return error?.response?.data?.message[0];
          else return error?.response?.data?.message;
        },
      });
    });
  };

  const handleEdit = (item) => {
    setModalType("edit");
    setGenderEdit(item);
    setOpen(true);
    setFormData({ id: item.id, name: item.name, description: item.description, icon: item.icon });
  };

  const handleCreate = () => {
    setModalType("create");
    setOpen(true);
  };

  const getGenders = useCallback(async () => {
    const { data: res } = await GenderApi.GetAll();

    const data = res.data.map((item) => ({
      ...item,
      "number of user": item?.userGenders,
      action: <ActionCell item={item} onEdit={handleEdit} onDelete={handleDelete} />,
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
    const api =
      modalType === "edit" ? GenderApi.Update(genderEdit.id, formData) : GenderApi.Create(formData);

    toast.promise(api, {
      loading: modalType === "edit" ? "Updating..." : "Creating...",
      success: ({ data: res }) => {
        const newItem = {
          ...res.data,
          "number of user": genderEdit ? res.data.userGenders : 0,
          action: <ActionCell item={res.data} onEdit={handleEdit} onDelete={handleDelete} />,
        };

        if (genderEdit) {
          setRows((prevState) =>
            prevState.map((item) => (item.id === res.data.id ? newItem : item)),
          );
          setGenderEdit(null);
        } else {
          setRows((prevState) => [...prevState, newItem]);
        }
        setLoading(false);
        setFormData({ id: null, name: "", icon: "", description: "" });
        handleCloseModal();
        return genderEdit ? "Update success" : "Create success";
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
    genderEdit,
    modalType,
    columns,
    setOpen,
    formData,
    loading,
    handleCloseModal,
    handleChangeForm,
    handleSubmit,
    handleCreate,
  };
};

export default useGenders;
