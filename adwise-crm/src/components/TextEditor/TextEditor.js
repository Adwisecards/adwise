import React, {useEffect, useState} from 'react';
import {
    Box,
    FormHelperText
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import CKEditor from 'ckeditor4-react';

const TextEditor = (props) => {
    const {value, onChange, error, helperText} = props;

    const [isAddingClassIframe, setAddingClassIframe] = useState(true);

    const handleSetStyles = () => {
        setTimeout(() => {
            const iframe = document.querySelector('.text-editor-container iframe');

            if (!!iframe && isAddingClassIframe) {
                const contentHead = iframe.contentWindow.document.querySelector('head');
                contentHead.innerHTML += "<link type=\"text/css\" rel=\"stylesheet\" href=\"/styles/index.css\">";
                setAddingClassIframe(false)
            }
        }, 1000);
    }

    const handleChangeData = (event) => {
        const value = event.editor.getData();

        onChange(value)
    }

    return (
        <Box
            className="text-editor-container"
            mt={2}
        >
            <CKEditor
                data={value}
                config={config}

                onChange={handleChangeData}
                onBeforeLoad={handleSetStyles}
            />

            {
                (error) && (
                    <FormHelperText error>{helperText}</FormHelperText>
                )
            }
        </Box>
    )
}

const config = {
    toolbar: [['Bold']],
    stylesSet: 'my_styles'
}

const useStyles = makeStyles((theme) => ({
    root: {},
}));

export default TextEditor
