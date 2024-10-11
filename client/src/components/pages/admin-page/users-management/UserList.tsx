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

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useSelector((state: RootState) => state.user.items);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [tab, setTab] = useState<string>("admin");
  const [pageSize, setPageSize] = useState<number>(5);

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

  return (
    <>
      <Tabs value={tab} onChange={(_e, newValue) => setTab(newValue)}>
        <Tab label="Admin" value="admin" />
        <Tab label="Guest" value="guest" />
      </Tabs>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tab === "admin" ? adminUsers : guestUsers}
          columns={columns}
          getRowId={(row) => row._id}
          paginationModel={{ pageSize, page: 0 }}
          onPaginationModelChange={(model: GridPaginationModel) =>
            setPageSize(model.pageSize)
          }
          pagination
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
