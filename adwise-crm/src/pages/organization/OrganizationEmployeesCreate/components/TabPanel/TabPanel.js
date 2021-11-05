import React from "react";

const TabPanel = (props) => {
    const { value, index, children } = props;

    if (value !== index) {
        return null
    }

    return (
        <>
            { children }
        </>
    )
}

export default TabPanel
