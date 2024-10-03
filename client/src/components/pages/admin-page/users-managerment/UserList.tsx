import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../../redux/stores";
import {
  fetchAllUsers,
  updateUser,
  deleteUser,
} from "../../../../redux/users/userThunks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useSelector((state: RootState) => state.user.items);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [tab, setTab] = useState<string>("admin");

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
        dispatch(fetchAllUsers()); // Cập nhật danh sách người dùng sau khi thay đổi vai trò
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

  return (
    <>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="Admin" value="admin" />
        <Tab label="Guest" value="guest" />
      </Tabs>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(tab === "admin" ? adminUsers : guestUsers).map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSelectedUser(user._id);
                    setNewRole(user.role);
                  }}
                >
                  {user.role}
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(user._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
