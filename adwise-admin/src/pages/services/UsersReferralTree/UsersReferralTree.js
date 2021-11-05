import React, { Component } from "react";
import {
    Box,
    Grid, Link,
    Typography,
} from "@material-ui/core";
import {
    ArrowDown as ArrowDownIcon
} from "react-feather";
import Tree from "react-d3-tree";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";

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
const svgSquare = {
    "shape": "rect",
    "shapeProps": {
        "width": 200,
        "height": 20,
        "y": -20,
        "x": 0
    },
}
const stylesText = {
    fontFamily: 'Atyp Display',
    fontSize: 14
};

class UsersReferralTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: {},
            dataTree: {},

            userRefTree: [],

            isLoading: true,
            isError: false
        };
    }

    componentDidMount = () => {
        this.getReferralTree();
    }

    getReferralTree = () => {
        const userId = this.props.match.params.id;

        if ( !userId ) {
            this.setState({ isError: true });

            return null
        }

        axiosInstance(`${ apiUrls["get-user-ref-tree"] }/${ userId }`).then( async (response) => {
            this.setState({
                userRefTree: await this.getUserRefTree(response.data.data.userTree),
                isLoading: false
            })
        }).catch((error) => {
            this.setState({ isError: true })
        });
    }

    getUserRefTree = async (data) => {
        let object = {};
        const lastObject = {
            name: `${data?.user?.firstName} ${data?.user?.lastName}`,
            attributes: {},
            children: await this.getChildrenUserRefTree(data.children)
        };

        if (data.parent) {
            object = this.getUserParent(data.parent, object, lastObject);
        } else {
            object = lastObject;
        }

        console.log('object: ', object);

        this.setState({ dataTree: [object] });
    }
    getUserParent = (data, object, lastObject) => {
        let parents = [];

        const getParents = function(data) {
            if (data.parent) {
                getParents(data.parent);
            }

            parents.push(data.user);
        }
        getParents(data, parents);
        parents.reverse();

        object = {
            name: `Переломный момент`,
            attributes: {},
            children: [lastObject]
        };

        parents.map((parent, idx) => {
            object = {
                name: `${parent?.firstName} ${parent?.lastName}`,
                attributes: {

                },
                children: [object]
            };
        })

        return object;
    }
    getChildrenUserRefTree = async (children) => {
        let data = [];

        if (children.length < 0) {
            return data
        }

        await Promise.all(children.map(async (item) => {
            children = await axiosInstance.get(`${apiUrls['get-user-ref-tree-children']}/${item?.user?._id}`).then((res) => res.data.data.userTree.children);

            data.push({
                name: `${item?.user?.firstName} ${item?.user?.lastName}`,
                _id: item?.user._id,
                children: await this.getChildrenUserRefTree(children)
            });
        }));

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

        const { dataTree } = this.state;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                <Box mb={3}>
                    <Typography variant="h1">Реферально дерево</Typography>
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

const Parent = (props) => {
    const { name, _id, children, level } = props;

    console.log('children: ', children);

    return (
        <Grid container spacing={2} justify="center" >

            <Grid item xs={12} justify="center" alignItems="center">
                <Typography style={{textAlign: 'center'}} variant="h5">{level} уровень</Typography>
            </Grid>

            <Grid container spacing={2} justify="center" alignItems="center">
                {children.map((item) => (
                    <Grid item>
                        <Box mb={2} p={4} borderRadius={10} bgcolor="#8152E4">
                            <Link target='_blank' href={`/users?_id=${_id}`}>
                                <Typography style={{color: "white"}} variant="h4">{name}</Typography>
                            </Link>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {
                (children && children.length > 0) && (

                    <>

                        <Box my={2} width="100%" display="flex" justifyContent="center" alignItems="center">
                            <ArrowDownIcon color="rgb(129, 82, 228)"/>
                        </Box>

                        <Parent {...children} level={level + 1}/>

                    </>
                )
            }

        </Grid>
    )
}

export default UsersReferralTree
