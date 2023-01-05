import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import useNotifications from "./NotificationsHook";
import SoftTypography from "../../components/SoftTypography";
import SoftButton from "../../components/SoftButton";
import Icon from "@mui/material/Icon";
import { Dialog } from "@mui/material";
import SoftInput from "../../components/SoftInput";
import SoftPagination from "../../components/SoftPagination";
import { Editor } from "@tinymce/tinymce-react";

// Data

function Notifications() {
  const {
    rows,
    columns,
    formData,
    modalType,
    open,
    loading,
    filter,
    pagination,
    handleCloseModal,
    handleChangeForm,
    handleCreate,
    handleSubmit,
    handleChangeSearch,
    handleChangePage,
  } = useNotifications();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="flex-end">
            <SoftBox flex={1} mr={1}>
              <SoftInput
                placeholder={"Search notifications..."}
                icon={{ component: "search", direction: "left" }}
                value={filter.search}
                onChange={handleChangeSearch}
              />
            </SoftBox>

            <SoftButton variant="gradient" color="dark" onClick={handleCreate}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add new Notifications
            </SoftButton>
          </SoftBox>

          <Card>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
            </SoftBox>
          </Card>
          <SoftPagination
            item
            count={pagination.totalPage}
            page={filter.page}
            onChange={handleChangePage}
          />
        </SoftBox>
      </SoftBox>

      <Dialog maxWidth={700} open={open} onClose={handleCloseModal}>
        <SoftBox
          component={"form"}
          role={"form"}
          display={"flex"}
          flexDirection={"column"}
          px={5}
          my={3}
          width={700}
          onSubmit={handleSubmit}
        >
          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Title
              </SoftTypography>
            </SoftBox>
            <SoftInput
              autoFocus
              value={formData.title}
              name={"title"}
              placeholder={"Enter title"}
              onChange={handleChangeForm}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Price
              </SoftTypography>
            </SoftBox>
            <SoftInput
              value={formData.price}
              name={"price"}
              placeholder={"Enter price"}
              onChange={handleChangeForm}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Content
              </SoftTypography>
            </SoftBox>

            <Editor
              apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
              value={formData.message}
              onEditorChange={(e) => handleChangeForm({ target: { name: "message", value: e } })}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </SoftBox>

          <SoftBox mt={2} mb={1}>
            <SoftButton
              variant="gradient"
              color="info"
              type={"submit"}
              fullWidth
              disabled={loading}
              onClick={handleSubmit}
            >
              {modalType === "edit" ? "Update" : "Create"}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Dialog>
    </DashboardLayout>
  );
}

export default Notifications;
