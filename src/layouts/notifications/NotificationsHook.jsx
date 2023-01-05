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
import NotificationApi from "../../api/notification";
import SoftBadge from "../../components/SoftBadge";
import SoftBox from "../../components/SoftBox";
import SoftTypography from "../../components/SoftTypography";

const initForm = {
  title: "",
  message: "",
};

const useNotifications = () => {
  const columns = useMemo(
    () => [
      { name: "code", align: "center" },
      { name: "title", align: "left" },
      {
        name: "message",
        align: "left",
      },
      { name: "receiver", align: "left" },
      { name: "status", align: "center" },
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
  const [notificationEdit, setNotificationEdit] = useState(null);

  const resetFilter = useCallback(async () => {
    setFilter({ search: "", page: 1 });
    setSearchParams({});
    setGetData(true);
  }, [setSearchParams]);

  const handleDelete = useCallback(
    (item) => {
      confirm({ description: "This action cannot be undone" }).then(async () => {
        await toast.promise(NotificationApi.Delete(item.id), {
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
      setNotificationEdit(item);
      setOpen(true);
      setFormData(_pick(item, _keys(formData)));
    },
    [formData],
  );

  const handleActive = useCallback(
    async (item) => {
      const api =
        item.status === "active"
          ? NotificationApi.UpdateInActiveStatus
          : NotificationApi.UpdateActiveStatus;

      await toast.promise(api(item.id), {
        loading: "Updating...",
        success: () => {
          setRows((prevState) =>
            prevState.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)),
          );
          resetFilter();
          return "Update success";
        },
        error: (error) => {
          if (Array.isArray(error?.response?.data?.message))
            return error?.response?.data?.message[0];
          else return error?.response?.data?.message;
        },
      });
    },
    [resetFilter],
  );

  const convertToRow = useCallback(
    (item) => {
      const _content =
        item.message?.length > 100 ? item.message?.slice(0, 100) + "..." : item.message;
      const _title = item.title?.length > 30 ? item.title?.slice(0, 30) + "..." : item.title;

      return {
        ...item,
        title: (
          <SoftBox>
            <SoftTypography variant="caption" color="secondary">
              {_title}
            </SoftTypography>
          </SoftBox>
        ),
        message: (
          <SoftBox>
            <SoftTypography
              variant="caption"
              color="secondary"
              dangerouslySetInnerHTML={{ __html: _content }}
            ></SoftTypography>
          </SoftBox>
        ),
        status: item?.status && (
          <SoftBadge
            variant="gradient"
            badgeContent={item?.status}
            color={item?.status === "active" ? "success" : "error"}
            size="xs"
            container
          />
        ),
        action: (
          <ActionCell
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            menuItems={[
              { label: item?.status === "active" ? "Inactive" : "Active", onAction: handleActive },
            ]}
          />
        ),
      };
    },
    [handleActive, handleDelete, handleEdit],
  );

  const getNotifications = useCallback(async () => {
    try {
      if (cancelTokenSearch.current) {
        cancelTokenSearch.current.cancel("Operation canceled due to new request");
      }

      cancelTokenSearch.current = axios.CancelToken.source();

      const { data: res } = await NotificationApi.GetAll(filter, cancelTokenSearch.current.token);

      const data = res.data.notifications.map((item) => convertToRow(item));

      setRows(data);
      setPagination(res.data.pagination);
    } catch (error) {
      if (Array.isArray(error?.response?.data?.message))
        toast.error(error?.response?.data?.message[0]);
      else if (error?.response?.data?.message) toast.error(error?.response?.data?.message);
    }
  }, [convertToRow, filter]);

  const handleCloseModal = () => {
    setTimeout(() => {
      setOpen(false);
      setModalType(null);
      setFormData(initForm);
    }, 0);
  };

  const handleCreate = () => {
    setModalType("create");
    setOpen(true);
  };

  const handleChangeForm = (e) => {
    let value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const api =
      modalType === "edit"
        ? NotificationApi.Update(notificationEdit.id, formData)
        : NotificationApi.Create(formData);

    await toast.promise(api, {
      loading: modalType === "edit" ? "Updating..." : "Creating...",
      success: ({ data: res }) => {
        const newItem = convertToRow(res.data);

        if (notificationEdit) {
          setRows((prevState) =>
            prevState.map((item) => (item.id === res.data.id ? newItem : item)),
          );
          setNotificationEdit(null);
        } else {
          setRows((prevState) => [newItem, ...prevState]);
        }
        resetFilter();
        setLoading(false);
        handleCloseModal();
        return modalType === "edit" ? "Update success" : "Create success";
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
        await getNotifications();
        setGetData(false);
      })();
    }
  }, [getData, getNotifications]);

  return {
    open,
    rows,
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

export default useNotifications;
