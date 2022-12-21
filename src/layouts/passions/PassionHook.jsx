// Images
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActionCell from "../../components/ActionCell";
import toast from "react-hot-toast";
import { useConfirm } from "material-ui-confirm";
import _debounce from "lodash/debounce";
import _pick from "lodash/pick";
import _keys from "lodash/keys";
import { useSearchParams } from "react-router-dom";
import axios from "../../api";
import PassionApi from "../../api/passion";
import SoftBox from "../../components/SoftBox";
import SoftTypography from "../../components/SoftTypography";

const initForm = {
  name: "Passion",
  bgColor: "#F8F9FF",
  fgColor: "#525176",
  borderColor: "#EAEAEB",
  description: "",
};

const usePassionsHook = () => {
  const columns = useMemo(
    () => [
      { name: "code", align: "center" },
      { name: "name", align: "left" },
      {
        name: "number of user",
        align: "center",
      },
      { name: "background color", align: "center" },
      { name: "foreground color", align: "center" },
      { name: "border color", align: "center" },
      { name: "description", align: "left" },
      { name: "action", align: "center" },
    ],
    [],
  );

  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchDebounceRef = useRef("");
  const cancelTokenSearch = useRef();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [getData, setGetData] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page")) || 1,
  });
  const [pagination, setPagination] = useState({
    perPage: 12,
    currentPage: 1,
    totalPage: 1,
  });
  const [formData, setFormData] = useState(initForm);
  const [passionEdit, setPassionEdit] = useState(null);

  const resetFilter = useCallback(async () => {
    setFilter({ search: "", page: 1 });
    setSearchParams({});
    setGetData(true);
  }, [setSearchParams]);

  const handleDelete = useCallback(
    (item) => {
      confirm({ description: "This action cannot be undone" }).then(async () => {
        await toast.promise(PassionApi.Delete(item.id), {
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
    },
    [confirm, resetFilter],
  );

  const handleEdit = useCallback(
    (item) => {
      setModalType("edit");
      setPassionEdit(item);
      setOpen(true);
      setFormData(_pick(item, _keys(formData)));
    },
    [formData],
  );

  const convertToRow = useCallback(
    (item) => {
      return {
        ...item,
        "number of user": (
          <SoftBox>
            <SoftTypography variant="caption" color="secondary">
              {item?.userGenders}
            </SoftTypography>
          </SoftBox>
        ),
        "background color": (
          <SoftBox display={"flex"} alignItems={"center"} gap={1}>
            <SoftBox
              width={20}
              heigh={20}
              bgColor={item?.bgColor}
              boxShadow={"0 0 0 1px rgba(0,0,0,0.2)"}
            >
              &nbsp;
            </SoftBox>

            <SoftTypography style={{ width: "55px" }} variant="caption" color="secondary">
              {item?.bgColor}
            </SoftTypography>
          </SoftBox>
        ),
        "foreground color": (
          <SoftBox display={"flex"} alignItems={"center"} gap={1}>
            <SoftBox
              width={20}
              heigh={20}
              bgColor={item?.fgColor}
              boxShadow={"0 0 0 1px rgba(0,0,0,0.2)"}
            >
              &nbsp;
            </SoftBox>

            <SoftTypography style={{ width: "55px" }} variant="caption" color="secondary">
              {item?.fgColor}
            </SoftTypography>
          </SoftBox>
        ),
        "border color": (
          <SoftBox display={"flex"} alignItems={"center"} gap={1}>
            <SoftBox
              width={20}
              heigh={20}
              bgColor={item?.borderColor}
              boxShadow={"0 0 0 1px rgba(0,0,0,0.2)"}
            >
              &nbsp;
            </SoftBox>

            <SoftTypography style={{ width: "55px" }} variant="caption" color="secondary">
              {item?.borderColor}
            </SoftTypography>
          </SoftBox>
        ),
        action: <ActionCell item={item} onEdit={handleEdit} onDelete={handleDelete} />,
      };
    },
    [handleDelete, handleEdit],
  );

  const getPassions = useCallback(async () => {
    try {
      if (cancelTokenSearch.current) {
        cancelTokenSearch.current.cancel("Operation canceled due to new request");
      }

      cancelTokenSearch.current = axios.CancelToken.source();

      const { data: res } = await PassionApi.GetAll(filter, cancelTokenSearch.current.token);

      const data = res.data.passions.map((item) => convertToRow(item));

      setRows(data);
      setPagination(res.data.pagination);
    } catch (error) {
      if (Array.isArray(error?.response?.data?.message))
        toast.error(error?.response?.data?.message[0]);
      else toast.error(error?.response?.data?.message);
    }
  }, [convertToRow, filter]);

  const handleCloseModal = () => {
    setOpen(false);
    setModalType(null);
    setFormData(initForm);
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
        ? PassionApi.Update(passionEdit.id, formData)
        : PassionApi.Create(formData);

    await toast.promise(api, {
      loading: modalType === "edit" ? "Updating..." : "Creating...",
      success: ({ data: res }) => {
        const newItem = convertToRow(res.data);

        if (passionEdit) {
          setRows((prevState) =>
            prevState.map((item) => (item.id === res.data.id ? newItem : item)),
          );
          setPassionEdit(null);
        } else {
          setRows((prevState) => [newItem, ...prevState]);
        }
        resetFilter();
        setLoading(false);
        setFormData(initForm);
        handleCloseModal();
        return modalType === "edit" ? "Update success" : "Create success";
      },
      error: (error) => {
        console.log("error", error);
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
    setGetData(true);
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
      setGetData(true);
    }, 500);
    searchDebounceRef.current();
  };

  useEffect(() => {
    if (getData) {
      (async () => {
        await getPassions();
        setGetData(false);
      })();
    }
  }, [getData, getPassions]);

  return {
    open,
    rows,
    passionEdit,
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

export default usePassionsHook;
