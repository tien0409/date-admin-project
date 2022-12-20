// Images
import { useCallback, useEffect, useRef, useState } from "react";
import ActionCell from "../../components/ActionCell";
import toast from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import _debounce from "lodash/debounce";
import _pick from "lodash/pick";
import _keys from "lodash/keys";
import { useSearchParams } from "react-router-dom";
import axios from "../../api";
import RelationshipTypeApi from "../../api/relationship-type";
import SoftBadge from "../../components/SoftBadge";

const initForm = {
  id: null,
  name: "",
  isDefault: false,
  icon: "",
  description: "",
};

const useRelationshipTypes = () => {
  const columns = [
    { name: "code", align: "center" },
    { name: "name", align: "left" },
    {
      name: "number of user",
      align: "center",
    },
    { name: "description", align: "left" },
    { name: "status", align: "center" },
    { name: "action", align: "center" },
  ];

  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchDebounceRef = useRef("");
  const cancelTokenSearch = useRef();

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
  const [formData, setFormData] = useState(initForm);
  const [relationshipTypeEdit, setRelationshipTypeEdit] = useState(null);

  const convertToRow = useCallback((item) => {
    return {
      ...item,
      "number of user": item?.userGenders,
      status: item.isDefault && (
        <SoftBadge variant="gradient" badgeContent="Default" color="success" size="xs" container />
      ),
      action: <ActionCell item={item} onEdit={handleEdit} onDelete={handleDelete} />,
    };
  }, []);

  const getRelationshipTypes = useCallback(
    async (filterQuery = {}) => {
      if (cancelTokenSearch.current) {
        cancelTokenSearch.current.cancel("Operation canceled due to new request");
      }

      cancelTokenSearch.current = axios.CancelToken.source();

      const { data: res } = await RelationshipTypeApi.GetAll(
        filterQuery,
        cancelTokenSearch.current.token,
      );

      const data = res.data.relationshipTypes.map((item) => convertToRow(item));

      setRows(data);
      setPagination(res.data.pagination);
    },
    [convertToRow],
  );

  const handleCloseModal = () => {
    setOpen(false);
    setModalType(null);
    setFormData(initForm);
  };

  const resetFilter = async () => {
    setFilter({ search: "", page: 1 });
    setSearchParams({});
    await getRelationshipTypes();
  };

  const handleDelete = (item) => {
    confirm({ description: "This action cannot be undone" }).then(async () => {
      await toast.promise(RelationshipTypeApi.Delete(item.id), {
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
    setRelationshipTypeEdit(item);
    setOpen(true);
    setFormData(_pick(item, _keys(formData)));
  };

  const handleCreate = () => {
    setModalType("create");
    setOpen(true);
  };

  const handleChangeForm = (e) => {
    if (e.target.name === "isDefault") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const api =
      modalType === "edit"
        ? RelationshipTypeApi.Update(relationshipTypeEdit.id, formData)
        : RelationshipTypeApi.Create(formData);

    await toast.promise(api, {
      loading: modalType === "edit" ? "Updating..." : "Creating...",
      success: ({ data: res }) => {
        const newItem = convertToRow(res.data);

        if (relationshipTypeEdit) {
          setRows((prevState) =>
            prevState.map((item) => (item.id === res.data.id ? newItem : item)),
          );
          setRelationshipTypeEdit(null);
        } else {
          setRows((prevState) => [...prevState, newItem]);
        }
        resetFilter();
        setLoading(false);
        setFormData(initForm);
        handleCloseModal();
        return relationshipTypeEdit ? "Update success" : "Create success";
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
    await getRelationshipTypes(newFilter);
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
      await getRelationshipTypes(newFilter);
    }, 500);
    searchDebounceRef.current();
  };

  useEffect(() => {
    (async () => {
      await getRelationshipTypes();
    })();
  }, [getRelationshipTypes]);

  return {
    open,
    rows,
    genderEdit: relationshipTypeEdit,
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

export default useRelationshipTypes;
