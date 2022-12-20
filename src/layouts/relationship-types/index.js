import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import useRelationshipTypes from "./RelationshipTypesHook";
import SoftTypography from "../../components/SoftTypography";
import SoftButton from "../../components/SoftButton";
import Icon from "@mui/material/Icon";
import { Dialog } from "@mui/material";
import SoftInput from "../../components/SoftInput";
import SoftPagination from "../../components/SoftPagination";
import Switch from "@mui/material/Switch";

// Data

function RelationshipTypes() {
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
  } = useRelationshipTypes();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="flex-end">
            <SoftBox flex={1} mr={1}>
              <SoftInput
                placeholder={"Search relationship type..."}
                icon={{ component: "search", direction: "left" }}
                value={filter.search}
                onChange={handleChangeSearch}
              />
            </SoftBox>

            <SoftButton variant="gradient" color="dark" onClick={handleCreate}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add new Relationship type
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

      <Dialog open={open} onClose={handleCloseModal}>
        <SoftBox
          component={"form"}
          role={"form"}
          display={"flex"}
          flexDirection={"column"}
          px={5}
          my={3}
          width={400}
          onSubmit={handleSubmit}
        >
          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Relationship type name
              </SoftTypography>
            </SoftBox>
            <SoftInput
              value={formData.name}
              name={"name"}
              placeholder={"Enter relationship type name"}
              onChange={handleChangeForm}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Default
              </SoftTypography>
            </SoftBox>
            <Switch checked={formData.isDefault} name={"isDefault"} onChange={handleChangeForm} />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Relationship type description
              </SoftTypography>
            </SoftBox>
            <SoftInput
              value={formData.description}
              multiline
              rows={4}
              name={"description"}
              placeholder={"Enter relationship type description"}
              onChange={handleChangeForm}
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

export default RelationshipTypes;
