import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Box,
  Paper,
  Checkbox,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/usersService';
import { changeUserRoleById } from '../services/usersService';
import { blockUserById } from '../services/usersService';
import { unBlockUserById } from '../services/usersService';
import { deleteUserById } from '../services/usersService';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedRows, setSelectedRows] = useState([])

  const handleRoleChange = (userId, isAdmin) => {
    changeUserRoleById(userId)
      .then((response) => {
        const updatedUsers = users.map((user) => {
          if (user._id === response.data.user._id) {
            return { ...user, is_admin: response.data.user.is_admin };
          }
          return user;
        });
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  useEffect(() => {
      getUsers()
      .then((res) => {
          setUsers(res);
          setTotalUsers(res.length);
      })
      .catch((err)=>{
        console.log(err)
      });
  }, []);

  const columns = [
    { field: '_id', headerName: 'ID', width: 150 },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to={`/user/${params.row._id}`} style={{ textDecoration: 'none' }} >
          <Avatar alt={params.row.name} src={params.row.photo_url} style={{ marginRight: '8px' }} />
          </Link>
          {params.row.name}
        </div>
      ),
    },
    {
      field: 'is_admin',
      headerName: 'Admin',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
          checked={params.row.is_admin}
          onChange={(e) => handleRoleChange(params.row._id, e.target.checked)}
           />
        </div>
      ),
    },
    { field: 'is_blocked',
    headerName: 'Status',
    width: 150,
    renderCell:(params) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {params.row.is_blocked ? <Typography> Blocked </Typography> : <Typography> Unblocked </Typography>}
      </div>
    ),
  },

  ];


  const handleLock = async () => {
    selectedRows.forEach((id)=>{
      console.log(id)
      blockUserById(id)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          const updatedUsers = users.map((user) => {
            if (user._id === res.data.user._id) {
              return res.data.user;
            }
            return user;
          });
          setUsers(updatedUsers);
        }
      })
      .catch((err)=>{
        console.log(err)
      });
    })
  };

  const handleUnlock = async () => {
    selectedRows.forEach((id)=>{
      unBlockUserById(id)
      .then((res) => {
        if (res.status === 200) {
          const updatedUsers = users.map((user) => {
            if (user._id === res.data.user._id) {
              return res.data.user;
            }
            return user;
          });
          setUsers(updatedUsers);
        }
      })
      .catch((err)=>{
        console.log(err)
      });
    })
  };

  const handleDelete = async () => {
    selectedRows.forEach((id)=>{
      deleteUserById(id)
      .then((res) => {
        if (res.status === 200) {
          setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        }
      })
      .catch((err)=>{
        console.log(err)
      });
    })


  };


  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Typography variant="h5">Admin Dashboard</Typography>
          <Typography variant="body1">
            Total Registered Users: {totalUsers}
          </Typography>
        </CardContent>
      </Card>

      <Box mt={2}>
        <Paper elevation={3}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="secondary" // Красный цвет для удаления
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
            style={{ marginRight: '8px' }}
          >
            Удалить
          </Button>
          <Button
            variant="contained"
            color="primary" // Зеленый цвет для разблокировки
            onClick={handleUnlock}
            disabled={selectedRows.length === 0}
            style={{ marginRight: '8px' }}
          >
            Разблокировать
          </Button>
          <Button
            variant="contained"
            color="warning" // Желтый цвет для блокировки
            onClick={handleLock}
            disabled={selectedRows.length === 0}
          >
            Заблокировать
          </Button>
        </div>

          <div style={{ height: 500, width: '100%' }}>

            <DataGrid
              rows={users}
              columns={columns}
              pageSize={5}
              checkboxSelection
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10]}
              onRowSelectionModelChange={(rowSelectionModel)=>{
                  setSelectedRows(rowSelectionModel)
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
            />
          </div>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPage;
