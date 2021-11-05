import React from "react";
import {
    Tabs,
    Tab
} from "@material-ui/core";

const Navigations = (props) => {
    const { value, items, onChange } = props;

    return (
        <Tabs
            value={value}
            onChange={(event, value) => onChange(value)}
        >
            {
                items.map((tab, idx) => (
                    <Tab
                        key={`navigation-tab-${idx}`}
                        label={tab.label}
                        value={tab.value}
                    />
                ))
            }
        </Tabs>
    )
}

export default Navigations
