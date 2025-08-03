import React from 'react';
import { useOutletContext } from 'react-router-dom';
import BlitzOverview from './views/BlitzOverview';

const BlitzView = () => {
    const { currentView } = useOutletContext();

    const renderBlitzView = () => {
        switch (currentView) {
            case 'overview':
            default:
                return <BlitzOverview />;
        }
    };

    return (
        <div>
            {renderBlitzView()}
        </div>
    );
};

export default BlitzView;