import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserDashbord } from '../redux/user/user.slice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button, TextField } from '@mui/material';
import { Pagination } from '@mui/material';

const UsersDashbord = ({ setReload, reload }) => {
  const dispatch = useDispatch();
  const initialRoles = {};
  const [roles, setRoles] = useState(initialRoles);
  const [validations, setValidations] = useState({});
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [page, setPage] = useState(0);

  const users = useSelector((state) => state.user?.users);

  useEffect(() => { 
    setRoles({});
    setValidations({}); 
  }, [reload]);

  const handleChange = (e, userId) => {
    const { value } = e.target;
    setRoles(prevRoles => ({
        ...prevRoles,
        [userId]: value
    }));
    dispatch(updateUserDashbord({ id: userId, newUser: { role: value } }));
    setReload(!reload);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterRole = (e) => {
    setFilterRole(e.target.value);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleValidationChange = (userId, isValidate) => {
    dispatch(updateUserDashbord({ id: userId, newUser: { isValidate } })).then(() => {
      setValidations(prevValidations => ({
        ...prevValidations,
        [userId]: isValidate
      }));
      setReload(!reload);
    });
  };

  const filteredUsers = users?.filter((el) => el.role !== "ADMIN")
    .filter((user) => user.firstname.toLowerCase().includes(search.toLowerCase()) || user.lastname.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => filterRole === '' || user.role.toLowerCase() === filterRole.toLowerCase());

  const paginatedUsers = filteredUsers?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div
      className='px-6 w-full h-screen flex justify-center items-center grid'
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div>
        <TextField
          title="Search a user "
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
        />
        <Select
          title="Filter by role"
          labelId="filter-role-label"
          id="filter-role"
          value={filterRole}
          onChange={handleFilterRole}
          size="small"
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="regular">Regular</MenuItem>
          <MenuItem value="special">Special</MenuItem>
        </Select>
        <Select
          title="Set pages"
          labelId="rows-per-page-label"
          id="rows-per-page"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          size="small"
        >
          <MenuItem value={5}>5 rows per page</MenuItem>
          <MenuItem value={10}>10 rows per page</MenuItem>
          <MenuItem value={20}>20 rows per page</MenuItem>
        </Select>
      </div>
      <TableContainer> 
        <Table>
          <TableHead className="bg-teal-700 ">
            <TableRow>
              <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase ">FirstName</TableCell>
              <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase">LastName</TableCell>
              <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase">Email</TableCell>
              <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase">Role</TableCell>
              <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase">Validation</TableCell>
              <TableCell className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    name="role"
                    value={roles[user._id] || user?.role}
                    onChange={(e) => handleChange(e, user._id)}
                  >
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="special">Special</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {validations[user._id] !== undefined
                    ? validations[user._id] ? 'Validated' : 'Not validated'
                    : user.isValidate ? 'Validated' : 'Pending'}
                </TableCell>
                <TableCell>
                  <button 
                    className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-1 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
                    onClick={() => handleValidationChange(user._id, true)}>
                    Accept
                  </button>
                  <button 
                    className="bg-red-600 text-white active:bg-red-800 font-bold uppercase text-sm px-1 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
                    onClick={() => handleValidationChange(user._id, false)}>
                    Deny
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> 
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredUsers?.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default UsersDashbord;
