import React from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridColTypeDef, GridRowParams, GridRowsProp, GridValidRowModel, MuiEvent } from '@mui/x-data-grid';
import { Stack, Button, Typography } from '@mui/material';
import Box from '@mui/system/Box';

import CheckIcon from '@mui/icons-material/Check';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/AddOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const usdPrice: GridColTypeDef = {
    type: 'number',
    width: 130,
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: 'font-tabular-nums',
};

const columns: GridColDef[] = [
    { field: 'token', headerName: '#', type: 'number', headerClassName: 'super-app-theme--header', flex: 0.3 },
    { field: 'name', headerName: 'Name', headerClassName: 'super-app-theme--header', flex: 4 },
    { field: 'status', headerName: 'Status', headerClassName: 'super-app-theme--header', flex: 2 },
    { field: 'progress', headerName: 'Progress', headerClassName: 'super-app-theme--header', flex: 1.1 },
    { field: 'budget', headerName: 'Budget', type: 'usdPrice', headerClassName: 'super-app-theme--header', flex: 1.5, ...usdPrice },
    { field: 'committee', headerName: 'Committee', headerClassName: 'super-app-theme--header', flex: 2 },
    { field: 'dateLast', headerName: 'Last Update', type: 'date', headerClassName: 'super-app-theme--header', flex: 2 }
];

// { field: 'col8', headerName: 'Actions', headerClassName: 'super-app-theme--header', flex: 1.5 }


export interface IProjectGrantData extends GridValidRowModel {
    id: string;
    token: string;
    name: string;
    status: string;
    progress: string;
    budget: number;
    committee: string;
    dateLast: string;
}

export let rows: GridRowsProp<IProjectGrantData> = [
    {
        id: '1',
        token: '105',
        name: 'Stockholm EVOL gathering Nov. 2022',
        status: 'Pending Validation',
        progress: '0 / 4',
        budget: 8549.53,
        committee: 'Sea Shepherd Grants',
        dateLast: '2022-09-23 19:23'
    },
    {
        id: '3',
        token: '201',
        name: 'EIP-1789 3.0 Final Rev.',
        status: 'Draft',
        progress: '0 / 5',
        budget: 204220.86,
        committee: 'ETH Foundations',
        dateLast: '2022-09-25 12:10'
    },
    {
        id: '2',
        token: '130',
        name: 'Tokyo23 ratification C-469A',
        status: 'In Progress',
        progress: '2 / 3',
        budget: 6832.10,
        committee: 'Sea Shepherd Grants',
        dateLast: '2022-06-04 10:44'
    },
    {
        id: '4',
        token: '81',
        name: 'Shockwave Delta network upgrade',
        status: 'Closed',
        progress: '6 / 6',
        budget: 18840.92,
        committee: 'Secret Network',
        dateLast: '2022-09-22 06:03'
    },
    {
        id: '5',
        token: '68',
        name: 'ETHG NY 2022 Hackathon Support team',
        status: 'Closed',
        progress: '3 / 3',
        budget: 9201.30,
        committee: 'Web3 Hack Committe',
        dateLast: '2022-08-23 18:03'
    }
];

const ListProjectGrants = () => {

    const createNewGrant = () => {

    };

    const navigate = useNavigate();
    const openGrantDetails = (params: GridRowParams) => {
        console.log("Grant entry selected: " + params.id);
        navigate("/projects/"+params.id);
    };

    return (
        <div className="my-4 flex-1">
            <Box sx={{
                '& .super-app-theme--header': {
                    backgroundColor: 'rgb(25, 118, 210, 0.85)',
                    color: 'white'
                }
            }}>
                <div className="container py-4">
                <Box className="flex mt-4">
                    <Typography
                        variant="h5"
                        sx={{
                            flex: 7,
                            fontWeight: 400,
                            letterSpacing: '0.1rem',
                        }}
                    >
                        Project Grants
                    </Typography>
                    <Button onClick={createNewGrant} className="flex-1.5 content-end pt-2">
                        <AddIcon className="p-1" />Initiate new Grant
                    </Button>
                </Box>
                </div>
                <DataGrid autoHeight hideFooterSelectedRowCount onRowClick={openGrantDetails} rows={rows} columns={columns} />
            </Box>
        </div>
    );
};

export default ListProjectGrants;
