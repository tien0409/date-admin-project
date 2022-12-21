import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import usePassionsHook from "./PassionHook";
import SoftTypography from "../../components/SoftTypography";
import SoftButton from "../../components/SoftButton";
import Icon from "@mui/material/Icon";
import { Dialog } from "@mui/material";
import SoftInput from "../../components/SoftInput";
import SoftPagination from "../../components/SoftPagination";
import { MuiColorInput } from "mui-color-input";

// Data

function Passions() {
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
  } = usePassionsHook();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="flex-end">
            <SoftBox flex={1} mr={1}>
              <SoftInput
                placeholder={"Search passion..."}
                icon={{ component: "search", direction: "left" }}
                value={filter.search}
                onChange={handleChangeSearch}
              />
            </SoftBox>

            <SoftButton variant="gradient" color="dark" onClick={handleCreate}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add new Passion
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
                Passion name
              </SoftTypography>
            </SoftBox>
            <SoftInput
              autoFocus
              value={formData.name}
              name={"name"}
              placeholder={"Enter passion name"}
              onChange={handleChangeForm}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Background color
              </SoftTypography>
            </SoftBox>
            <MuiColorInput
              value={formData.bgColor}
              format={"hex"}
              name="bgColor"
              onChange={(value) => handleChangeForm({ target: { name: "bgColor", value: value } })}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Foreground color
              </SoftTypography>
            </SoftBox>
            <MuiColorInput
              value={formData.fgColor}
              format={"hex"}
              name="fgColor"
              onChange={(value) => handleChangeForm({ target: { name: "fgColor", value: value } })}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Border color
              </SoftTypography>
            </SoftBox>
            <MuiColorInput
              value={formData.borderColor}
              format={"hex"}
              name="borderColor"
              onChange={(value) =>
                handleChangeForm({ target: { name: "borderColor", value: value } })
              }
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftBox ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Passion description
              </SoftTypography>
            </SoftBox>
            <SoftInput
              value={formData.description}
              multiline
              rows={4}
              name={"description"}
              placeholder={"Enter passion description"}
              onChange={handleChangeForm}
            />
          </SoftBox>

          <SoftBox mb={2} display={"flex"} justifyContent={"center"}>
            <SoftTypography
              sx={{ color: formData.fgColor }}
              padding={"3px 13px"}
              borderRadius={"3px"}
              display="inline-block"
              backgroundColor={formData.bgColor}
              border={`1px solid ${formData.borderColor}`}
              fontSize={14}
            >
              # {formData.name}
            </SoftTypography>
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

export default Passions;
