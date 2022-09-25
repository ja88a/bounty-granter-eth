import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IProjectGrantData, rows as projectGrantsData } from './ProjectGrantList';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button } from '@mui/material';
import TabPanel from './ProjectGrantDetailsTabs';

const ProjectGrantDetails = () => {
    
    let { id } = useParams();
    if (!id) {
        id = '0';
    }

    const getProjectData = (id: string): IProjectGrantData => {
        for (let i = 0; i < projectGrantsData.length; i++) {
            if (projectGrantsData[i].id == id) {
                return projectGrantsData[i];
            }
        }
        return projectGrantsData[0];
    }

    const projectData = getProjectData(id);

    const navigate = useNavigate();
    const navigateBackToList = () => {
        navigate("/projects");
    }

    return (

        <div className="overflow-hidden bg-white sm:rounded-lg">
            <Button onClick={navigateBackToList} className="flex-1.5 pt-2 p-0">
                <NavigateBeforeIcon />Back to Projects
            </Button>
            <div className="py-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Project Grant: {projectData.name}</h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and statuses.</p> */}
            </div>
            <TabPanel />
            
        </div>
    );
}

export default ProjectGrantDetails;