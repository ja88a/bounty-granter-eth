import React from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridColTypeDef, GridRowParams, GridRowsProp, MuiEvent } from '@mui/x-data-grid';
import { Stack, Button, Typography } from '@mui/material';
import Box from '@mui/system/Box';

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
    { field: 'col1', headerName: '#', type: 'number', headerClassName: 'super-app-theme--header', flex: 0.3 },
    { field: 'col2', headerName: 'Name', headerClassName: 'super-app-theme--header', flex: 4 },
    { field: 'col3', headerName: 'Status', headerClassName: 'super-app-theme--header', flex: 2 },
    { field: 'col4', headerName: 'Progress', headerClassName: 'super-app-theme--header', flex: 1.1 },
    { field: 'col5', headerName: 'Budget', type: 'usdPrice', headerClassName: 'super-app-theme--header', flex: 1.5, ...usdPrice },
    { field: 'col6', headerName: 'Committee', headerClassName: 'super-app-theme--header', flex: 2 },
    { field: 'col7', headerName: 'Last Update', type: 'date', headerClassName: 'super-app-theme--header', flex: 2 }
];

// { field: 'col8', headerName: 'Actions', headerClassName: 'super-app-theme--header', flex: 1.5 }


const rows: GridRowsProp = [
    {
        id: 1,
        col1: '105',
        col2: 'Stockholm EVOL gathering Nov. 2022',
        col3: 'Pending Validation',
        col4: '0 / 4',
        col5: '8549.53',
        col6: 'Sea Shepherd Grants',
        col7: '2022-09-23 19:23'
    },
    {
        id: 3,
        col1: '201',
        col2: 'EIP-1789 3.0 Final Rev.',
        col3: 'Draft',
        col4: '0 / 5',
        col5: '204220.86',
        col6: 'ETH Foundations',
        col7: '2022-09-25 12:10'
    },
    {
        id: 2,
        col1: '130',
        col2: 'Tokyo23 ratification C-469A',
        col3: 'In Progress',
        col4: '2 / 3',
        col5: '6832.10',
        col6: 'Sea Shepherd Grants',
        col7: '2022-06-04 10:44'
    },
    {
        id: 4,
        col1: '81',
        col2: 'Shockwave Delta network upgrade',
        col3: 'Closed',
        col4: '6 / 6',
        col5: '18840.92',
        col6: 'Secret Network',
        col7: '2022-09-22 06:03'
    },
    {
        id: 5,
        col1: '68',
        col2: 'ETHG NY 2022 Hackathon Support team',
        col3: 'Closed',
        col4: '3 / 3',
        col5: '9201.30',
        col6: 'Web3 Hack Committe',
        col7: '2022-08-23 18:03'
    }
];

const ListProjectGrants = () => {

    const createNewGrant = () => {

    };

    const openGrantDetails = (params: GridRowParams) => {
        console.log("Grant entry selected: " + params.id);
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
                <Box className="flex my-4">
                <Typography
                    variant="h6"
                    sx={{
                        flex: 7,
                        fontWeight: 400,
                        letterSpacing: '0.1rem',
                    }}
                >
                    Project Grants List
                </Typography>
                <Button size="small" onClick={createNewGrant} className="flex-2">
                    Initiate new Grant
                </Button>
                </Box>
                </div>
                <DataGrid autoHeight hideFooterSelectedRowCount onRowDoubleClick={openGrantDetails} rows={rows} columns={columns} />
            </Box>
        </div>
    );
};

export default ListProjectGrants;
