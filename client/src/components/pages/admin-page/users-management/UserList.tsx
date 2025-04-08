import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/stores";
import {
  fetchAllUsers,
  updateUser,
  deleteUser,
} from "../../../../redux/users/userThunks";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  Typography,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useSelector((state: RootState) => state.user.items);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [tab, setTab] = useState<string>("admin");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleChange = async () => {
    if (selectedUser) {
      try {
        await dispatch(
          updateUser({
            userId: selectedUser,
            userData: { role: newRole.toLowerCase() },
          })
        ).unwrap();
        console.log("Role updated successfully");
      } catch (error) {
        console.error("Failed to update role", error);
      } finally {
        setSelectedUser(null);
        setNewRole("");
        dispatch(fetchAllUsers());
      }
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const filteredUsers = users.filter((user) => user._id !== currentUser?._id);
  const adminUsers = filteredUsers.filter((user) => user.role === "admin");
  const guestUsers = filteredUsers.filter((user) => user.role === "guest");

  const handleExportToExcel = () => {
    const adminData = adminUsers.map((user) => ({
      ID: user._id,
      Name: user.fullName,
      Email: user.email,
      Role: user.role,
    }));

    const guestData = guestUsers.map((user) => ({
      ID: user._id,
      Name: user.fullName,
      Email: user.email,
      Role: user.role,
    }));

    const adminWs = XLSX.utils.json_to_sheet(adminData);
    const guestWs = XLSX.utils.json_to_sheet(guestData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, adminWs, "Admins");
    XLSX.utils.book_append_sheet(wb, guestWs, "Guests");

    XLSX.writeFile(wb, "Users_Export.xlsx");
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 150 },
    { field: "fullName", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setSelectedUser(params.id as string);
            setNewRole(params.row.role);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [tab]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleExportToExcel}
          sx={{
            backgroundColor: "#B8E5F63B",
            borderRadius: 2,
            color: "black",
            "&:hover": {
              backgroundColor: "#B8E5F6",
            },
          }}
        >
          Export to Excel
        </Button>
      </Box>
      <Tabs value={tab} onChange={(_e, newValue) => setTab(newValue)}>
        <Tab label="Admin" value="admin" />
        <Tab label="Guest" value="guest" />
      </Tabs>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={tab === "admin" ? adminUsers : guestUsers}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationMode="client"
          rowCount={tab === "admin" ? adminUsers.length : guestUsers.length}
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel: GridPaginationModel) =>
            setPaginationModel(newModel)
          }
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Box>
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <Box
          sx={{
            padding: 2,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            width: 300,
          }}
        >
          <Typography variant="h6">Change Role</Typography>
          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="guest">Guest</MenuItem>
          </Select>
          <Button onClick={handleRoleChange} sx={{ marginTop: 2 }}>
            Update Role
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UserList;
