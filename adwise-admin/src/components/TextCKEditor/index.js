import React from "react";
import {
    Box,
    Typography,
    FormHelperText
} from "@material-ui/core";
import CKEditor from 'ckeditor4-react-advanced';

const TextCKEditor = (props) => {
    const {isFullSettings, value, name, onChange, error, helperText} = props;

    const handleOnChange = ({editor}) => {
        console.log('editor: ', editor);

        const target = {
            name,
            value: editor.getData()
        };

        onChange({target});
    }

    return (
        <>

            <CKEditor
                data={value}
                config={isFullSettings ? imageConfig : config}
                onChange={handleOnChange}
            />

            {
                (error) && (
                    <Box mt={1}>
                        <FormHelperText error>{helperText}</FormHelperText>
                    </Box>
                )
            }

        </>
    )
};

const config = {
    toolbar: [['Bold']],
    stylesSet: 'my_styles'
}
const imageConfig = {
    toolbar: [['Bold'], ['Image']]
}

// , 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
// 'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo'

export default TextCKEditor
