import React, { Component } from "react";
import {
    Box,
    Grid,
    Typography,
} from "@material-ui/core";
import Tree from "react-d3-tree";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";

const svgSquare = {
    "shape": "rect",
    "shapeProps": {
        "width": 200,
        "height": 20,
        "y": -20,
        "x": 0
    },
}
const styleTree = {
    nodes:{
        node:{
            circle:{
                fill: '#8152e4',
                strokeWidth: 1
            },
            name:{
                fill: 'white',
                stroke: 'white',
                strokeWidth: 0
            },
            attributes:{
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            }
        },
        leafNode:{
            circle:{
                fill: '#ED8E0032',
                strokeWidth: 1
            },
            name:{
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            },
            attributes:{
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            }
        }
    }
}
const stylesText = {
    fontFamily: 'Atyp Display',
    fontSize: 14
};

class OrganizationReferralTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: {},
            dataTree: {},

            organizationRefTree: [],

            isLoading: true,
            isError: false
        };
    }

    componentDidMount = () => {
        this.getOrganization()
        this.getReferralTree();
    }

    getOrganization = () => {
        const organizationId = this.props.match.params.organizationId;

        if ( !organizationId ) {
            this.setState({ isError: true });

            return null
        }

        axiosInstance.get(`${ apiUrls["get-organization"] }/${ organizationId }`).then((response) => {
            this.setState({ organization: response.data.data.organization })
        })
    }

    getReferralTree = () => {
        const organizationId = this.props.match.params.organizationId;

        if ( !organizationId ) {
            this.setState({ isError: true });

            return null
        }

        axiosInstance(`${ apiUrls["get-organization-ref-tree"] }/${ organizationId }`).then((response) => {
            this.setState({
                organizationRefTree: this.getOrganizationRefTree(response.data.data.tree),
                isLoading: false
            })
        }).catch((error) => {
            this.setState({ isError: true })
        });
    }

    getOrganizationRefTree = (data) => {
        let object = {
            name: `Организация "${ this.state.organization.name }"`,
            attributes: {
                "рефералы": data.length
            },
            children: this.getChildrenOrganizationRefTree(data)
        };

        this.setState({ dataTree: object });
    }
    getChildrenOrganizationRefTree = (children) => {
        let data = [];

        children.map((child) => {

            console.log('child: , ', child)

            data.push({
                name: (!!child.subscriber) ? `${ child.subscriber.lastName || '' } ${ child.subscriber.firstName || '' } (${child.level}ур)` : '—',
                attributes: {
                    "рефералы": `${child.children.length}`
                },
                children: this.getChildrenOrganizationRefTree(child.children)
            })
        });

        return data
    }

    render() {
        if (this.state.isLoading) {
            return (
                <>

                    <Box mb={3}>
                        <Typography variant="h1">Реферально дерево</Typography>
                    </Box>

                    <Typography variant="h3">Идет загрузка и построение реферального дерева</Typography>

                </>
            )
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                <Box mb={3}>
                    <Typography variant="h1">Реферально дерево организации "<span style={{ color: "#8152E4" }}>{ this.state.organization.name }</span>"</Typography>
                </Box>

                <Box id="treeWrapper" style={{ flex: 1 }}>
                    <Tree
                        data={this.state.dataTree}
                        nodeSvgShape={svgSquare}
                        styles={styleTree}
                        textProps={stylesText}
                        depthFactor={110}
                        separation={{siblings:5 }}
                        nodeSize={{x:95}}
                        translate={{x:650, y:50}}

                        orientation="vertical"
                        pathFunc="step"

                        animated
                    />
                </Box>

            </div>
        );
    }
}

export default OrganizationReferralTree
