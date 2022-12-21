// Images
import { useCallback, useEffect, useRef, useState } from "react";
import GenderApi from "../../api/gender";
import ActionCell from "../../components/ActionCell";
import toast from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import _debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import axios from "../../api";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const searchDebounceRef = useRef("");
  const cancelTokenSearch = useRef("");

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    perPage: 12,
    currentPage: 1,
    totalPage: 1,
  });
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    icon: "",
    description: "",
  });
  const [genderEdit, setGenderEdit] = useState(null);

  const getGenders = useCallback(async (filterQuery = {}) => {
    if (cancelTokenSearch.current) {
      cancelTokenSearch.current.cancel("Operation canceled due to new request");
    }

    cancelTokenSearch.current = axios.CancelToken.source();

    const { data: res } = await GenderApi.GetAll(filterQuery, cancelTokenSearch.current.token);

    const data = res.data.genders.map((item) => ({
      ...item,
      "number of user": item?.userGenders,
      action: <ActionCell item={item} onEdit={handleEdit} onDelete={handleDelete} />,
    }));

    setRows(data);
    setPagination(res.data.pagination);
  }, []);

  const handleCloseModal = () => {
    setOpen(false);
    setModalType(null);
    setFormData({
      id: null,
      name: "",
      icon: "",
      description: "",
    });
  };

  const resetFilter = async () => {
    setFilter({ search: "", page: 1 });
    setSearchParams({});
    await getGenders();
  };

  const handleDelete = (item) => {
    confirm({ description: "This action cannot be undone" }).then(async () => {
      await toast.promise(GenderApi.Delete(item.id), {
        loading: "Deleting...",
        success: () => {
          setRows((prevState) => prevState.filter((row) => row.id !== item.id));
          resetFilter();
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

    await toast.promise(api, {
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
          setRows((prevState) => [newItem, ...prevState]);
        }
        resetFilter();
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

  const handleChangePage = async (e, value) => {
    const newFilter = { ...filter, page: value };
    setFilter(newFilter);
    searchParams.set("page", value);
    setSearchParams(searchParams);
    await getGenders(newFilter);
  };

  const handleChangeSearch = (e) => {
    const newFilter = { ...filter, search: e.target.value };
    setFilter(newFilter);

    if (searchDebounceRef.current) {
      searchDebounceRef.current.cancel();
    }

    searchDebounceRef.current = _debounce(async () => {
      e.target.value ? searchParams.set("search", e.target.value) : searchParams.delete("search");
      setSearchParams(searchParams);
      await getGenders(newFilter);
    }, 500);
    searchDebounceRef.current();
  };

  useEffect(() => {
    (async () => {
      await getGenders();
    })();
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
    filter,
    pagination,
    handleCloseModal,
    handleChangeForm,
    handleSubmit,
    handleCreate,
    handleChangeSearch,
    handleChangePage,
  };
};

export default useGenders;
