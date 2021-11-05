import React, {PureComponent} from "react";
import {
    Box

} from "@material-ui/core";
import JoditEditor from "jodit-react";
import {formatUnicode} from "../../helper/formatUnicodeMarkdown";



class TextWYSIWYG extends PureComponent {
    constructor(props) {
        super(props);

        this.refJoditEditor = React.createRef();
    }


    onChange = (props) => {
        this.props.onChange({
            target: {
                name: this.props.name,
                value: props
            }
        });
    }


    render() {
        const {value} = this.props;

        return (
            <Box>
                <JoditEditor
                    ref={this.refJoditEditor}
                    value={value}
                    config={config}
                    tabIndex={1}
                    onBlur={this.onChange}
                    onChange={this.onChange}
                />
            </Box>
        )
    }
}

const config = {
    readonly: false,
    autofocus: false,
    height: "400",
    toolbarAdaptive: false,
    "uploader": {
        "insertImageAsBase64URI": true
    },
}

export default TextWYSIWYG
